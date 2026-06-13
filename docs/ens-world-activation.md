# ENS + World Activation Guide

## The One-Sentence Pitch

DreamNet uses ENS to name and discover agents, and World ID to prove a real human approved scarce or risky agent actions.

## ENS: What It Does Here

ENS is not cosmetic in this project. It is the identity and discovery layer for the agent fleet.

In the live demo:

- The Worker exposes `GET /api/ens/resolve?name=<ens-name>`.
- The Svelte app resolves real ENS records live through `viem`.
- The resolver reads address records plus agent text records:
  - `description`
  - `agent-context`
  - `agent-endpoint[mcp]`
  - `agent-endpoint[web]`
  - optional ENSIP-25 `agent-registration[<registry>][<agentId>]`

For the full DreamNet fleet:

- Own or delegate a parent ENS namespace such as `dreamnet.eth`.
- Create an agent namespace such as `agents.dreamnet.eth` or `quorum.dreamnet.eth`.
- Issue subnames for agents:
  - `liquidity-scout-00001.agents.dreamnet.eth`
  - `risk-governor-00005.agents.dreamnet.eth`
  - `memory-broker-00217.agents.dreamnet.eth`
- Store agent metadata and endpoints in text records.
- Use ENSIP-25 to verify a link between the ENS name and the onchain agent registry entry.
- Use ENSIP-26-style text records for agent context and endpoint discovery.

## ENS Booth Demo

1. Open the live app.
2. Scroll to **Live ENS resolver**.
3. Enter a real name like `vitalik.eth` to show live resolution.
4. Enter a DreamNet agent slug like `liquidity-scout-00001`.
5. Explain that the slug resolves under the configured namespace once the subname is activated.
6. Show that no values are hard-coded: the Worker performs live ENS reads.

## ENS Booth Ask

Ask for one of these paths:

1. A gifted or sponsored parent name such as `dreamnet.eth`.
2. A delegated subname under an ENS-controlled demo namespace.
3. Registration/support credits for a first real agent namespace.

The concrete demo need:

```text
agents.<parent>.eth
liquidity-scout-00001.agents.<parent>.eth
```

Minimum records for the first activated agent:

```text
description = DreamNet quorum agent for liquidity and market-structure review.
agent-context = {"role":"Liquidity Scout","capabilities":["quorum-vote","receipt-review"],"humanGate":"world-id","network":"dreamnet-quorum-lab"}
agent-endpoint[web] = https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev
agent-endpoint[mcp] = only add this if the MCP endpoint is actually live
```

If they ask why this matters, say:

> I do not need ENS as a pretty username. I need ENS as the discovery layer for AI agents: name, metadata, endpoint, registry attestation, and reputation over time.

## World: What It Does Here

World is the human boundary layer.

ENS answers:

> Which agent is this?

World answers:

> Did a real human approve this agent action?

In this demo:

- The Worker exposes `GET /api/world/config`.
- The Worker exposes `POST /api/world/rp-signature` for server-side World ID request signing.
- The Worker exposes `POST /api/world/verify` for backend proof validation.
- The Svelte app has a **Verify human approval** button that becomes live when World credentials are configured.
- World ID gates the receipt boundary, not a trade or payment.

## World Track B Fit

The product breaks without World ID because the whole safety model depends on proving that a scarce or risky escalation was approved by a unique human.

Without World ID:

- one operator could create unlimited fake approval accounts,
- agents could claim human approval without proof,
- trial usage could be farmed by scripts,
- and the receipt boundary would become social trust instead of cryptographic trust.

With World ID:

- each unique human can unlock a limited trial allowance,
- the backend verifies the proof,
- the nullifier can enforce one-human-one-trial,
- and the receipt can record that a human gate was satisfied.

## Track A AgentKit Fit

AgentKit is the next extension after World ID is configured.

The intended mechanic:

- Register a DreamNet agent wallet in AgentBook.
- Wrap agent API calls with AgentKit.
- Give each human-backed agent 3 free Quorum Lab receipt calls.
- After the trial, fall back to x402 payment.

This matches the AgentKit prize pattern:

- human-backed agents,
- a real product,
- initial free usage,
- and a path from trial to paid usage.

## Required Secrets and Vars

Set these in Cloudflare before live World verification:

```text
WORLD_APP_ID=app_...
WORLD_RP_ID=rp_...
WORLD_RP_SIGNING_KEY=<secret from World Developer Portal>
WORLD_ACTION_APPROVE=approve-quorum-receipt
WORLD_VERIFY_BASE_URL=https://developer.world.org
```

Keep `WORLD_RP_SIGNING_KEY` secret. It must never be exposed to the browser or committed to GitHub.

Optional ENS config:

```text
ENS_AGENT_NAMESPACE=agents.dreamnet.eth
ETH_RPC_URL=<preferred Ethereum mainnet RPC>
```

## Real Activation Steps

1. Create or choose the ENS parent namespace.
2. Create the first real agent subname.
3. Add text records:
   - `description`
   - `agent-context`
   - `agent-endpoint[web]`
   - `agent-endpoint[mcp]`
4. If using ERC-8004, add the ENSIP-25 `agent-registration[...]` text record.
5. Create a World Developer Portal app.
6. Create the action `approve-quorum-receipt`.
7. Add World Cloudflare vars/secrets.
8. Redeploy.
9. Verify that the app resolves the ENS name and validates a World proof.

## Submission Boundary

Until wallet owner approval and World credentials are configured, the repo remains:

- read-only for ENS,
- proof-validation-ready for World,
- paper-only for receipts,
- and blocked for execution.
