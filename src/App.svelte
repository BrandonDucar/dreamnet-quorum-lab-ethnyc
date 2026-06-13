<script lang="ts">
  import { onMount } from 'svelte';
  import {
    createForecastReceipt,
    type ForecastReceipt,
    type QuorumVote,
    type VoteStance
  } from './lib/quorum';

  type EnsResolution = {
    name: string;
    namespace: string;
    resolved: boolean;
    address: string | null;
    records: {
      description: string | null;
      agentContext: string | null;
      agentEndpointMcp: string | null;
      agentEndpointWeb: string | null;
      agentRegistrationKey: string | null;
      agentRegistration: string | null;
    };
    activationRequired: boolean;
  };

  type WorldConfig = {
    configured: boolean;
    action: string;
    appId: string | null;
    environment: 'production' | 'staging';
    rpId: string | null;
    credential: string;
    trial: {
      type: string;
      uses: number;
      enforcedBy: string;
    };
    purpose: string;
  };

  type WorldRpSignature = {
    action: string;
    app_id: string;
    rp_id: string;
    sig: string;
    nonce: string;
    created_at: number;
    expires_at: number;
  };

  type WalrusStoreResult = {
    network: string;
    blobId: string;
    publisherUrl: string;
    aggregatorUrl: string;
    readUrl: string;
    epochs: number;
    localHash: string;
    readBackHash: string;
    readBackVerified: boolean;
  };

  const stanceLabels: Record<VoteStance, string> = {
    long: 'Approve',
    short: 'Reject',
    abstain: 'Abstain',
    no_trade: 'Hold'
  };

  const stanceOrder: VoteStance[] = ['long', 'abstain', 'short', 'no_trade'];

  let market = 'Coordination';
  let instrument = 'ETHGlobal build decision';
  let horizon = 'tonight';
  let scenario =
    'Evaluate whether the swarm should ship the public Cloudflare demo with paper-mode receipts, public repo, and video proof.';
  let receipt: ForecastReceipt = createForecastReceipt({
    market,
    instrument,
    horizon,
    scenario,
    clientRequestId: 'local-preview'
  });
  let status = 'Paper mode active. No execution route exists.';
  let busy = false;
  let copied = false;
  let ensName = 'vitalik.eth';
  let ensRegistry = '';
  let ensAgentId = '';
  let ensResult: EnsResolution | null = null;
  let ensStatus = 'Resolve any ENS name or a future DreamNet agent slug.';
  let ensBusy = false;
  let worldConfig: WorldConfig | null = null;
  let worldBusy = false;
  let worldStatus = 'World ID proof required before any future receipt can cross the execution boundary.';
  let worldConnectUrl = '';
  let worldVerified = false;
  let walrusResult: WalrusStoreResult | null = null;
  let walrusBusy = false;
  let walrusStatus = 'Store the receipt JSON as a Walrus blob for decentralized auditability.';

  const systemRows = [
    ['Agent ring', '31 / 31 online', 'green'],
    ['Agent OS', '34,012 registry', 'blue'],
    ['Identity layer', 'Live ENS resolver', 'violet'],
    ['Human gate', 'World ID ready', 'coral'],
    ['Receipt storage', 'Walrus ready', 'cyan'],
    ['Receipt API', 'Cloudflare-ready', 'cyan'],
    ['Execution mode', 'Paper only', 'amber'],
    ['Public repo', 'Live', 'green']
  ];

  function pct(value: number) {
    return `${Math.round(value * 100)}%`;
  }

  function barWidth(count: number) {
    return `${Math.max(5, Math.round((count / receipt.quorum.size) * 100))}%`;
  }

  function nodeStyle(index: number) {
    const angle = (index / receipt.quorum.size) * Math.PI * 2 - Math.PI / 2;
    const radius = 42;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return `left:${x}%;top:${y}%;`;
  }

  function stanceClass(vote: QuorumVote) {
    return `vote-node ${vote.stance}`;
  }

  async function runForecast() {
    busy = true;
    copied = false;
    status = 'Quorum evaluation running...';

    const request = {
      market,
      instrument,
      horizon,
      scenario,
      clientRequestId: crypto.randomUUID()
    };

    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(request)
      });
      const data = (await response.json()) as { receipt?: ForecastReceipt; error?: string };
      if (!response.ok || !data.receipt) {
        throw new Error(data.error || 'API returned no receipt.');
      }
      receipt = data.receipt;
      status = 'Cloudflare Worker receipt generated. Execution remains blocked.';
    } catch {
      receipt = createForecastReceipt(request);
      status = 'Local receipt generated. Demo fallback active.';
    } finally {
      busy = false;
    }
  }

  async function copyReceipt() {
    await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
    copied = true;
    status = 'Receipt copied.';
  }

  async function resolveEns() {
    ensBusy = true;
    ensStatus = 'Resolving ENS records on mainnet...';
    try {
      const params = new URLSearchParams({ name: ensName });
      if (ensRegistry) {
        params.set('registry', ensRegistry);
      }
      if (ensAgentId) {
        params.set('agentId', ensAgentId);
      }
      const response = await fetch(`/api/ens/resolve?${params.toString()}`);
      const data = (await response.json()) as EnsResolution;
      if (!response.ok) {
        throw new Error('ENS resolver failed.');
      }
      ensResult = data;
      ensStatus = data.resolved
        ? 'Live ENS records resolved.'
        : 'No records found yet. This name needs activation.';
    } catch {
      ensResult = null;
      ensStatus = 'ENS lookup failed. Try again or use another name.';
    } finally {
      ensBusy = false;
    }
  }

  async function loadWorldConfig() {
    try {
      const response = await fetch('/api/world/config');
      worldConfig = (await response.json()) as WorldConfig;
    } catch {
      worldConfig = null;
    }
  }

  async function startWorldVerification() {
    worldBusy = true;
    worldVerified = false;
    worldConnectUrl = '';
    try {
      if (!worldConfig?.configured || !worldConfig.appId || !worldConfig.rpId) {
        worldStatus = 'World credentials are not configured yet. Add app_id, rp_id, and signing key in Cloudflare.';
        return;
      }

      worldStatus = 'Requesting server-signed World ID challenge...';
      const signatureResponse = await fetch('/api/world/rp-signature', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: worldConfig.action })
      });
      const rpSignature = (await signatureResponse.json()) as WorldRpSignature;
      if (!signatureResponse.ok) {
        throw new Error('World signature request failed.');
      }

      const { IDKit, proofOfHuman } = await import('@worldcoin/idkit-core');
      const request = await IDKit.request({
        app_id: worldConfig.appId as `app_${string}`,
        action: worldConfig.action,
        rp_context: {
          rp_id: worldConfig.rpId as `rp_${string}`,
          nonce: rpSignature.nonce,
          created_at: rpSignature.created_at,
          expires_at: rpSignature.expires_at,
          signature: rpSignature.sig
        },
        allow_legacy_proofs: true,
        environment: worldConfig.environment
      }).preset(proofOfHuman({ signal: receipt.receiptId }));

      worldConnectUrl = request.connectorURI || '';
      worldStatus = worldConnectUrl
        ? 'Open the World App link or scan it from your phone, then approve the proof.'
        : 'Waiting for World App approval...';

      const completion = await request.pollUntilCompletion({
        pollInterval: 2_000,
        timeout: 120_000
      });

      const verifyResponse = await fetch('/api/world/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ receiptId: receipt.receiptId, idkitResponse: completion })
      });
      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyResult?.error || 'World verification failed.');
      }

      worldVerified = true;
      worldStatus = 'World ID proof verified. Receipt has a real human approval gate.';
    } catch {
      worldStatus = 'World verification did not complete. Execution remains blocked.';
    } finally {
      worldBusy = false;
    }
  }

  async function storeWalrusReceipt() {
    walrusBusy = true;
    walrusStatus = 'Publishing receipt JSON to Walrus Testnet...';
    try {
      const response = await fetch('/api/walrus/store-receipt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          market,
          instrument,
          horizon,
          scenario,
          clientRequestId: receipt.clientRequestId
        })
      });
      const data = (await response.json()) as { walrus: WalrusStoreResult };
      if (!response.ok || !data.walrus) {
        throw new Error('Walrus receipt storage failed.');
      }
      walrusResult = data.walrus;
      walrusStatus = data.walrus.readBackVerified
        ? 'Walrus blob stored and read-back hash verified.'
        : 'Walrus blob stored, but read-back verification did not match yet.';
    } catch {
      walrusResult = null;
      walrusStatus = 'Walrus storage did not complete. Receipt remains local and paper-only.';
    } finally {
      walrusBusy = false;
    }
  }

  onMount(() => {
    void loadWorldConfig();
  });
