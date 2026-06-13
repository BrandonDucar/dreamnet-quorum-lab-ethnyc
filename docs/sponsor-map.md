# Sponsor Map

## Primary Submission Stack

DreamNet Quorum Lab focuses on three sponsors because they tell one coherent story.

```text
ENS      -> agent identity and discovery
World    -> verified-human approval and trial gating
Walrus   -> decentralized receipt storage
```

That creates the complete primitive:

```text
Named agent
  -> human-backed boundary
  -> auditable receipt stored as verifiable data
```

## Why ENS

ENS makes agents findable.

Without ENS, DreamNet agents are anonymous generated IDs. With ENS, agents can publish names, roles, endpoints, context, and registry attestations through text records.

The demo includes a live ENS resolver and ENSIP-25 / ENSIP-26-ready fields.

## Why World

World makes agent escalation human-backed.

Without World, a bot can farm trials, fake approval, or impersonate operator consent. With World ID, the backend can verify that a unique human approved a scarce or risky action.

The demo includes server-side RP signatures and backend proof verification endpoints.

## Why Sui / Walrus

Walrus makes receipts durable.

Without Walrus, a receipt is only an API response. With Walrus, the receipt becomes a content-addressed blob that can be retrieved and hash-verified later.

The demo stores receipt JSON on Walrus Testnet and verifies the read-back hash.

## Partner Satellites

Blink and Unlink are still excellent partner conversations, but they are separate modules:

- **Blink:** agent treasury, deposits, budgets, payroll.
- **Unlink:** private agent procurement, private negotiation, confidential settlement.

Those are follow-up partner notebooks/repos. They should not dilute this submission unless their teams explicitly ask for a live integration during the event.
