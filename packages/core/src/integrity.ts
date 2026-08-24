/**
 * Objective-integrity checks (P2, P3).
 *
 * The compiler is only trustworthy if it can *prove* that individualization never
 * quietly changed what a student was expected to learn. These checks run on every
 * compiled manifest and turn any violation into a `blocking` warning, which forces
 * the whole compile result to `blocked` / `objectiveIntegrity: fail`.
 *
 * This is the mechanical enforcement of the blueprint's central prohibition:
 *   "The system may not silently give one student an easier standard and report the
 *    result as equivalent mastery."
 */

import type {
  Adaptation,
  CompileWarning,
  DeliveryManifest,
  LockedContract,
  ObjectiveVersion,
} from './types.js';

/** Copy the locked subset of an objective for verbatim, auditable delivery. */
export function buildLockedContract(objective: ObjectiveVersion): LockedContract {
  return {
    objectiveId: objective.objectiveId,
    version: objective.version,
    studentOutcome: objective.studentOutcome,
    essentialKnowledge: [...objective.essentialKnowledge],
    requiredReasoning: [...objective.requiredReasoning],
    mastery: { ...objective.mastery },
  };
}

function contractMatchesObjective(
  contract: LockedContract,
  objective: ObjectiveVersion,
): boolean {
  return (
    contract.objectiveId === objective.objectiveId &&
    contract.version === objective.version &&
    contract.studentOutcome === objective.studentOutcome &&
    sameSet(contract.essentialKnowledge, objective.essentialKnowledge) &&
    sameSet(contract.requiredReasoning, objective.requiredReasoning) &&
    contract.mastery.threshold === objective.mastery.threshold &&
    contract.mastery.minimumEvidenceTypes === objective.mastery.minimumEvidenceTypes &&
    contract.mastery.transferRequired === objective.mastery.transferRequired
  );
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const bs = new Set(b);
  return a.every((x) => bs.has(x));
}

/**
 * Verify one manifest against its objective and the adaptation catalog. Returns a
 * list of integrity violations (empty = clean). All violations are `blocking`.
 */
export function checkManifestIntegrity(
  objective: ObjectiveVersion,
  manifest: DeliveryManifest,
  catalog: ReadonlyMap<string, Adaptation>,
  teacherForcedIds: ReadonlySet<string> = new Set(),
): CompileWarning[] {
  const violations: CompileWarning[] = [];
  const at = (message: string, code: string): CompileWarning => ({
    code,
    severity: 'blocking',
    message,
    studentId: manifest.studentId,
  });

  // 1. The locked contract must be byte-for-byte the objective's locked fields.
  if (!contractMatchesObjective(manifest.lockedContract, objective)) {
    violations.push(
      at(
        `Locked contract for ${manifest.studentId} does not match objective ${objective.objectiveId} v${objective.version}. Rigor or mastery may have been altered.`,
        'LOCKED_CONTRACT_MISMATCH',
      ),
    );
  }

  const prohibited = new Set(objective.prohibitedAdaptations);
  const permitted = new Set(objective.permittedAdaptations);

  for (const id of manifest.appliedAdaptationIds) {
    // 2. No prohibited adaptation may ever be applied.
    if (prohibited.has(id)) {
      violations.push(
        at(
          `Prohibited adaptation "${id}" was applied for ${manifest.studentId}.`,
          'PROHIBITED_ADAPTATION_APPLIED',
        ),
      );
    }
    // 3. Applied adaptations must be permitted by the objective or teacher-forced
    //    (and a teacher-forced one still cannot be prohibited — checked above).
    if (!permitted.has(id) && !teacherForcedIds.has(id)) {
      violations.push(
        at(
          `Adaptation "${id}" applied for ${manifest.studentId} is neither permitted by objective ${objective.objectiveId} nor teacher-forced.`,
          'UNPERMITTED_ADAPTATION_APPLIED',
        ),
      );
    }
    // 4. An adaptation that changes rigor cannot masquerade as an access support.
    const adaptation = catalog.get(id);
    if (adaptation && adaptation.adaptationClass === 'objective_modification') {
      violations.push(
        at(
          `Adaptation "${id}" is an objective_modification and must not be applied as a normal adaptation (use teacher authorization instead).`,
          'MODIFICATION_AS_ADAPTATION',
        ),
      );
    }
  }

  return violations;
}
