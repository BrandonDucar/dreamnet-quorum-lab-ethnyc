import { createForecastReceipt, type ForecastRequest } from '../src/lib/quorum';
import { signRequest } from '@worldcoin/idkit-core/signing';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

type Env = {
  APP_MODE: 'paper';
  ASSETS: Fetcher;
  ENS_AGENT_NAMESPACE?: string;
  ETH_RPC_URL?: string;
  WORLD_ACTION_APPROVE?: string;
  WORLD_APP_ID?: string;
  WORLD_ENVIRONMENT?: 'production' | 'staging';
  WORLD_RP_ID?: string;
  WORLD_RP_SIGNING_KEY?: string;
  WORLD_VERIFY_BASE_URL?: string;
  WALRUS_AGGREGATOR_URL?: string;
  WALRUS_DELETABLE?: string;
  WALRUS_EPOCHS?: string;
  WALRUS_PUBLISHER_URL?: string;
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...init.headers
    }
  });
}

async function readForecastRequest(request: Request): Promise<ForecastRequest> {
  const body = (await request.json().catch(() => ({}))) as Partial<ForecastRequest>;
  return {
    market: String(body.market || 'crypto'),
    instrument: String(body.instrument || 'BTC'),
    horizon: String(body.horizon || '24h'),
    scenario: String(body.scenario || 'Evaluate a bounded market scenario.'),
    clientRequestId: String(body.clientRequestId || crypto.randomUUID())
  };
}

function ensClient(env: Env) {
  return createPublicClient({
    chain: mainnet,
    transport: http(env.ETH_RPC_URL || 'https://ethereum.publicnode.com')
  });
}

function cleanEnsName(value: string) {
  return value.trim().toLowerCase().replace(/^\*\./, '').replace(/[^a-z0-9.-]/g, '').slice(0, 180);
}

function cleanEnsTextKey(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9:[\]-]/g, '').slice(0, 220);
}

async function resolveEnsAgent(request: Request, env: Env) {
  const url = new URL(request.url);
  const namespace = cleanEnsName(env.ENS_AGENT_NAMESPACE || 'quorum.dreamnet.eth');
  const requested = cleanEnsName(url.searchParams.get('name') || namespace);
  const name = requested.includes('.') ? requested : `${requested}.${namespace}`;
  const registry = cleanEnsTextKey(url.searchParams.get('registry') || '');
  const agentId = cleanEnsTextKey(url.searchParams.get('agentId') || '');
  const agentRegistrationKey = registry && agentId ? `agent-registration[${registry}][${agentId}]` : '';
  const client = ensClient(env);

  const [address, description, agentContext, mcpEndpoint, webEndpoint, agentRegistration] = await Promise.all([
    client.getEnsAddress({ name }).catch(() => null),
    client.getEnsText({ name, key: 'description' }).catch(() => null),
    client.getEnsText({ name, key: 'agent-context' }).catch(() => null),
    client.getEnsText({ name, key: 'agent-endpoint[mcp]' }).catch(() => null),
    client.getEnsText({ name, key: 'agent-endpoint[web]' }).catch(() => null),
    agentRegistrationKey ? client.getEnsText({ name, key: agentRegistrationKey }).catch(() => null) : Promise.resolve(null)
  ]);

  return json({
    name,
    namespace,
    resolved: Boolean(address || description || agentContext || mcpEndpoint || webEndpoint || agentRegistration),
    address,
    records: {
      description,
      agentContext,
      agentEndpointMcp: mcpEndpoint,
      agentEndpointWeb: webEndpoint,
      agentRegistrationKey: agentRegistrationKey || null,
      agentRegistration
    },
    activationRequired: !address && !description && !agentContext && !mcpEndpoint && !webEndpoint && !agentRegistration
  });
}

function worldConfig(env: Env) {
  const action = env.WORLD_ACTION_APPROVE || 'approve-quorum-receipt';
  return {
    configured: Boolean(env.WORLD_RP_ID && env.WORLD_APP_ID && env.WORLD_RP_SIGNING_KEY),
    action,
    appId: env.WORLD_APP_ID || null,
    environment: env.WORLD_ENVIRONMENT || 'production',
    rpId: env.WORLD_RP_ID || null,
    verifyBaseUrl: env.WORLD_VERIFY_BASE_URL || 'https://developer.world.org',
    credential: 'proof-of-human',
    trial: {
      type: 'one-human-one-trial',
      uses: 3,
      enforcedBy: 'World ID nullifier per action'
    },
    purpose: 'Verify that a real human operator approved a quorum receipt boundary crossing.'
  };
}

function walrusConfig(env: Env) {
  return {
    network: 'testnet',
    publisherUrl: env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space',
    aggregatorUrl: env.WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space',
    epochs: Math.max(1, Math.min(53, Number(env.WALRUS_EPOCHS || 7) || 7)),
    deletable: env.WALRUS_DELETABLE !== 'false'
  };
}

function extractBlobId(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const direct = candidate.blobId || candidate.blob_id;
  if (typeof direct === 'string') {
    return direct;
  }

  const newlyCreated = candidate.newlyCreated as Record<string, unknown> | undefined;
  if (newlyCreated) {
    const blobObject = newlyCreated.blobObject as Record<string, unknown> | undefined;
    const blobId = newlyCreated.blobId || blobObject?.blobId;
    if (typeof blobId === 'string') {
      return blobId;
    }
  }

  const alreadyCertified = candidate.alreadyCertified as Record<string, unknown> | undefined;
  if (alreadyCertified) {
    const blobId = alreadyCertified.blobId;
    if (typeof blobId === 'string') {
      return blobId;
    }
  }

  return null;
}

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function walrusReceiptPayload(receipt: ReturnType<typeof createForecastReceipt>) {
  return {
    schema: 'dreamnet.quorum.receipt.v1',
    receipt,
    storageIntent: {
      provider: 'walrus',
      network: 'testnet',
      purpose: 'content-addressed quorum receipt archive',
      whyWalrus: 'Quorum receipts are audit artifacts. They should be tamper-evident, retrievable, and independently verifiable.'
    },
    createdAt: new Date().toISOString()
  };
}

