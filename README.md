# DreamNet Quorum Lab

Clean-room ETHGlobal New York 2026 build.

Live demo: https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev

DreamNet Quorum Lab is a paper-mode decision-support app for agent swarms. A user submits a market or research scenario, thirty-one simulated specialist agents vote, and the app produces a forecast receipt that shows quorum strength, disagreement, provenance, and safety gates.

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
- Public GitHub repository with small, readable commits.

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
- `/api/execute/*` returns `403 execution_blocked`.

## Demo Flow

1. Enter a scenario.
2. Generate a 31-agent quorum receipt.
3. Inspect vote split, disagreement, confidence, and lineage.
4. Confirm execution remains blocked in paper mode.
5. Export or copy the receipt for review.

## Video

Use `docs/demo-video-script.md` for the 2-4 minute ETHGlobal video.

## ETHGlobal Notes

This repository is the public, from-scratch hackathon implementation for the submitted project. It may reference DreamNet concepts as inspiration, but code in this repo is written for this event repository.

See `docs/ethglobal.md` for submission and AI-attribution notes.