</script>

<svelte:head>
  <title>DreamNet Quorum Lab</title>
</svelte:head>

<main class="shell">
  <header class="topbar">
    <a class="brand" href="https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc" target="_blank" rel="noreferrer">
      <span class="sigil" aria-hidden="true">
        {#each Array(7) as _, index}
          <i style={`--i:${index}`}></i>
        {/each}
      </span>
      <span>
        <b>DreamNet</b>
        <small>Quorum Lab</small>
      </span>
    </a>

    <nav aria-label="Sections">
      <a href="#lab">Lab</a>
      <a href="#receipt">Receipt</a>
      <a href="#proof">Proof</a>
      <a href="https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc" target="_blank" rel="noreferrer">Repo</a>
    </nav>

    <div class="live-pill">
      <span></span>
      Live paper mode
    </div>
  </header>

  <section class="hero" id="lab">
    <div>
      <p class="kicker">Built for ETHGlobal NYC 2026</p>
      <h1>31 agents vote. One receipt proves the boundary.</h1>
    </div>
    <p>
      DreamNet Quorum Lab is the public wedge for the Agent OS: live ENS agent identity, quorum math, disagreement, lineage, and World ID human approval before execution.
    </p>
  </section>

  <section class="console" aria-label="DreamNet Quorum Lab console">
    <form class="panel scenario-card" on:submit|preventDefault={runForecast}>
      <div class="panel-head">
        <span>Live Scenario</span>
        <button class="ghost" type="button" on:click={() => (scenario = '')}>Clear</button>
      </div>

      <label>
        <span>Decision surface</span>
        <textarea bind:value={scenario} maxlength="500" rows="7"></textarea>
        <small>{scenario.length} / 500</small>
      </label>

      <div class="field-grid">
        <label>
          <span>Market</span>
          <input bind:value={market} autocomplete="off" />
        </label>
        <label>
          <span>Subject</span>
          <input bind:value={instrument} autocomplete="off" />
        </label>
        <label>
          <span>Horizon</span>
          <input bind:value={horizon} autocomplete="off" />
        </label>
      </div>

      <button class="run" disabled={busy} type="submit">
        <span>{busy ? 'Running quorum' : 'Run quorum evaluation'}</span>
      </button>

      <div class="system-status" id="proof">
        <div class="system-top">
          <strong>System status</strong>
          <span>{status}</span>
        </div>
        {#each systemRows as row}
          <div class={`system-row ${row[2]}`}>
            <span>{row[0]}</span>
            <b>{row[1]}</b>
          </div>
        {/each}
      </div>
    </form>

    <section class="panel constellation-card">
      <div class="panel-head">
        <span>Quorum constellation</span>
        <b>{receipt.quorum.size} agents</b>
      </div>

      <div class="legend">
        {#each stanceOrder as stance}
          <span class={stance}>{stanceLabels[stance]} {receipt.quorum.voteSplit[stance]}</span>
        {/each}
      </div>

      <div class="constellation" aria-label="Agent vote constellation">
        <div class="orbit outer"></div>
        <div class="orbit inner"></div>
        <div class="core">
          <small>Quorum result</small>
          <strong>{receipt.quorum.reached ? stanceLabels[receipt.quorum.topStance] : 'Hold'}</strong>
          <span>{receipt.quorum.topCount} / {receipt.quorum.threshold}</span>
          <em>{pct(receipt.quorum.disagreementSpread)} spread</em>
        </div>
        {#each receipt.votes as vote, index}
          <span class={stanceClass(vote)} style={nodeStyle(index)} title={`${vote.identity.ensName}: ${stanceLabels[vote.stance]}`}>
            {index + 1}
          </span>
        {/each}
      </div>

      <div class="signal-log">
        <div class="log-head">
          <span>ENS agent</span>
          <b>Vote</b>
          <em>Role</em>
        </div>
        {#each receipt.votes.slice(0, 5) as vote}
          <p>
            <span>{vote.identity.ensName}</span>
            <b>{stanceLabels[vote.stance]}</b>
            <em>{vote.role}</em>
          </p>
        {/each}
      </div>
    </section>

    <aside class="panel receipt-card" id="receipt">
      <div class="panel-head">
        <span>Quorum receipt</span>
        <b>Dry run</b>
      </div>

      <div class="hash-box">
        <small>Receipt hash</small>
        <code>{receipt.lineage.receiptHash}</code>
      </div>
      <div class="hash-box violet">
        <small>Receipt id</small>
        <code>{receipt.receiptId}</code>
      </div>
      <div class="hash-box blue">
        <small>Identity namespace</small>
        <code>*.{receipt.identityLayer.namespace}</code>
      </div>

      <dl class="receipt-grid">
        <div>
          <dt>Mode</dt>
          <dd>{receipt.mode}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{pct(receipt.forecast.confidence)}</dd>
        </div>
        <div>
          <dt>Network</dt>
          <dd>Cloudflare</dd>
        </div>
        <div>
          <dt>Registry</dt>
          <dd>{receipt.identityLayer.registrySize.toLocaleString()} agents</dd>
        </div>
        <div>
          <dt>Execution</dt>
          <dd>Blocked</dd>
        </div>
        <div>
          <dt>Human gate</dt>
          <dd>World-ready</dd>
        </div>
      </dl>

      <div class="vote-bars">
        {#each stanceOrder as stance}
          <div class={`vote-row ${stance}`}>
            <span>{stanceLabels[stance]}</span>
            <i><b style={`width:${barWidth(receipt.quorum.voteSplit[stance])}`}></b></i>
            <strong>{receipt.quorum.voteSplit[stance]}</strong>
          </div>
        {/each}
      </div>

      <div class="safety">
        <h2>Safety gates</h2>
        <p><span>Policy check</span><b>Pass</b></p>
        <p><span>Wallet path</span><b>None</b></p>
        <p><span>Broker path</span><b>None</b></p>
        <p><span>Human review</span><b>Required</b></p>
      </div>

      <button class="copy" type="button" on:click={copyReceipt}>
        {copied ? 'Receipt copied' : 'Copy receipt JSON'}
      </button>
    </aside>
  </section>

  <section class="proof-strip" aria-label="Submission proof strip">
    <article>
      <span>Cloudflare</span>
      <b>Worker + static assets</b>
    </article>
    <article>
      <span>ENS</span>
      <b>Agent names + reputation</b>
    </article>
    <article>
      <span>World</span>
      <b>Human-backed approval gate</b>
    </article>
    <article>
      <span>Sui</span>
      <b>Walrus receipt storage</b>
    </article>
    <article>
      <span>GitHub</span>
      <b>Public clean-room repo</b>
    </article>
    <article>
      <span>Boundary</span>
      <b>No funds, no signing</b>
    </article>
  </section>

  <section class="identity-grid" aria-label="ENS and World integration">
    <section class="panel ens-panel">
      <div class="panel-head">
        <span>Live ENS resolver</span>
        <b>No hard-coded values</b>
      </div>

      <label>
        <span>ENS name or DreamNet agent slug</span>
        <input bind:value={ensName} autocomplete="off" placeholder="vitalik.eth or liquidity-scout-00001" />
      </label>
      <div class="field-grid two">
        <label>
          <span>ENSIP-25 registry</span>
          <input bind:value={ensRegistry} autocomplete="off" placeholder="optional registry address/id" />
        </label>
        <label>
          <span>Agent ID</span>
          <input bind:value={ensAgentId} autocomplete="off" placeholder="optional agent id" />
        </label>
      </div>

      <button class="run" disabled={ensBusy} type="button" on:click={resolveEns}>
        <span>{ensBusy ? 'Resolving ENS' : 'Resolve ENS records'}</span>
      </button>

      <div class="system-top">
        <strong>{ensStatus}</strong>
        <span>Reads address plus agent text records: description, agent-context, agent-endpoint[mcp], and agent-endpoint[web].</span>
      </div>

      {#if ensResult}
        <div class="record-stack">
          <p><span>Name</span><code>{ensResult.name}</code></p>
          <p><span>Resolved</span><b>{ensResult.resolved ? 'Yes' : 'No'}</b></p>
          <p><span>Address</span><code>{ensResult.address || 'No address record'}</code></p>
          <p><span>Agent context</span><code>{ensResult.records.agentContext || 'No agent-context text record yet'}</code></p>
          <p><span>MCP endpoint</span><code>{ensResult.records.agentEndpointMcp || 'No MCP endpoint record yet'}</code></p>
          <p><span>ENSIP-25</span><code>{ensResult.records.agentRegistration || ensResult.records.agentRegistrationKey || 'Add registry + agent id to check agent-registration[...]'}</code></p>
        </div>
      {/if}
    </section>

    <section class="panel world-panel">
      <div class="panel-head">
        <span>World human gate</span>
        <b>{worldConfig?.configured ? 'Configured' : 'Credentials pending'}</b>
      </div>

      <div class="world-copy">
        <h2>World does not name the agent. World proves a real human approved the escalation.</h2>
        <p>
          The backend exposes <code>/api/world/rp-signature</code> and <code>/api/world/verify</code>. Once the World Developer Portal
          <code>rp_id</code>, <code>app_id</code>, and signing key are set as Cloudflare secrets, this button verifies IDKit proofs before any receipt crosses the execution boundary.
        </p>
      </div>

      <button class="run world-run" disabled={worldBusy || !worldConfig?.configured} type="button" on:click={startWorldVerification}>
        <span>{worldBusy ? 'Waiting for World proof' : 'Verify human approval'}</span>
      </button>

      <div class={`system-top ${worldVerified ? 'verified' : ''}`}>
        <strong>{worldVerified ? 'World gate verified' : 'World gate pending'}</strong>
        <span>{worldStatus}</span>
        {#if worldConnectUrl}
          <a class="connect-link" href={worldConnectUrl} target="_blank" rel="noreferrer">Open World verification link</a>
        {/if}
      </div>

      <div class="record-stack">
        <p><span>Action</span><code>{worldConfig?.action || 'approve-quorum-receipt'}</code></p>
        <p><span>Credential</span><code>{worldConfig?.credential || 'proof-of-human'}</code></p>
        <p><span>Trial</span><code>{worldConfig?.trial ? `${worldConfig.trial.uses} verified-human uses` : '3 verified-human uses'}</code></p>
        <p><span>RP ID</span><code>{worldConfig?.rpId || 'not set'}</code></p>
        <p><span>Purpose</span><code>{worldConfig?.purpose || 'Human approval for agent action boundary.'}</code></p>
      </div>
    </section>

    <section class="panel walrus-panel">
      <div class="panel-head">
        <span>Walrus receipt storage</span>
        <b>Testnet blob</b>
      </div>

      <div class="world-copy">
        <h2>Walrus stores the audit artifact, not just the UI.</h2>
        <p>
          Quorum receipts are evidence. Walrus makes the receipt JSON content-addressed, retrievable, and verifiable, so the agent decision can outlive a browser session or centralized database row.
        </p>
      </div>

      <button class="run" disabled={walrusBusy} type="button" on:click={storeWalrusReceipt}>
        <span>{walrusBusy ? 'Storing on Walrus' : 'Store receipt on Walrus'}</span>
      </button>

      <div class="system-top">
        <strong>{walrusResult?.readBackVerified ? 'Walrus proof verified' : walrusResult ? 'Walrus blob stored' : 'Walrus storage pending'}</strong>
        <span>{walrusStatus}</span>
      </div>

      {#if walrusResult}
        <div class="record-stack">
          <p><span>Network</span><code>{walrusResult.network}</code></p>
          <p><span>Blob ID</span><code>{walrusResult.blobId}</code></p>
          <p><span>Verified</span><code>{walrusResult.readBackVerified ? 'hash match' : 'pending / mismatch'}</code></p>
          <p><span>Local hash</span><code>{walrusResult.localHash}</code></p>
          <p><span>Read hash</span><code>{walrusResult.readBackHash}</code></p>
          <p><span>Epochs</span><code>{walrusResult.epochs}</code></p>
          <p><span>Read URL</span><code>{walrusResult.readUrl}</code></p>
        </div>
      {/if}
    </section>
  </section>
</main>
