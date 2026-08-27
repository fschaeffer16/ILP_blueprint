import type { DeliveryPattern } from '@ilp/core';

const PATTERN_LABEL: Record<DeliveryPattern, string> = {
  core: 'Core',
  vocabulary_supported: 'Vocabulary-supported',
  visual_first: 'Visual-first',
  guided_practice: 'Guided practice',
  advanced_transfer: 'Advanced transfer',
};

export function PatternBadge({ pattern }: { pattern: DeliveryPattern }) {
  return <span className={`badge ${pattern}`}>{PATTERN_LABEL[pattern]}</span>;
}

export function MasteryPill({ met }: { met: boolean }) {
  return met ? <span className="pill ok">Mastery met</span> : <span className="pill warn">Not yet</span>;
}

export function IntegrityPill({ pass }: { pass: boolean }) {
  return pass ? (
    <span className="pill ok">Learning Objective integrity: pass</span>
  ) : (
    <span className="pill danger">Learning Objective integrity: fail</span>
  );
}

export function Stat({ num, label }: { num: React.ReactNode; label: string }) {
  return (
    <div className="stat">
      <span className="num">{num}</span>
      <span className="label">{label}</span>
    </div>
  );
}

export function pct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
