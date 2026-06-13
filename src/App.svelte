<script lang="ts">
  import {
    createForecastReceipt,
    type ForecastReceipt,
    type QuorumVote,
    type VoteStance
  } from './lib/quorum';

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

  const systemRows = [
    ['Agent ring', '31 / 31 online', 'green'],
    ['Agent OS', '34,012 registry', 'blue'],
    ['Identity layer', 'ENS-style names', 'violet'],
    ['Human gate', 'World-ready', 'coral'],
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
</script>

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
      DreamNet Quorum Lab is the public wedge for the Agent OS: ENS-style agent identity, quorum math, disagreement, lineage, and World-ready human approval before execution.
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
      <span>GitHub</span>
      <b>Public clean-room repo</b>
    </article>
    <article>
      <span>Boundary</span>
      <b>No funds, no signing</b>
    </article>
  </section>
</main>
