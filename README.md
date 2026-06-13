# DreamNet Quorum Lab

Clean-room ETHGlobal New York 2026 build.

Live demo: https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev

DreamNet Quorum Lab is a paper-mode decision-support app for agent swarms. A user submits a market or research scenario, thirty-one simulated specialist agents vote, and the app produces a forecast receipt that shows quorum strength, disagreement, provenance, and safety gates.

This is the public hackathon wedge for the larger DreamNet Agent OS. The full system gives persistent agents names, reputation, memory, permissions, and receipts. This repo demonstrates the smallest judge-friendly primitive: ENS-style agent identities making a quorum decision that cannot execute without a human gate.

The project is intentionally not a trading bot:

- No broker integration.
- No wallet signing path.
- No autonomous execution.
- No financial advice.
- Human approval is required before any real-world action.

## Hackathon Goal

Build a judge-friendly demo that proves a simple idea:

> Agentic systems should not just answer. They should show their vote, evidence, uncertainty, and execution boundaries.

## Tech Stack

- Svelte + Vite for the app.
- Cloudflare Worker for the forecast receipt API.
- TypeScript throughout.
- ENS-compatible demo namespace for agent identities.
- World-ready human approval gate in the receipt model.
- Public GitHub repository with small, readable commits.

## Agent OS Direction

The app is intentionally small, but it maps to the larger product:

- **ENS:** the app includes a live ENS resolver for agent identity and discovery, plus a namespace plan for the 34,012-agent registry.
- **World:** the app includes backend World ID proof validation endpoints and a human approval gate for scarce or risky agent actions.
- **Sui / Walrus:** the app can store quorum receipts as Walrus Testnet blobs and verify read-back hashes.
- **Google for Startups:** the startup story is the Agent OS control plane: identity, memory, governance, observability, and receipts for large agent fleets.

See `docs/agent-os-roadmap.md` for the sponsor and accelerator framing, and `docs/ens-world-activation.md` for the exact ENS + World activation path.

## Local Setup

```powershell
pnpm install
pnpm check
pnpm build
pnpm exec wrangler deploy --dry-run
```

Run the app and Worker in separate terminals:

```powershell
pnpm worker:dev
pnpm dev
```

Then open `http://127.0.0.1:5178`.

## API

- `GET /api/health` returns service mode and safety status.
- `POST /api/forecast` returns a paper-mode quorum receipt.
- `GET /api/ens/resolve?name=<ens-name>` resolves live ENS records.
- `GET /api/world/config` returns World gate configuration status.
- `POST /api/world/rp-signature` creates a server-side World ID request signature when secrets are configured.
- `POST /api/world/verify` validates IDKit proofs in the backend.
- `GET /api/walrus/config` returns Walrus Testnet publisher/aggregator config.
- `POST /api/walrus/store-receipt` stores a receipt JSON blob and verifies read-back hash.
- `/api/execute/*` returns `403 execution_blocked`.

## Demo Flow

1. Enter a scenario.
2. Generate a 31-agent quorum receipt.
3. Inspect vote split, disagreement, confidence, and lineage.
4. Confirm execution remains blocked in paper mode.
5. Export or copy the receipt for review.

Use `docs/demo-rehearsal-runbook.md` for live endpoint checks and Wi-Fi fallback commands.

## Video

Use `docs/demo-video-script.md` for the 2-4 minute ETHGlobal video.
Use `docs/video-capture-checklist.md` while recording so the sponsor proof points are visible.

## ETHGlobal Notes

This repository is the public, from-scratch hackathon implementation for the submitted project. It may reference DreamNet concepts as inspiration, but code in this repo is written for this event repository.

See `docs/ethglobal.md` for submission and AI-attribution notes.
See `docs/submission-packet.md` for the live demo URL, GitHub repo, verification evidence, and booth checklist.
See `docs/ethglobal-submission-copy.md` for paste-ready ETHGlobal project page copy.
See `docs/judge-q-and-a.md` for likely judge questions and concise answers.
