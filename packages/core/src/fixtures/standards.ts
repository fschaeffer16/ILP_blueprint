/**
 * The real Florida B.E.S.T. grade-3 standards spine.
 *
 * These are the actual Florida Benchmarks for Excellent Student Thinking (Rule 6A-1.09401)
 * for grade 3 — 34 mathematics benchmarks and 26 ELA benchmarks — captured as structured
 * data so the content library maps to a real state standard set, not invented codes.
 *
 * This is the target the content pack grows toward: every benchmark here is a slot an
 * objective can be authored against. `coverageReport` shows how much of the spine the
 * authored, gate-passing library currently fills.
 *
 * Source: Florida DOE B.E.S.T. Standards — Mathematics (`mathbeststandardsfinal.pdf`) and
 * English Language Arts (`elabeststandardsfinal.pdf`); CPALMS grade-3 courses 13035 (math)
 * and 4906 (ELA). Benchmark wording is summarized for developer use; verify against the
 * official PDFs before any student-facing or district-facing publication.
 */

export interface Benchmark {
  readonly code: string;
  readonly subject: 'mathematics' | 'ela';
  readonly strand: string;
  readonly description: string;
}

// ---------------------------------------------------------------------------
// Mathematics — grade 3 (MA.3.*) — 34 benchmarks
// ---------------------------------------------------------------------------

