# Booth Card

## 45-Second Pitch

DreamNet Quorum Lab is an audit layer for AI agent swarms.

Most agent demos produce an answer. This produces a receipt: who voted, what they believed, whether enough agents agreed, what identity namespace they belong to, what human boundary is required, and where the evidence is stored.

The demo uses:

- ENS for agent identity and discovery,
- World for verified-human approval boundaries,
- Walrus for decentralized receipt storage.

It is intentionally paper-mode only: no trades, no wallet signing, no broker path, and no autonomous execution.

The bigger product is DreamNet Agent OS: identity, memory, reputation, permissions, receipts, and governance for persistent AI agents.

## One-Liner

```text
DreamNet Quorum Lab makes AI agent decisions inspectable before they become actions.
```

## Sponsor One-Liners

ENS:

```text
ENS turns agents from anonymous processes into discoverable named entities with metadata, endpoints, and reputation.
```

World:

```text
World proves that a real human approved the boundary crossing instead of letting bots impersonate consent.
```

Walrus:

```text
Walrus stores the receipt so the decision artifact can be retrieved and verified after the demo.
```

## What To Demo First

1. Generate a receipt.
2. Point at the 28-of-31 threshold.
3. Point at `executionAllowed: false`.
4. Resolve `vitalik.eth`.
5. Store receipt on Walrus.

## If A Judge Wants To Type Something

Use:

```text
Should DreamNet approve the public demo after CI is green, no wallet signing, no trading, and Walrus receipt storage verified?
```

This should produce an approve quorum while keeping execution blocked.

## Ask At ENS Booth

```text
Can you help me activate one real agent namespace or delegated subname so the demo can show a live DreamNet agent ENS record?
```

Target:

```text
liquidity-scout-00001.agents.<parent>.eth
```

## Ask At World Booth

```text
For a receipt-gated agent system, should I frame World as trial gating, contribution gating, or final approval gating?
```

## Ask At Sui / Walrus Booth

```text
What is the strongest way to frame Walrus here: receipt archive, agent evidence layer, or decentralized audit log?
```
