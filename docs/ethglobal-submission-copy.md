# ETHGlobal Submission Copy

Use this as the starting point for the ETHGlobal project page.

## Project Name

DreamNet Quorum Lab

## Short Description

Auditable AI agent quorum receipts with ENS identity, World-backed human approval boundaries, and Walrus receipt storage.

## Long Description

DreamNet Quorum Lab is a clean-room ETHGlobal New York 2026 build for safer agent coordination.

Instead of letting an AI agent produce a confident answer and act on it, Quorum Lab forces a 31-agent quorum process. Each specialist agent has an identity, role, vote, confidence level, and reason. The system requires a strict 28-of-31 threshold before it can even recommend escalation. If consensus is weak, it returns a paper-mode no-action receipt.

The receipt is the product. It shows who voted, how much disagreement remains, what lineage policy created the decision, and whether any human approval boundary has been satisfied.

The demo integrates three sponsor primitives:

- ENS for agent identity and discovery.
- World for a verified-human approval boundary.
- Walrus for decentralized receipt storage and read-back hash verification.

The app is intentionally paper-mode only. There is no wallet signing path, no broker integration, no trading execution, no public posting, and no hidden autonomous side effects.

## What It Does

- Generates a 31-agent quorum receipt from a user scenario.
- Shows vote split, confidence, disagreement, and lineage.
- Resolves live ENS records through the Cloudflare Worker.
- Exposes backend World ID proof-verification endpoints.
- Stores receipt JSON on Walrus Testnet and verifies the read-back hash.
- Blocks all execution paths in paper mode.

## How It Uses ENS

ENS is the agent identity and discovery layer.

The app includes a live endpoint:

```text
GET /api/ens/resolve?name=<ens-name>
```

The resolver reads address records plus agent-oriented text records such as `description`, `agent-context`, `agent-endpoint[mcp]`, `agent-endpoint[web]`, and an optional ENSIP-25 registration key.

In the full Agent OS, agents receive subnames such as:

```text
liquidity-scout-00001.agents.dreamnet.eth
risk-governor-00005.agents.dreamnet.eth
```

## How It Uses World

World is the verified-human boundary.

The app exposes backend endpoints for World ID request signatures and proof verification:

```text
GET /api/world/config
POST /api/world/rp-signature
POST /api/world/verify
```

The intended constraint is one-human-one-trial and verified-human approval before any future agent receipt can cross into execution. The current demo keeps execution blocked until World credentials are configured and verified.

## How It Uses Walrus

Walrus stores the audit artifact.

The app exposes:

```text
GET /api/walrus/config
POST /api/walrus/store-receipt
```

The Worker publishes the receipt JSON to Walrus Testnet, reads it back through the aggregator, and compares SHA-256 hashes.

Latest verified demo blob:

```text
https://aggregator.walrus-testnet.walrus.space/v1/blobs/7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
```

## Built With

- Svelte
- TypeScript
- Cloudflare Workers
- viem
- ENS
- World ID / IDKit backend flow
- Walrus Testnet HTTP publisher and aggregator
- GitHub Actions

## Links

- Live demo: https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev
- GitHub: https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc

## Safety Statement

This is not a trading bot and not an autonomous execution system. It is a paper-mode decision-support and audit-receipt app. All execution paths are blocked in the submitted demo.

