# World Receipt-Gated Proof Flow

## Plain-English Answer

DreamNet uses World ID as the human approval proof for a receipt.

Anyone can ask the swarm for a paper receipt. A future action can only cross the boundary after one unique human proves approval through World ID.

## The Flow

```text
1. User creates a Quorum Lab receipt.
2. Receipt gets a unique receiptId.
3. Browser asks the Worker for a World RP signature.
4. Worker signs the World action server-side.
5. Browser starts IDKit Proof of Human.
6. The World signal is the receiptId.
7. User approves in World App.
8. Browser sends the IDKit response to the Worker.
9. Worker verifies the proof with World Developer API.
10. Future production version stores nullifier_hash per action and receipt.
11. Only then can a future boundary crossing be marked human-approved.
```

## Why Receipt-Gated Instead Of Login-Gated

Login proves a person entered the app.

Receipt-gated proof proves a person approved a specific high-stakes artifact.

That is the important distinction for agent safety. DreamNet does not need World only for sign-in. DreamNet needs World when an agent-created receipt wants to cross from research into approval.

## Current Demo Implementation

The app exposes:

```text
GET /api/world/config
POST /api/world/rp-signature
POST /api/world/verify
```

The current Svelte flow uses:

```text
IDKit.request(...).preset(proofOfHuman({ signal: receipt.receiptId }))
```

The Worker verifies against:

```text
POST https://developer.world.org/api/v4/verify/{rp_id}
```

## Required World Setup

Create a World Developer Portal app, then configure:

```text
WORLD_APP_ID=app_...
WORLD_RP_ID=rp_...
WORLD_RP_SIGNING_KEY=<server-side signing key>
WORLD_ACTION_APPROVE=approve-quorum-receipt
WORLD_VERIFY_BASE_URL=https://developer.world.org
```

The signing key must stay server-side as a Cloudflare secret. It must never be exposed to the browser or committed to GitHub.

## What Is Already Live

- The backend routes exist.
- The client proof flow exists.
- The app blocks when credentials are missing.
- The receipt ID is already used as the proof signal.
- Execution stays blocked until proof is configured and verified.

## What Comes After The Hackathon

Add persistence for:

```text
action
receiptId
nullifier_hash
verifiedAt
humanGate = verified
```

Then enforce:

```text
one nullifier_hash per action
one receipt approval per unique human
no future boundary crossing without verified proof
```

## Booth Explanation

```text
I am not using World as generic login. I am using World ID to prove that one unique human approved this specific agent receipt before any future action can happen.
```