async function storeWalrusReceipt(request: Request, env: Env) {
  const forecastRequest = await readForecastRequest(request);
  const receipt = createForecastReceipt(forecastRequest);
  const config = walrusConfig(env);
  const payload = walrusReceiptPayload(receipt);
  const body = JSON.stringify(payload, null, 2);
  const localHash = await sha256Hex(body);
  const publishUrl = `${config.publisherUrl.replace(/\/$/, '')}/v1/blobs?epochs=${config.epochs}&deletable=${String(config.deletable)}`;

  const response = await fetch(publishUrl, {
    method: 'PUT',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body
  });

  const result = (await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }))) as Record<
    string,
    unknown
  >;
  const blobId = extractBlobId(result);

  if (!response.ok || !blobId) {
    return json(
      {
        error: 'walrus_store_failed',
        message: 'Walrus publisher did not return a certified blob id.',
        config,
        receipt,
        payload,
        storage: {
          provider: 'walrus',
          network: config.network,
          status: 'pending_upload',
          localHash,
          preparedCurl: `curl -X PUT "${publishUrl}" -H "content-type: application/json" --data-binary @receipt.json`
        },
        result
      },
      { status: 502 }
    );
  }

  const readUrl = `${config.aggregatorUrl.replace(/\/$/, '')}/v1/blobs/${blobId}`;
  const readResponse = await fetch(readUrl);
  const readBack = await readResponse.text();
  const readBackHash = await sha256Hex(readBack);
  const readBackVerified = readResponse.ok && localHash === readBackHash;

  return json({
    receipt,
    walrus: {
      network: config.network,
      blobId,
      publisherUrl: config.publisherUrl,
      aggregatorUrl: config.aggregatorUrl,
      readUrl,
      epochs: config.epochs,
      localHash,
      readBackHash,
      readBackVerified,
      result
    }
  });
}

async function createWorldRpSignature(request: Request, env: Env) {
  const config = worldConfig(env);

  if (!env.WORLD_RP_SIGNING_KEY || !config.rpId || !config.appId) {
    return json(
      {
        error: 'world_not_configured',
        message: 'Set WORLD_RP_ID, WORLD_APP_ID, and WORLD_RP_SIGNING_KEY before generating live World ID requests.',
        config
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string };
  const action = body.action || config.action;

  if (action !== config.action) {
    return json({ error: 'invalid_world_action', allowedAction: config.action }, { status: 400 });
  }

  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: env.WORLD_RP_SIGNING_KEY,
    action,
    ttl: 300
  });

  return json({
    action,
    app_id: config.appId,
    rp_id: config.rpId,
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt
  });
}

async function verifyWorldProof(request: Request, env: Env) {
  const config = worldConfig(env);

  if (!config.configured || !config.rpId) {
    return json(
      {
        error: 'world_not_configured',
        message: 'Set WORLD_RP_ID, WORLD_APP_ID, and WORLD_RP_SIGNING_KEY in Cloudflare secrets/vars before live World ID verification.',
        config
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    receiptId?: string;
    idkitResponse?: unknown;
  };

  if (!body.idkitResponse) {
    return json({ error: 'missing_idkit_response' }, { status: 400 });
  }

  const response = await fetch(`${config.verifyBaseUrl}/api/v4/verify/${config.rpId}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body.idkitResponse)
  });

  const result = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok || result.success !== true) {
    return json({ error: 'world_verification_failed', result }, { status: 400 });
  }

  return json({
    receiptId: body.receiptId || null,
    humanGate: 'verified',
    nullifier: result.nullifier || null,
    action: result.action || config.action,
    result
  });
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        service: 'dreamnet-quorum-lab',
        mode: env.APP_MODE,
        executionAllowed: false
      });
    }

    if (url.pathname === '/api/forecast' && request.method === 'POST') {
      const forecastRequest = await readForecastRequest(request);
      const receipt = createForecastReceipt(forecastRequest);
      return json({ receipt });
    }

    if (url.pathname === '/api/walrus/config' && request.method === 'GET') {
      return json(walrusConfig(env));
    }

    if (url.pathname === '/api/walrus/store-receipt' && request.method === 'POST') {
      return storeWalrusReceipt(request, env);
    }

    if (url.pathname === '/api/ens/resolve' && request.method === 'GET') {
      return resolveEnsAgent(request, env);
    }

    if (url.pathname === '/api/world/config' && request.method === 'GET') {
      return json(worldConfig(env));
    }

    if (url.pathname === '/api/world/rp-signature' && request.method === 'POST') {
      return createWorldRpSignature(request, env);
    }

    if (url.pathname === '/api/world/verify' && request.method === 'POST') {
      return verifyWorldProof(request, env);
    }

    if (url.pathname.startsWith('/api/execute')) {
      return json(
        {
          error: 'execution_blocked',
          message: 'DreamNet Quorum Lab is paper-mode only for ETHGlobal NYC 2026.'
        },
        { status: 403 }
      );
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'not_found' }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
