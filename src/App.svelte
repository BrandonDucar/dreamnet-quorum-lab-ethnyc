<script lang="ts">
  import {
    createForecastReceipt,
    type ForecastReceipt,
    type VoteStance
  } from './lib/quorum';

  const stanceLabels: Record<VoteStance, string> = {
    long: 'Long',
    short: 'Short',
    abstain: 'Abstain',
    no_trade: 'No-trade'
  };

  const stanceOrder: VoteStance[] = ['long', 'short', 'abstain', 'no_trade'];

  let market = 'Crypto';
  let instrument = 'BTC';
  let horizon = '24h';
  let scenario =
    'Evaluate whether BTC has enough evidence consensus for a directional forecast after a noisy social and liquidity spike.';
  let receipt: ForecastReceipt = createForecastReceipt({
    market,
    instrument,
    horizon,
    scenario,
    clientRequestId: 'local-preview'
  });
  let status = 'Ready. Paper mode is active.';
  let busy = false;
  let copied = false;

  function pct(value: number) {
    return `${Math.round(value * 100)}%`;
  }

  function barWidth(count: number) {
    return `${Math.max(6, Math.round((count / receipt.quorum.size) * 100))}%`;
  }

  async function runForecast() {
    busy = true;
    copied = false;
    status = 'Asking the quorum...';

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
      status = 'Worker receipt generated. Execution is still blocked.';
    } catch (error) {
      receipt = createForecastReceipt(request);
      status = 'Local receipt generated. Worker unavailable, demo fallback used.';
    } finally {
      busy = false;
    }
  }

  async function copyReceipt() {
    await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
    copied = true;
    status = 'Receipt copied for judges.';
  }
</script>

<main class="shell">
  <header class="topbar">
    <a class="brand" href="https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc" target="_blank" rel="noreferrer">
      <span class="mark">Q</span>
      <span>DreamNet Quorum Lab</span>
    </a>
    <nav aria-label="Demo status">
      <span>Public repo</span>
      <span>Cloudflare-ready</span>
      <span>Paper mode</span>
    </nav>
  </header>

  <section class="board" aria-label="Quorum forecast console">
    <form class="panel input-panel" on:submit|preventDefault={runForecast}>
      <p class="panel-label">Scenario Input</p>
      <h1>Ask thirty-one agents. Ship one receipt.</h1>
      <p class="muted">
        A compact decision lab for agent swarms: vote split, disagreement, provenance, and execution boundaries in one artifact.
      </p>

      <label>
        <span>Market</span>
        <input bind:value={market} autocomplete="off" />
      </label>
      <label>
        <span>Instrument</span>
        <input bind:value={instrument} autocomplete="off" />
      </label>
      <label>
        <span>Horizon</span>
        <input bind:value={horizon} autocomplete="off" />
      </label>
      <label class="wide">
        <span>Scenario</span>
        <textarea bind:value={scenario} rows="7"></textarea>
      </label>

      <button class="primary" disabled={busy} type="submit">
        {busy ? 'Running quorum...' : 'Generate Forecast Receipt'}
      </button>
      <p class="status">{status}</p>
    </form>

    <section class="panel quorum-panel">
      <div class="section-head">
        <div>
          <p class="panel-label">31-Agent Quorum</p>
          <h2>{receipt.quorum.topCount}/{receipt.quorum.threshold}</h2>
        </div>
        <span class:green={receipt.quorum.reached} class="pill">
          {receipt.quorum.reached ? 'Quorum reached' : 'No quorum'}
        </span>
      </div>

      <div class="meter">
        <strong>{stanceLabels[receipt.forecast.direction]}</strong>
        <span>{receipt.forecast.summary}</span>
      </div>

      <div class="vote-bars">
        {#each stanceOrder as stance}
          <div class="vote-row">
            <span>{stanceLabels[stance]}</span>
            <div class="track">
              <i style={`width: ${barWidth(receipt.quorum.voteSplit[stance])}`}></i>
            </div>
            <b>{receipt.quorum.voteSplit[stance]}</b>
          </div>
        {/each}
      </div>

      <div class="agent-grid" aria-label="Agent votes">
        {#each receipt.votes as vote}
          <article class={`agent ${vote.stance}`}>
            <span>{vote.voter}</span>
            <strong>{stanceLabels[vote.stance]}</strong>
          </article>
        {/each}
      </div>
    </section>

    <aside class="panel receipt-panel">
      <p class="panel-label">Forecast Receipt</p>
      <h2>{receipt.receiptId}</h2>
      <dl>
        <div>
          <dt>Mode</dt>
          <dd>{receipt.mode}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{pct(receipt.forecast.confidence)}</dd>
        </div>
        <div>
          <dt>Disagreement</dt>
          <dd>{pct(receipt.quorum.disagreementSpread)}</dd>
        </div>
        <div>
          <dt>Hash</dt>
          <dd>{receipt.lineage.receiptHash}</dd>
        </div>
      </dl>

      <div class="risk-stack">
        <span>Execution blocked</span>
        <span>No wallet path</span>
        <span>No broker path</span>
        <span>Human approval required</span>
      </div>

      <div class="lineage">
        <h3>Lineage</h3>
        {#each receipt.lineage.createdFrom as source}
          <p>{source}</p>
        {/each}
      </div>

      <button class="secondary" type="button" on:click={copyReceipt}>
        {copied ? 'Copied' : 'Copy Receipt JSON'}
      </button>
    </aside>
  </section>
</main>
