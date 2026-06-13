import { createForecastReceipt, type ForecastRequest } from '../src/lib/quorum';

type Env = {
  APP_MODE: 'paper';
  ASSETS: Fetcher;
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
