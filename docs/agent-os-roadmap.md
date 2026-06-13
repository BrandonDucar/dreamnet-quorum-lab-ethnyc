# DreamNet Agent OS Roadmap

## What This Repo Is

DreamNet Quorum Lab is the hackathon-safe public slice of DreamNet Agent OS.

It does not try to ship the full 34,012-agent operating system in one weekend. Instead, it proves the core primitive every larger agent network needs:

> A persistent agent should have identity, reputation, a vote, a receipt, and a boundary around execution.

## Why This Is the Right Wedge

Large autonomous systems fail when agents are anonymous, stateless, and impossible to audit. DreamNet Agent OS treats agents as governable entities:

- **Identity:** agents have names and stable IDs.
- **Reputation:** agents accumulate scores based on useful work.
- **Governance:** actions require quorum, policy checks, and human gates.
- **Receipts:** every decision produces lineage that can be reviewed later.
- **Boundaries:** execution is impossible unless the policy layer allows it.

Quorum Lab turns that into a live product surface a judge can use immediately.

## ENS Track Framing

The ENS direction is agent identity.

In this demo, every quorum participant carries an ENS-compatible demo name:

```text
liquidity-scout-00001.quorum.dreamnet.eth
macro-skeptic-00002.quorum.dreamnet.eth
risk-governor-00005.quorum.dreamnet.eth
```

The app now includes a live ENS resolver endpoint so the demo can resolve real ENS records instead of only showing static names. The next step is activating the DreamNet parent namespace and writing the first real agent subname records.

The product pitch:

> ENS gives agents a place to be found. DreamNet gives those named agents memory, reputation, permissions, and receipts.

## World Track Framing

The World direction is human-backed agent safety.

DreamNet should distinguish between:

- autonomous agent suggestions,
- agent-to-agent coordination,
- and human-approved execution.

This demo already models the boundary and now includes backend World ID verification endpoints. Every receipt includes a human gate, and execution remains blocked. The next step is configuring the World Developer Portal `app_id`, `rp_id`, and signing key so a verified human operator can approve a proposed action without letting the swarm impersonate that approval.

The product pitch:

> World proves a real human approved the boundary crossing. DreamNet proves what the agents decided before that approval.

## Google for Startups Framing

The startup is not a single forecast app.

The startup is the operating layer for fleets of AI agents:

- agent registry,
- identity and reputation,
- memory and retrieval,
- task routing,
- workflow governance,
- observability,
- receipts,
- and approval controls.

Quorum Lab is the first sellable module: decision receipts for high-stakes agent work.

## Near-Term Build Path

1. Keep Quorum Lab clean, public, and explainable for ETHGlobal.
2. Activate real ENS subnames for selected agents.
3. Configure World ID credentials and validate a live proof for receipt unlocks.
4. Add MemoryCore retrieval so agents vote with cited context.
5. Add a dashboard for agent reputation and task history.
6. Package the control plane as DreamNet Agent OS.

## Submission Boundary

For this hackathon repo:

- no live funds,
- no wallet signing,
- no trading,
- no broker execution,
- no autonomous public posting,
- no claims that demo ENS names are already registered onchain.

The repo demonstrates the architecture honestly while keeping the path to real integrations obvious.
