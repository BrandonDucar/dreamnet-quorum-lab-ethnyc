# Submission Packet

## Deadline

ETHGlobal New York 2026 submission deadline: Sunday, June 14, 2026 at 9:00 AM EDT.

## Project

DreamNet Quorum Lab is a clean-room public hackathon repo for auditable agent quorum receipts.

- Public repo: https://github.com/BrandonDucar/dreamnet-quorum-lab-ethnyc
- Live demo: https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev
- Current deployed Worker version: `e6032372-18e2-4ba5-b74d-0bbe3c229860`
- Latest pushed commit at packet creation: `fd124dd`

## One-Line Pitch

DreamNet Quorum Lab gives AI agent swarms named identities, a strict quorum vote, a verified-human boundary, and a durable receipt so the operator can audit what happened before any action is allowed.

## Sponsor Stack

- ENS: live name resolution and future agent subname registry.
- World: backend proof-validation path for verified-human approval.
- Sui / Walrus: decentralized storage for quorum receipt artifacts.

## Live Verification Evidence

These checks were run against the deployed Cloudflare Worker on Saturday, June 13, 2026.

### Cloudflare Health

```json
{
  "ok": true,
  "service": "dreamnet-quorum-lab",
  "mode": "paper",
  "executionAllowed": false
}
```

### ENS Resolution

Endpoint:

```text
GET /api/ens/resolve?name=vitalik.eth
```

Observed result:

```json
{
  "name": "vitalik.eth",
  "resolved": true,
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
}
```

### World Safety Gate

Endpoint:

```text
POST /api/world/rp-signature
```

Observed result:

```json
{
  "status": 503,
  "error": "world_not_configured",
  "message": "Set WORLD_RP_ID, WORLD_APP_ID, and WORLD_RP_SIGNING_KEY before generating live World ID requests."
}
```

This is expected until World Developer Portal credentials are configured. The important part is that the signing key is server-side only and the browser cannot fabricate approval.

### Walrus Receipt Storage

Endpoint:

```text
POST /api/walrus/store-receipt
```

Latest verified blob:

```text
blobId: 7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
readUrl: https://aggregator.walrus-testnet.walrus.space/v1/blobs/7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
localHash: b10c7be4aaf954d40a65dbed795006f6ae6f3dc5abb47f09f24314a465ab50f7
readBackHash: b10c7be4aaf954d40a65dbed795006f6ae6f3dc5abb47f09f24314a465ab50f7
readBackVerified: true
```

## CI Evidence

Latest GitHub Actions CI run at packet creation:

```text
completed success docs: add sponsor activation playbooks CI main push 27460468334
```

The CI workflow runs typecheck, production build, and Cloudflare deploy dry-run.

## Safety Boundary

The submitted app is paper-mode only:

- no wallet signing,
- no trading,
- no broker or exchange integration,
- no public social posting,
- no hidden autonomous execution.

## Booth Sequence

1. Open the live demo.
2. Generate a quorum receipt.
3. Show the 31 votes and the 28-of-31 threshold.
4. Show the execution blocked state.
5. Resolve `vitalik.eth` in the ENS resolver.
6. Store the receipt on Walrus and show the returned blob ID.
7. Explain World as the proof gate for a real human operator before any future boundary crossing.

