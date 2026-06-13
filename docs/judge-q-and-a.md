# Judge Q&A

## What did you build this weekend?

We built DreamNet Quorum Lab, a public Svelte + Cloudflare app that turns a 31-agent swarm decision into an auditable paper-mode receipt.

The receipt shows agent identity, vote split, quorum threshold, confidence, disagreement, lineage, safety gates, and receipt storage.

## Is this a trading bot?

No.

It has no wallet signing path, no broker path, no exchange path, and no autonomous execution path. It is a decision-support and audit-receipt system.

## Why is the quorum threshold 28 of 31?

The goal is to avoid false certainty.

If only a narrow majority agrees, the system should not pretend it found a strong signal. The demo uses a strict threshold so weak agreement becomes a no-action research receipt.

## How is ENS used?

ENS is the agent identity and discovery layer.

The Cloudflare Worker resolves live ENS names through:

```text
GET /api/ens/resolve?name=<ens-name>
```

The long-term plan is to give agents subnames such as:

```text
liquidity-scout-00001.agents.dreamnet.eth
```

Those records can hold role, endpoint, context, and registry attestation metadata.

## Are the DreamNet ENS subnames live?

Not yet.

The resolver is live and functional, but the DreamNet parent namespace still needs to be activated or delegated. That is the exact ENS booth ask.

## How is World used?

World is the verified-human boundary.

The app exposes backend proof flow endpoints:

```text
GET /api/world/config
POST /api/world/rp-signature
POST /api/world/verify
```

The product needs World because future scarce actions, trials, or escalation approvals should require proof that a unique human approved the boundary crossing.

## Is World proof live?

The backend integration path is built, but live proof requires World Developer Portal credentials.

Until those credentials are configured, the app safely returns `world_not_configured` and keeps execution blocked.

## How is Walrus used?

Walrus stores the receipt JSON as a retrievable audit artifact.

The Worker publishes to Walrus Testnet, reads the blob back from the aggregator, and verifies the SHA-256 hash.

## What is the latest verified Walrus proof?

```text
blobId: 7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
readUrl: https://aggregator.walrus-testnet.walrus.space/v1/blobs/7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
readBackVerified: true
```

## Why does this matter?

Most agent demos show an answer.

DreamNet Quorum Lab shows the decision process, disagreement, identity layer, human boundary, storage proof, and safety limits around action.

That is the foundation for a larger Agent OS where persistent agents can earn reputation, coordinate safely, and produce receipts for important decisions.

## What is the bigger product?

DreamNet Agent OS.

It is a control plane for persistent AI agents with:

- identity,
- memory,
- reputation,
- permissions,
- human approval,
- receipts,
- and durable evidence.

Quorum Lab is the first public module because it is small enough to demo clearly but important enough to show the architecture.

