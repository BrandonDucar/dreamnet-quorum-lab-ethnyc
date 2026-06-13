# Judge Explainer

## What We Built

DreamNet Quorum Lab is a public Svelte + Cloudflare app that turns an agent swarm forecast into an auditable receipt.

It is the first public module of the larger DreamNet Agent OS: a control plane for persistent agents with identity, reputation, memory, permissions, and receipts.

The receipt includes:

- A 31-agent vote map.
- ENS-backed identity and discovery paths for participating agents.
- A strict 28-of-31 quorum threshold.
- Vote split and disagreement spread.
- Paper-mode forecast summary.
- Lineage and receipt hash.
- A World-ready human approval gate.
- Walrus Testnet receipt storage with read-back hash verification.
- Safety gates that block execution.

## Why It Matters

Most agent demos show an answer. This shows the decision process and the limits around action.

The project is designed for high-stakes agent workflows where the operator needs to know:

- Who voted.
- What each agent is called.
- What identity namespace the agent belongs to.
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

Functional sponsor paths:

- `GET /api/ens/resolve?name=vitalik.eth` resolves live ENS records.
- `POST /api/walrus/store-receipt` stores receipt JSON to Walrus Testnet and verifies the read-back hash.
- `GET /api/world/config` and `POST /api/world/rp-signature` are ready for World ID credentials without exposing signing keys to the browser.

## Sponsor Fit

- **ENS:** gives agents stable, discoverable names and a future reputation namespace.
- **World:** gates execution behind verified human approval instead of letting bots act as humans.
- **Sui / Walrus:** persists the receipt as verifiable data instead of leaving it as a transient API response.
- **Google for Startups:** frames the company as an Agent OS: registry, governance, observability, receipts, and memory for large AI workforces.

## Safety Claim

The project is intentionally paper-only:

- No trades.
- No signatures.
- No wallets.
- No brokers.
- No public posting.
- No hidden side effects.

The demo can discuss future integrations, but the submitted code should be judged as an explainable quorum-receipt system.
