# Two-Minute Demo Script

## 0:00 - 0:15

This is DreamNet Quorum Lab, a clean-room ETHGlobal New York 2026 build. It is not a trading bot. It is a paper-mode decision-support app that forces agent swarms to show votes, uncertainty, provenance, and execution boundaries.

## 0:15 - 0:45

This is also the first public slice of the larger DreamNet Agent OS. Each participating agent has a stable ENS-style name, a role, and a reputation score. The long-term system scales this pattern to the full DreamNet agent registry.

## 0:45 - 1:15

I enter a scenario: market, instrument, horizon, and a natural-language prompt. The app asks thirty-one simulated specialist agents for a stance. Each agent can approve, reject, abstain, or hold.

## 1:15 - 1:45

The center panel shows the quorum result. The threshold is intentionally strict: twenty-eight of thirty-one agents must agree. If that threshold is not met, the app resolves to no-trade research instead of pretending the answer is certain.

## 1:45 - 2:15

The receipt panel is the product. It shows the receipt ID, identity namespace, confidence, disagreement spread, hash, lineage, and hard safety gates. Execution is blocked, there is no wallet path, no broker path, and human approval is required.

## 2:15 - 2:45

The Cloudflare Worker exposes the same receipt API at `/api/forecast`, and the Svelte app can fall back to local receipt generation for demo resilience. The repo includes CI that runs typecheck, build, and a Cloudflare deploy dry run.

## 2:45 - 3:15

The ENS path is agent naming and discovery. The World path is verified human approval before execution. The startup path is DreamNet Agent OS: identity, memory, governance, observability, and receipts for large AI workforces.

## 3:15 - 3:30

The core idea is simple: agentic systems should not just answer. They should produce an auditable receipt that explains who acted, how they agreed, and what they are not allowed to do.
