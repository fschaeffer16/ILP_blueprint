/**
 * ILP connected-cycle demo — assess → grade → teacher decision → 75% rule → remediation.
 *
 *   npm run demo:cycle
 *
 * Runs the second half of the instructional cycle on synthetic data, with no AI keys:
 *   1. An item passes (and a tampered item fails) the deterministic item-integrity gate.
 *   2. The reference grader produces first-pass recommendations with criterion evidence.
 *   3. The teacher decides — accept / modify / request second review — and ONLY the
 *      teacher decision releases a final grade.
 *   4. The class result is run through the 75% classwide-failure rule.
 *   5. A remediation plan is validated (and a "recoloring" plan is rejected).
 */

import {
  checkItemIntegrity,
  compileAssignment,
  evaluateClasswideFailure,
  referenceGrader,
  releaseFinalGrade,
  checkRemediationPlan,
  type FinalGrade,
  type GradeSection,
  type RemediationPlan,
  type TeacherGradingDecision,
} from './index.js';
import {
  OBJ_M3_NF_01,
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSESSMENT_SPEC,
  SAMPLE_ASSIGNMENT,
  SAMPLE_MC_ITEM,
  SAMPLE_OBJECTIVES,
  SAMPLE_REASSESSMENT_SPEC,
  SAMPLE_ROSTER,
  SAMPLE_RUBRIC,
  SAMPLE_SUBMISSIONS,
} from './fixtures/index.js';

const line = '─'.repeat(72);
const teacher = 'T-100';
const now = '2026-09-01T15:00:00Z';

function main(): void {
  console.log(line);
  console.log('ILP — Connected instructional cycle demo (assess → grade → remediate)');
  console.log(line);

  // --- 1. Item integrity gate --------------------------------------------
  console.log('\n1. Item integrity gate');
  const clean = checkItemIntegrity(SAMPLE_MC_ITEM, OBJ_M3_NF_01);
  console.log(`   ${SAMPLE_MC_ITEM.itemId}: ${clean.length === 0 ? 'clean ✓' : clean.map((f) => f.code).join(', ')}`);
  const tampered = { ...SAMPLE_MC_ITEM, itemId: 'ITEM-tampered', prompt: 'Which fraction is 1/4? The answer is 1/4.' };
  const bad = checkItemIntegrity(tampered, OBJ_M3_NF_01);
  console.log(`   ${tampered.itemId}: ${bad.map((f) => `${f.severity}:${f.code}`).join(', ')} ✗ (blocked from delivery)`);

  // --- 2 + 3. Grade each submission, then teacher decides ----------------
  console.log('\n2–3. First-pass recommendations → teacher decisions → final grades');
  const finals: FinalGrade[] = [];
  for (const submission of SAMPLE_SUBMISSIONS) {
    const rec = referenceGrader.grade({ submission, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 });
    // Teacher accepts the first pass for the whole class (the reteach loop, below, is
    // where the under-credited strong work gets a second look).
    const decision: TeacherGradingDecision = {
      submissionId: submission.submissionId,
      action: 'accept',
      teacherId: teacher,
      decidedAt: now,
    };
    const grade = releaseFinalGrade(rec, decision, SAMPLE_RUBRIC, OBJ_M3_NF_01)!;
    const flags = Array.from(new Set(rec.criteria.flatMap((c) => c.flags)));
    console.log(
      `   ${submission.studentId}: AI conf ${rec.overallConfidence} [${flags.join(',') || 'no flags'}] → accept → ${grade.points}/${grade.maxPoints} (${Math.round(grade.fraction * 100)}%) mastery=${grade.masteryMet}`,
    );
    finals.push(grade);
  }

  // The load-bearing guarantee: a non-accept decision releases NO grade at all.
  const sample = referenceGrader.grade({ submission: SAMPLE_SUBMISSIONS[0]!, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 });
  const rejected = releaseFinalGrade(
    sample,
    { submissionId: sample.submissionId, action: 'request_second_review', teacherId: teacher, decidedAt: now },
    SAMPLE_RUBRIC,
    OBJ_M3_NF_01,
  );
  console.log(`   (if the teacher requests a second review instead of accepting: final grade = ${rejected === null ? 'null — nothing released' : 'released'})`);

  // --- 4. The 75% classwide-failure rule ---------------------------------
  console.log('\n4. Classwide-failure evaluation (the 75% rule)');
  const section: GradeSection = {
    objectiveId: OBJ_M3_NF_01.objectiveId,
    objectiveVersion: OBJ_M3_NF_01.version,
    itemGroupId: 'ASG-2201/written',
    results: finals.map((g) => ({ studentId: g.submissionId, masteryMet: g.masteryMet, fraction: g.fraction })),
  };
  const outcome = evaluateClasswideFailure(section);
  console.log(`   miss rate: ${Math.round(outcome.missRate * 100)}%   mode: ${outcome.mode}`);
  console.log(`   grade suspended: ${outcome.gradeSuspended}   integrity audit: ${outcome.requiresIntegrityAudit}`);
  console.log(`   → ${outcome.rationale}`);

  // --- 5. Remediation plan validation ------------------------------------
  console.log('\n5. Remediation plan validation');
  const goodPlan: RemediationPlan = {
    objectiveId: OBJ_M3_NF_01.objectiveId,
    objectiveVersion: OBJ_M3_NF_01.version,
    diagnosis: 'Shared misconception: "larger denominator means larger fraction"; partitioning prerequisite shaky.',
    failedMethodPattern: 'core',
    newMethodPattern: 'visual_first',
    successCriterion: 'Independently represents and explains a unit fraction with an area model on two new wholes.',
    reassessmentSpec: SAMPLE_REASSESSMENT_SPEC,
  };
  const goodFindings = checkRemediationPlan(goodPlan, SAMPLE_ASSESSMENT_SPEC);
  console.log(`   materially-different reteach + equivalent reassessment: ${goodFindings.filter((f) => f.severity === 'blocking').length === 0 ? 'valid ✓' : 'invalid ✗'}`);

  const recoloredPlan: RemediationPlan = { ...goodPlan, newMethodPattern: 'core' };
  const badFindings = checkRemediationPlan(recoloredPlan, SAMPLE_ASSESSMENT_SPEC);
  console.log(`   "recoloring" reteach (same pattern): ${badFindings.map((f) => f.code).join(', ')} ✗`);

  // Prove the compiler still runs so the reteach can be delivered individualized.
  const recompile = compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });
  console.log(`\n   Reteach can be re-compiled for the class: ${recompile.status} (integrity ${recompile.objectiveIntegrity}).`);

  console.log(line);
  console.log('✔ Cycle: item gate → AI recommends → teacher decides → 75% rule → remediation. No grade released without a teacher.');
  console.log(line);
}

main();