export const MATH_GRADE3: readonly Benchmark[] = [
  // Number Sense & Operations
  { code: 'MA.3.NSO.1.1', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Read and write numbers from 0 to 10,000 using standard, expanded and word form.' },
  { code: 'MA.3.NSO.1.2', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Compose and decompose four-digit numbers in multiple ways using thousands, hundreds, tens and ones.' },
  { code: 'MA.3.NSO.1.3', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Plot, order and compare whole numbers up to 10,000.' },
  { code: 'MA.3.NSO.1.4', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Round whole numbers from 0 to 1,000 to the nearest 10 or 100.' },
  { code: 'MA.3.NSO.2.1', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Add and subtract multi-digit whole numbers, including using a standard algorithm with procedural fluency.' },
  { code: 'MA.3.NSO.2.2', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Explore multiplication of two whole numbers (products 0–144) and related division facts.' },
  { code: 'MA.3.NSO.2.3', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Multiply a one-digit whole number by a multiple of 10 (to 90) or 100 (to 900) with procedural reliability.' },
  { code: 'MA.3.NSO.2.4', subject: 'mathematics', strand: 'Number Sense & Operations', description: 'Multiply two whole numbers 0–12 and divide using related facts with procedural reliability.' },
  // Fractions
  { code: 'MA.3.FR.1.1', subject: 'mathematics', strand: 'Fractions', description: 'Represent and interpret unit fractions 1/b as one part of a whole partitioned into b equal parts.' },
  { code: 'MA.3.FR.1.2', subject: 'mathematics', strand: 'Fractions', description: 'Represent and interpret fractions m/b (including > 1) as adding the unit fraction 1/b to itself m times.' },
  { code: 'MA.3.FR.1.3', subject: 'mathematics', strand: 'Fractions', description: 'Read and write fractions (including > 1) in standard, numeral-word and word form.' },
  { code: 'MA.3.FR.2.1', subject: 'mathematics', strand: 'Fractions', description: 'Plot, order and compare fractions with the same numerator or the same denominator.' },
  { code: 'MA.3.FR.2.2', subject: 'mathematics', strand: 'Fractions', description: 'Identify equivalent fractions and explain why they are equivalent.' },
  // Algebraic Reasoning
  { code: 'MA.3.AR.1.1', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Apply the distributive property to multiply a one-digit by a two-digit number; apply properties of multiplication.' },
  { code: 'MA.3.AR.1.2', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Solve one- and two-step real-world problems involving any of the four operations with whole numbers.' },
  { code: 'MA.3.AR.2.1', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Restate a division problem as a missing-factor problem using the multiplication–division relationship.' },
  { code: 'MA.3.AR.2.2', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Determine and explain whether a multiplication or division equation is true or false.' },
  { code: 'MA.3.AR.2.3', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Determine the unknown whole number in a multiplication or division equation with the unknown in any position.' },
  { code: 'MA.3.AR.3.1', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Determine and explain whether a whole number 1–1,000 is even or odd.' },
  { code: 'MA.3.AR.3.2', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Determine whether a whole number 1–144 is a multiple of a given one-digit number.' },
  { code: 'MA.3.AR.3.3', subject: 'mathematics', strand: 'Algebraic Reasoning', description: 'Identify, create and extend numerical patterns.' },
  // Measurement
  { code: 'MA.3.M.1.1', subject: 'mathematics', strand: 'Measurement', description: 'Select and use appropriate tools to measure length, liquid volume and temperature.' },
  { code: 'MA.3.M.1.2', subject: 'mathematics', strand: 'Measurement', description: 'Solve real-world problems (four operations) with whole-number lengths, masses, weights, temperatures or liquid volumes.' },
  { code: 'MA.3.M.2.1', subject: 'mathematics', strand: 'Measurement', description: 'Tell and write time to the nearest minute using a.m./p.m. on analog and digital clocks.' },
  { code: 'MA.3.M.2.2', subject: 'mathematics', strand: 'Measurement', description: 'Solve one- and two-step real-world problems involving elapsed time.' },
  // Geometric Reasoning
  { code: 'MA.3.GR.1.1', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Describe and draw points, lines, segments, rays, and intersecting, perpendicular and parallel lines; identify them in figures.' },
  { code: 'MA.3.GR.1.2', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Identify and draw quadrilaterals by defining attributes (parallelogram, rhombus, rectangle, square, trapezoid).' },
  { code: 'MA.3.GR.1.3', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Draw line(s) of symmetry and identify line-symmetric two-dimensional figures.' },
  { code: 'MA.3.GR.2.1', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Explore area by covering a figure with unit squares without gaps or overlaps; find area by counting.' },
  { code: 'MA.3.GR.2.2', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Find the area of a rectangle with whole-number sides using a visual model and a multiplication formula.' },
  { code: 'MA.3.GR.2.3', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Solve problems involving the perimeter and area of rectangles with whole-number side lengths.' },
  { code: 'MA.3.GR.2.4', subject: 'mathematics', strand: 'Geometric Reasoning', description: 'Solve problems involving perimeter and area of composite figures of non-overlapping rectangles.' },
  // Data Analysis & Probability
  { code: 'MA.3.DP.1.1', subject: 'mathematics', strand: 'Data Analysis & Probability', description: 'Collect and represent numerical and categorical data using tables, scaled pictographs, scaled bar graphs or line plots.' },
  { code: 'MA.3.DP.1.2', subject: 'mathematics', strand: 'Data Analysis & Probability', description: 'Interpret data (tables, pictographs, circle graphs, bar graphs, line plots) by solving one- and two-step problems.' },
];

// ---------------------------------------------------------------------------
// English Language Arts — grade 3 (ELA.3.*) — 26 benchmarks
// ---------------------------------------------------------------------------

export const ELA_GRADE3: readonly Benchmark[] = [
  // Foundations
  { code: 'ELA.3.F.1.3', subject: 'ela', strand: 'Foundations', description: 'Use grade-appropriate phonics and word-analysis skills (incl. Greek/Latin roots and affixes) to decode words.' },
  { code: 'ELA.3.F.1.4', subject: 'ela', strand: 'Foundations', description: 'Read grade-level texts with accuracy, automaticity and appropriate prosody/expression.' },
  // Reading — Prose & Poetry
  { code: 'ELA.3.R.1.1', subject: 'ela', strand: 'Reading — Prose & Poetry', description: 'Explain how one or more characters develop throughout the plot in a literary text.' },
  { code: 'ELA.3.R.1.2', subject: 'ela', strand: 'Reading — Prose & Poetry', description: 'Explain a theme and how it develops, using details, in a literary text.' },
  { code: 'ELA.3.R.1.3', subject: 'ela', strand: 'Reading — Prose & Poetry', description: 'Explain different characters’ perspectives in a literary text.' },
  { code: 'ELA.3.R.1.4', subject: 'ela', strand: 'Reading — Prose & Poetry', description: 'Identify types of poems: free verse, rhymed verse, haiku and limerick.' },
  // Reading — Informational
  { code: 'ELA.3.R.2.1', subject: 'ela', strand: 'Reading — Informational', description: 'Explain how text features contribute to the meaning of a text.' },
  { code: 'ELA.3.R.2.2', subject: 'ela', strand: 'Reading — Informational', description: 'Identify the central idea and explain how relevant details support it.' },
  { code: 'ELA.3.R.2.3', subject: 'ela', strand: 'Reading — Informational', description: 'Explain the development of an author’s purpose in an informational text.' },
  { code: 'ELA.3.R.2.4', subject: 'ela', strand: 'Reading — Informational', description: 'Identify an author’s claim and explain how the author uses evidence to support it.' },
  // Reading — Across Genres
  { code: 'ELA.3.R.3.1', subject: 'ela', strand: 'Reading — Across Genres', description: 'Identify and explain metaphors, personification and hyperbole in text(s).' },
  { code: 'ELA.3.R.3.2', subject: 'ela', strand: 'Reading — Across Genres', description: 'Summarize a text (plot/theme for literary; central idea/details for informational) to enhance comprehension.' },
  { code: 'ELA.3.R.3.3', subject: 'ela', strand: 'Reading — Across Genres', description: 'Compare and contrast how two authors present information on the same topic or theme.' },
  // Communication
  { code: 'ELA.3.C.1.1', subject: 'ela', strand: 'Communication — Writing', description: 'Write in cursive all upper- and lowercase letters.' },
  { code: 'ELA.3.C.1.2', subject: 'ela', strand: 'Communication — Writing', description: 'Write personal or fictional narratives with a logical sequence, description, dialogue, transitions and an ending.' },
  { code: 'ELA.3.C.1.3', subject: 'ela', strand: 'Communication — Writing', description: 'Write opinions about a topic or text with reasons supported by details, transitions and a conclusion.' },
  { code: 'ELA.3.C.1.4', subject: 'ela', strand: 'Communication — Writing', description: 'Write expository texts using sources, with an introduction, facts and details, elaboration, transitions and a conclusion.' },
  { code: 'ELA.3.C.1.5', subject: 'ela', strand: 'Communication — Writing', description: 'Improve writing by planning, revising and editing with support and peer feedback.' },
  { code: 'ELA.3.C.2.1', subject: 'ela', strand: 'Communication — Oral', description: 'Present information orally in a logical sequence with nonverbal cues, appropriate volume and clear pronunciation.' },
  { code: 'ELA.3.C.3.1', subject: 'ela', strand: 'Communication — Conventions', description: 'Follow standard English grammar, punctuation, capitalization and spelling appropriate to grade level.' },
  { code: 'ELA.3.C.4.1', subject: 'ela', strand: 'Communication — Research', description: 'Conduct research to answer a question, organizing information from multiple sources.' },
  { code: 'ELA.3.C.5.1', subject: 'ela', strand: 'Communication — Multimedia', description: 'Use two or more multimedia elements to enhance oral or written tasks.' },
  { code: 'ELA.3.C.5.2', subject: 'ela', strand: 'Communication — Multimedia', description: 'Use digital writing tools individually or collaboratively to plan, draft and revise.' },
  // Vocabulary
  { code: 'ELA.3.V.1.1', subject: 'ela', strand: 'Vocabulary', description: 'Use grade-level academic vocabulary appropriately in speaking and writing.' },
  { code: 'ELA.3.V.1.2', subject: 'ela', strand: 'Vocabulary', description: 'Apply knowledge of common Greek and Latin roots, base words and affixes to determine word meaning.' },
  { code: 'ELA.3.V.1.3', subject: 'ela', strand: 'Vocabulary', description: 'Use context clues, figurative language, word relationships, references and background knowledge to determine meaning.' },
];

export const BEST_GRADE3: readonly Benchmark[] = [...MATH_GRADE3, ...ELA_GRADE3];

/** Look up a benchmark by code. */
export function benchmark(code: string): Benchmark | undefined {
  return BEST_GRADE3.find((b) => b.code === code);
}

export interface CoverageRow {
  readonly strand: string;
  readonly subject: 'mathematics' | 'ela';
  readonly total: number;
  readonly authored: number;
  readonly codes: readonly { readonly code: string; readonly authored: boolean }[];
}

/**
 * How much of the real B.E.S.T. spine the authored library fills, by strand.
 * `authoredStandardRefs` is the flat set of standard codes the content pack has
 * fully-authored, gate-passing objectives for.
 */
export function coverageReport(authoredStandardRefs: readonly string[]): {
  readonly rows: readonly CoverageRow[];
  readonly totals: { readonly total: number; readonly authored: number };
} {
  const authored = new Set(authoredStandardRefs);
  const strands = new Map<string, Benchmark[]>();
  for (const b of BEST_GRADE3) {
    const list = strands.get(b.strand) ?? [];
    list.push(b);
    strands.set(b.strand, list);
  }
  const rows: CoverageRow[] = [];
  for (const [strand, list] of strands) {
    const codes = list.map((b) => ({ code: b.code, authored: authored.has(b.code) }));
    rows.push({
      strand,
      subject: list[0]!.subject,
      total: list.length,
      authored: codes.filter((c) => c.authored).length,
      codes,
    });
  }
  return {
    rows,
    totals: { total: BEST_GRADE3.length, authored: BEST_GRADE3.filter((b) => authored.has(b.code)).length },
  };
}
