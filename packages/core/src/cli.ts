/**
 * ILP assign-once compiler — runnable demo.
 *
 *   npm run demo            # from repo root
 *   npm run demo --workspace @ilp/core
 *
 * Compiles the sample grade-3 fractions assignment across the synthetic class and
 * prints the summary a teacher would review before publishing. No AI keys, no
 * network, no database — pure domain logic on synthetic data.
 */

import { compileAssignment } from './compiler.js';
import {
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
} from './fixtures/index.js';
import { OBJ_M3_NF_01 } from './fixtures/objectives.js';

function main(): void {
  const result = compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });

  const line = '─'.repeat(72);
  console.log(line);
  console.log('ILP — Assign-once compiler demo');
  console.log(line);
  console.log(`Objective   : ${OBJ_M3_NF_01.objectiveId} v${OBJ_M3_NF_01.version} — "${OBJ_M3_NF_01.studentOutcome}"`);
  console.log(`Class       : ${result.classId}   Students: ${result.studentCount}`);
  console.log(`Status      : ${result.status}`);
  console.log(`Integrity   : ${result.objectiveIntegrity.toUpperCase()}`);
  console.log('');
  console.log('LOCKED for every student (rigor cannot vary):');
  console.log(`  • essential knowledge : ${OBJ_M3_NF_01.essentialKnowledge.join(', ')}`);
  console.log(`  • required reasoning  : ${OBJ_M3_NF_01.requiredReasoning.join(', ')}`);
  console.log(
    `  • mastery             : ≥ ${OBJ_M3_NF_01.mastery.threshold * 100}% · ${OBJ_M3_NF_01.mastery.minimumEvidenceTypes} evidence types · transfer ${OBJ_M3_NF_01.mastery.transferRequired ? 'required' : 'optional'}`,
  );
  console.log('');
  console.log('Adaptation pattern counts (teacher at-a-glance summary):');
  for (const [pattern, count] of Object.entries(result.patternCounts)) {
    if (count > 0) console.log(`  ${pattern.padEnd(20)} ${count}`);
  }
  console.log(`  objective_modifications ${result.objectiveModifications}`);
  console.log('');
  console.log('Per-student delivery manifests:');
  for (const m of result.manifests) {
    const student = SAMPLE_ROSTER.find((s) => s.studentId === m.studentId);
    console.log(`  ${(student?.displayName ?? m.studentId).padEnd(8)} → ${m.pattern}`);
    for (const r of m.rationale) console.log(`             · ${r}`);
  }

  if (result.warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    for (const w of result.warnings) {
      console.log(`  [${w.severity}] ${w.code}${w.studentId ? ` (${w.studentId})` : ''}: ${w.message}`);
    }
  }
  console.log(line);
  console.log(
    result.status === 'ready_for_teacher_review'
      ? '✔ Ready for teacher review. One assignment → individualized for every student, objective locked.'
      : '✘ Blocked by an objective-integrity check. Nothing would reach students.',
  );
  console.log(line);

  process.exit(result.status === 'ready_for_teacher_review' ? 0 : 1);
}

main();
