# Demo Rehearsal Runbook

Use this before recording and before booth demos.

## Primary Live Demo

Open:

```text
https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev
```

Expected story:

1. Generate a 31-agent receipt.
2. Show that the quorum threshold is 28 of 31.
3. Show that execution remains blocked.
4. Resolve `vitalik.eth` in the ENS panel.
5. Show World gate status.
6. Store the receipt on Walrus.
7. Open the Walrus read URL.

## Example Inputs

Use these if a judge asks whether the decision surface accepts anything besides the default.

### Safe Approval Quorum

```text
Decision surface:
Should DreamNet approve the public demo after CI is green, no wallet signing, no trading, and Walrus receipt storage verified?

Market:
Coordination

Subject:
ETHGlobal build decision

Horizon:
Sunday June 14 2026 9:00 AM EDT
```

Expected result: approve quorum, with execution still blocked.

### Risk Hold Quorum

```text
Decision surface:
Should the agent execute a live trade with user funds right now?

Market:
Agent safety

Subject:
Live fund movement

Horizon:
Immediate
```

Expected result: hold / no-action quorum.

### Ambiguous Split

```text
Decision surface:
Is the market structure interesting next week?

Market:
Research

Subject:
Market structure

Horizon:
Next week
```

Expected result: no 28-of-31 quorum, so the receipt remains no-action research.

## Fast Live Endpoint Checks

Run from PowerShell:

```powershell
Invoke-RestMethod "https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev/api/health"
```

```powershell
Invoke-RestMethod "https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev/api/ens/resolve?name=vitalik.eth"
```

```powershell
Invoke-RestMethod "https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev/api/world/config"
```

```powershell
$body = @{
  market = "ETHGlobal"
  instrument = "Sunday submission package"
  horizon = "Sunday June 14 2026 9:00 AM EDT"
  scenario = "Booth rehearsal receipt for DreamNet Quorum Lab."
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -ContentType "application/json" `
  -Uri "https://dreamnet-quorum-lab-ethnyc.dreamnet-intel.workers.dev/api/walrus/store-receipt" `
  -Body $body
```

## Known Good Walrus Fallback

If booth Wi-Fi is weak, open this already verified receipt blob:

```text
https://aggregator.walrus-testnet.walrus.space/v1/blobs/7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
```

Verified values:

```text
blobId: 7aOiEmqACMCHzOlw6BN7fKWIvDi37knw6F5OtWpJ6ec
localHash: b10c7be4aaf954d40a65dbed795006f6ae6f3dc5abb47f09f24314a465ab50f7
readBackHash: b10c7be4aaf954d40a65dbed795006f6ae6f3dc5abb47f09f24314a465ab50f7
readBackVerified: true
```

## Local Fallback

If the live site is unreachable but the laptop is fine:

```powershell
pnpm install
pnpm check
pnpm build
```

Terminal 1:

```powershell
pnpm worker:dev
```

Terminal 2:

```powershell
pnpm dev
```

Open:

```text
http://127.0.0.1:5178
```

## What To Say If World Is Not Configured

```text
The World backend path is built and intentionally blocks until the Developer Portal credentials are configured. The safety point is that the browser cannot fabricate approval, and no agent action crosses the boundary without a verified-human proof.
```

## What To Say If ENS Subnames Are Not Activated

```text
The ENS resolver is live. The remaining activation step is a real parent namespace or delegated subname so the generated DreamNet agent identities can become actual ENS records with text metadata.
```

## What To Say If Asked About Trading

```text
This is not a trading bot. It is a paper-mode decision-support and audit-receipt app. There is no wallet signing path, no broker integration, and no autonomous execution path in the submitted demo.
```

## Last-Minute Preflight

```powershell
pnpm check
pnpm build
pnpm exec wrangler deploy --dry-run
gh run list --repo BrandonDucar/dreamnet-quorum-lab-ethnyc --limit 3
```
