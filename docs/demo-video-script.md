# Two-Minute Demo Script

## 0:00 - 0:15

This is DreamNet Quorum Lab, a clean-room ETHGlobal New York 2026 build. It is not a trading bot. It is a paper-mode decision-support app that forces agent swarms to show identity, votes, uncertainty, provenance, human boundaries, and durable storage.

## 0:15 - 0:45

This is also the first public slice of the larger DreamNet Agent OS. ENS is the agent discovery layer, World is the human approval layer, and Walrus is the decentralized receipt storage layer.

## 0:45 - 1:15

I enter a scenario: market, instrument, horizon, and a natural-language prompt. The app asks thirty-one simulated specialist agents for a stance. Each agent can approve, reject, abstain, or hold.

## 1:15 - 1:45

The center panel shows the quorum result. The threshold is intentionally strict: twenty-eight of thirty-one agents must agree. If that threshold is not met, the app resolves to no-trade research instead of pretending the answer is certain.

## 1:45 - 2:15

The receipt panel is the product. It shows the receipt ID, identity namespace, confidence, disagreement spread, hash, lineage, and hard safety gates. Execution is blocked, there is no wallet path, no broker path, and human approval is required.

## 2:15 - 2:45

The Cloudflare Worker exposes the same receipt API at `/api/forecast`. It also resolves ENS records live, exposes World ID backend verification endpoints, and stores receipt JSON on Walrus Testnet with read-back hash verification.

## 2:45 - 3:15

The ENS path is agent naming and discovery. The World path is verified-human trial and approval gating. The Walrus path is durable receipt storage. The startup path is DreamNet Agent OS: identity, memory, governance, observability, and receipts for large AI workforces.

## 3:15 - 3:30

The core idea is simple: agentic systems should not just answer. They should produce an auditable receipt that explains who acted, how they agreed, and what they are not allowed to do.
