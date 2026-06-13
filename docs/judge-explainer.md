# Judge Explainer

## What We Built

DreamNet Quorum Lab is a public Svelte + Cloudflare app that turns an agent swarm forecast into an auditable receipt.

The receipt includes:

- A 31-agent vote map.
- A strict 28-of-31 quorum threshold.
- Vote split and disagreement spread.
- Paper-mode forecast summary.
- Lineage and receipt hash.
- Safety gates that block execution.

## Why It Matters

Most agent demos show an answer. This shows the decision process and the limits around action.

The project is designed for high-stakes agent workflows where the operator needs to know:

- Who voted.
- Whether enough agents agreed.
- How much disagreement remains.
- What evidence policy was used.
- Whether the system is allowed to execute.

## Technical Shape

- `src/lib/quorum.ts` is the pure TypeScript receipt engine.
- `src/App.svelte` is the judge-facing app.
- `worker/index.ts` exposes the Cloudflare API.
- `wrangler.jsonc` configures a deployable Worker with static assets.
- `.github/workflows/ci.yml` proves typecheck, build, and Cloudflare dry-run.

## Safety Claim

The project is intentionally paper-only:

- No trades.
- No signatures.
- No wallets.
- No brokers.
- No public posting.
- No hidden side effects.

The demo can discuss future integrations, but the submitted code should be judged as an explainable quorum-receipt system.
