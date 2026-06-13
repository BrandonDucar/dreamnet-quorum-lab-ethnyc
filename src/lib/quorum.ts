export type VoteStance = 'long' | 'short' | 'abstain' | 'no_trade';

export type ForecastRequest = {
  market: string;
  instrument: string;
  horizon: string;
  scenario: string;
  clientRequestId: string;
};

export type AgentIdentity = {
  agentId: string;
  ensName: string;
  reputationScore: number;
  namespace: 'quorum.dreamnet.eth';
};

export type QuorumVote = {
  voter: string;
  identity: AgentIdentity;
  role: string;
  stance: VoteStance;
  confidence: number;
  reason: string;
};

export type ForecastReceipt = {
  receiptId: string;
  clientRequestId: string;
  createdAt: string;
  mode: 'paper';
  policy: 'simulation_only';
  quorum: {
    size: number;
    threshold: number;
    reached: boolean;
    voteSplit: Record<VoteStance, number>;
    topStance: VoteStance;
    topCount: number;
    disagreementSpread: number;
  };
  forecast: {
    market: string;
    instrument: string;
    horizon: string;
    direction: VoteStance;
    confidence: number;
    summary: string;
  };
  risk: {
    executionAllowed: false;
    liveTradingEnabled: false;
    humanApprovalRequired: true;
    notFinancialAdvice: true;
  };
  identityLayer: {
    namespace: 'quorum.dreamnet.eth';
    registrySize: 34012;
    resolutionMode: 'ens_compatible_demo_namespace';
    humanGate: 'world_id_ready_operator_approval';
  };
  lineage: {
    engine: 'dreamnet-quorum-lab';
    receiptHash: string;
    sourcePolicy: string;
    createdFrom: string[];
  };
  votes: QuorumVote[];
};

const roles = [
  'Liquidity Scout',
  'Macro Skeptic',
  'Social Velocity Reader',
  'Whale Flow Analyst',
  'Risk Governor',
  'Contrarian',
  'Volatility Mapper',
  'Narrative Auditor'
];

const stances: VoteStance[] = ['long', 'short', 'abstain', 'no_trade'];

function normalize(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 600);
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededUnit(seed: string, salt: number) {
  const hashed = hashText(`${seed}:${salt}`);
  return (hashed % 10000) / 10000;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createAgentIdentity(index: number, role: string, seed: string): AgentIdentity {
  const agentNumber = String(index + 1).padStart(5, '0');
  const reputationScore = 700 + Math.round(seededUnit(seed, index + 301) * 299);
  return {
    agentId: `dn-agent-${agentNumber}`,
    ensName: `${slugify(role)}-${agentNumber}.quorum.dreamnet.eth`,
    reputationScore,
    namespace: 'quorum.dreamnet.eth'
  };
}

function reasonFor(role: string, stance: VoteStance, scenario: string) {
  const subject = scenario.length > 96 ? `${scenario.slice(0, 93)}...` : scenario;
  if (stance === 'no_trade') {
    return `${role} sees insufficient agreement in "${subject}" and blocks execution.`;
  }
  if (stance === 'abstain') {
    return `${role} does not have enough bounded evidence to vote directionally.`;
  }
  return `${role} votes ${stance === 'long' ? 'approve' : 'reject'} but keeps the result paper-only pending human review.`;
}

export function createForecastReceipt(request: ForecastRequest, createdAt = new Date().toISOString()): ForecastReceipt {
  const normalized = {
    market: normalize(request.market || 'crypto'),
    instrument: normalize(request.instrument || 'BTC'),
    horizon: normalize(request.horizon || '24h'),
    scenario: normalize(request.scenario || 'No scenario provided.'),
    clientRequestId: normalize(request.clientRequestId || 'local-preview')
  };

  const seed = `${normalized.market}|${normalized.instrument}|${normalized.horizon}|${normalized.scenario}`;
  const votes: QuorumVote[] = Array.from({ length: 31 }, (_, index) => {
    const role = roles[index % roles.length];
    const raw = seededUnit(seed, index);
    const confidence = 0.46 + seededUnit(seed, index + 101) * 0.45;
    const stance = stances[Math.floor(raw * stances.length)] ?? 'no_trade';

    return {
      voter: `agent-${String(index + 1).padStart(2, '0')}`,
      identity: createAgentIdentity(index, role, seed),
      role,
      stance,
      confidence: Number(confidence.toFixed(2)),
      reason: reasonFor(role, stance, normalized.scenario)
    };
  });

  const voteSplit: Record<VoteStance, number> = {
    long: 0,
    short: 0,
    abstain: 0,
    no_trade: 0
  };

  for (const vote of votes) {
    voteSplit[vote.stance] += 1;
  }

  const ranked = Object.entries(voteSplit).sort((a, b) => b[1] - a[1]) as Array<[VoteStance, number]>;
  const [topStance, topCount] = ranked[0];
  const runnerUpCount = ranked[1]?.[1] ?? 0;
  const threshold = 28;
  const reached = topCount >= threshold;
  const confidence = votes.reduce((sum, vote) => sum + vote.confidence, 0) / votes.length;
  const receiptHash = hashText(`${seed}|${topStance}|${topCount}|${createdAt}`).toString(16).padStart(8, '0');

  return {
    receiptId: `qrm_${receiptHash}`,
    clientRequestId: normalized.clientRequestId,
    createdAt,
    mode: 'paper',
    policy: 'simulation_only',
    quorum: {
      size: votes.length,
      threshold,
      reached,
      voteSplit,
      topStance,
      topCount,
      disagreementSpread: Number(((topCount - runnerUpCount) / votes.length).toFixed(3))
    },
    forecast: {
      market: normalized.market,
      instrument: normalized.instrument,
      horizon: normalized.horizon,
      direction: reached ? topStance : 'no_trade',
      confidence: Number(confidence.toFixed(2)),
      summary: reached
        ? `Quorum reached for ${topStance}, but execution remains blocked in paper mode.`
        : 'No 28-of-31 quorum reached. The lab returns a no-trade research receipt.'
    },
    risk: {
      executionAllowed: false,
      liveTradingEnabled: false,
      humanApprovalRequired: true,
      notFinancialAdvice: true
    },
    identityLayer: {
      namespace: 'quorum.dreamnet.eth',
      registrySize: 34012,
      resolutionMode: 'ens_compatible_demo_namespace',
      humanGate: 'world_id_ready_operator_approval'
    },
    lineage: {
      engine: 'dreamnet-quorum-lab',
      receiptHash,
      sourcePolicy: 'user scenario plus deterministic local specialist fixture',
      createdFrom: ['scenario-input', 'ens-style-agent-identity', '31-agent-quorum', 'risk-gate']
    },
    votes
  };
}
