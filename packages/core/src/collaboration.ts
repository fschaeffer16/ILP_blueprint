/**
 * Verified student collaboration channels + moderation (blueprint §15).
 *
 * The "social" layer, built the way the blueprint demands and NOT the way consumer social
 * media works:
 *   - Verified district roster only; subject/objective-linked academic channels.
 *   - No direct messages in the MVP, no public profiles, no follower counts, no infinite
 *     feed, no public indexing.
 *   - Explanation and contribution are distinguished from answer-dumping; answer-dumping is
 *     held and triggers an independent mastery check.
 *   - AI-assisted moderation may hold or route content, but trained humans resolve
 *     escalations; safety concerns (bullying, PII, self-harm) escalate to a person.
 *   - Recognition is helpfulness, accuracy and constructiveness — never popularity.
 *
 * Moderation here is deterministic and rule-based (no model needed) so it is testable and
 * transparent; a model gateway can add nuance behind the same interface later.
 */

export type ChannelScope = 'class' | 'grade' | 'district';

export interface Channel {
  readonly id: string;
  readonly name: string;
  readonly subject: string;
  readonly scope: ChannelScope;
  /** Optional objective this channel is anchored to (academic threads carry the objective). */
  readonly objectiveId?: string;
}

export type ContributionKind = 'question' | 'explanation' | 'resource' | 'answer_dump';
export type ModerationStatus = 'approved' | 'held' | 'blocked';

export interface Post {
  readonly id: string;
  readonly channelId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly text: string;
  readonly objectiveId?: string;
  readonly createdAt: string;
}

export interface ModerationReason {
  readonly code:
    | 'unverified_member'
    | 'answer_dump'
    | 'safety_bullying'
    | 'pii'
    | 'self_harm'
    | 'ok';
  readonly severity: 'info' | 'warning' | 'blocking';
  readonly message: string;
}

export interface ModerationResult {
  readonly status: ModerationStatus;
  readonly kind: ContributionKind;
  readonly reasons: readonly ModerationReason[];
  /** Answer-dumping requires the student to show independent mastery before it counts. */
  readonly requiresMasteryCheck: boolean;
  /** Safety concerns route to a trained human immediately. */
  readonly escalateToHuman: boolean;
}

const REASONING_MARKERS = ['because', 'since', 'so that', 'first', 'then', 'step', 'means', 'the reason', 'this shows', 'i think', 'my idea'];
const BULLYING = ['stupid', 'loser', 'idiot', 'shut up', 'hate you', 'dumb', 'ugly'];
const SELF_HARM = ['hurt myself', 'kill myself', 'want to die', 'end it all'];
const PII = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // phone
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, // email
  /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|lane|ln|drive|dr)\b/i, // address
];

/** Classify what kind of contribution a message is. */
export function classifyContribution(text: string): ContributionKind {
  const t = text.toLowerCase().trim();
  if (/https?:\/\//.test(t) || t.includes('source:')) return 'resource';
  const hasReasoning = REASONING_MARKERS.some((m) => t.includes(m));
  const looksLikeBareAnswer =
    (/\banswer is\b/.test(t) || /=\s*[-\d/.]+\s*$/.test(t) || /^[\d/.]+$/.test(t)) && !hasReasoning;
  if (looksLikeBareAnswer) return 'answer_dump';
  if (t.includes('?') || /^(how|why|what|when|where|can|does|is)\b/.test(t)) return 'question';
  return 'explanation';
}

export interface ModeratePostInput {
  readonly authorId: string;
  readonly text: string;
  readonly verifiedMemberIds: readonly string[];
}

/**
 * Moderate a candidate post. Order matters: an unverified author is blocked outright;
 * safety concerns escalate to a human; answer-dumping is held with a mastery check.
 */
export function moderatePost(input: ModeratePostInput): ModerationResult {
  const reasons: ModerationReason[] = [];
  const kind = classifyContribution(input.text);
  const t = input.text.toLowerCase();

  // 1. Verified roster only.
  if (!input.verifiedMemberIds.includes(input.authorId)) {
    return {
      status: 'blocked',
      kind,
      reasons: [{ code: 'unverified_member', severity: 'blocking', message: 'Author is not a verified member of this space.' }],
      requiresMasteryCheck: false,
      escalateToHuman: false,
    };
  }

  let escalateToHuman = false;

  // 2. Safety — self-harm is the highest priority; a caring adult is alerted immediately.
  if (SELF_HARM.some((k) => t.includes(k))) {
    reasons.push({ code: 'self_harm', severity: 'blocking', message: 'Possible self-harm language — routed to a trained adult right away.' });
    escalateToHuman = true;
  }
  if (BULLYING.some((k) => t.includes(k))) {
    reasons.push({ code: 'safety_bullying', severity: 'blocking', message: 'Possible unkind/bullying language — held for human review.' });
    escalateToHuman = true;
  }
  if (PII.some((re) => re.test(input.text))) {
    reasons.push({ code: 'pii', severity: 'warning', message: 'Looks like personal contact info — held to protect privacy.' });
  }

  // 3. Answer-dumping — held, and the student must show independent mastery.
  let requiresMasteryCheck = false;
  if (kind === 'answer_dump') {
    reasons.push({ code: 'answer_dump', severity: 'warning', message: 'Looks like a bare answer with no explanation — held; show your thinking, then a quick solo check.' });
    requiresMasteryCheck = true;
  }

  const held = reasons.length > 0;
  if (!held) reasons.push({ code: 'ok', severity: 'info', message: 'Helpful, on-topic contribution.' });

  return {
    status: held ? 'held' : 'approved',
    kind,
    reasons,
    requiresMasteryCheck,
    escalateToHuman,
  };
}

// ---------------------------------------------------------------------------
// Recognition — helpfulness, not popularity
// ---------------------------------------------------------------------------

export interface MemberRecognition {
  readonly memberId: string;
  readonly name: string;
  /** A constructiveness score: explanations and resources count; answer-dumps don't. */
  readonly helpfulness: number;
  readonly explanations: number;
  readonly resources: number;
}

/** Rank verified members by helpful contribution. There are no likes or follower counts. */
export function computeRecognition(
  members: readonly { id: string; name: string }[],
  posts: readonly { authorId: string; kind: ContributionKind; status: ModerationStatus }[],
): MemberRecognition[] {
  const byMember = new Map<string, { explanations: number; resources: number; dumps: number }>();
  for (const m of members) byMember.set(m.id, { explanations: 0, resources: 0, dumps: 0 });
  for (const p of posts) {
    if (p.status === 'blocked') continue;
    const rec = byMember.get(p.authorId);
    if (!rec) continue;
    if (p.kind === 'explanation') rec.explanations += 1;
    else if (p.kind === 'resource') rec.resources += 1;
    else if (p.kind === 'answer_dump') rec.dumps += 1;
  }
  return members
    .map((m) => {
      const r = byMember.get(m.id)!;
      return {
        memberId: m.id,
        name: m.name,
        explanations: r.explanations,
        resources: r.resources,
        helpfulness: r.explanations * 2 + r.resources - r.dumps,
      };
    })
    .sort((a, b) => b.helpfulness - a.helpfulness);
}
