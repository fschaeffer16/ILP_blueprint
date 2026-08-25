/**
 * A synthetic grade-3 baseline task bank (game/tablet tasks + structured observation)
 * across three short sessions, plus one child's responses. Answering these produces the
 * observations the screener reads — the "task delivery" that turns real answers into
 * scores. Illustrative demo tasks, not a clinical instrument.
 */

import type { BaselineTask, TaskResponse } from '../baselineTasks.js';

export const SAMPLE_TASK_BANK: readonly BaselineTask[] = [
  // Session 1
  { id: 'T-pa-1', domain: 'phonological_awareness', session: 1, method: 'game_task', format: 'single_choice',
    prompt: "Which word rhymes with “cat”?", choices: [{ id: 'a', label: 'hat' }, { id: 'b', label: 'sun' }, { id: 'c', label: 'dog' }], correctChoiceId: 'a' },
  { id: 'T-lsd-1', domain: 'letter_sound_decoding', session: 1, method: 'game_task', format: 'single_choice',
    prompt: 'What sound does the letter “b” make?', choices: [{ id: 'a', label: '/b/ as in ball' }, { id: 'b', label: '/d/ as in dog' }, { id: 'c', label: '/p/ as in pig' }], correctChoiceId: 'a' },
  { id: 'T-ns-1', domain: 'number_sense', session: 1, method: 'tablet_task', format: 'single_choice',
    prompt: 'Which is more?', choices: [{ id: 'a', label: '6' }, { id: 'b', label: '4' }], correctChoiceId: 'a' },
  { id: 'T-ol-1', domain: 'oral_language', session: 1, method: 'oral', format: 'observation_scale',
    prompt: 'Retell the short story you just heard, in order.', scaleHint: 'Retells the main events in a sensible order.' },
  { id: 'T-wm-1', domain: 'working_memory', session: 1, method: 'tablet_task', format: 'single_choice',
    prompt: 'Say these numbers backward: 3, 7, 1', choices: [{ id: 'a', label: '1, 7, 3' }, { id: 'b', label: '3, 7, 1' }, { id: 'c', label: '7, 1, 3' }], correctChoiceId: 'a' },
  // Session 2
  { id: 'T-pa-2', domain: 'phonological_awareness', session: 2, method: 'game_task', format: 'single_choice',
    prompt: 'What is the first sound in “moon”?', choices: [{ id: 'a', label: '/m/' }, { id: 'b', label: '/n/' }, { id: 'c', label: '/oo/' }], correctChoiceId: 'a' },
  { id: 'T-lsd-2', domain: 'letter_sound_decoding', session: 2, method: 'tablet_task', format: 'single_choice',
    prompt: 'Which letters spell “cat”?', choices: [{ id: 'a', label: 'c – a – t' }, { id: 'b', label: 'k – a – t' }, { id: 'c', label: 'c – e – t' }], correctChoiceId: 'a' },
  { id: 'T-rn-1', domain: 'rapid_naming', session: 2, method: 'oral', format: 'observation_scale',
    prompt: 'Name this row of colors as quickly as you can.', scaleHint: 'Names familiar colors quickly and accurately.' },
  { id: 'T-ns-2', domain: 'number_sense', session: 2, method: 'tablet_task', format: 'single_choice',
    prompt: 'What number comes right after 8?', choices: [{ id: 'a', label: '9' }, { id: 'b', label: '7' }, { id: 'c', label: '10' }], correctChoiceId: 'a' },
  { id: 'T-pc-1', domain: 'performance_conditions', session: 2, method: 'teacher_observation', format: 'observation_scale',
    prompt: 'Work a short set with a gentle timer on.', scaleHint: 'Keeps accuracy when a short timer is running.' },
  // Session 3
  { id: 'T-pa-3', domain: 'phonological_awareness', session: 3, method: 'teacher_observation', format: 'observation_scale',
    prompt: 'Break the spoken word into its separate sounds.', scaleHint: 'Segments words into individual sounds.' },
  { id: 'T-lsd-3', domain: 'letter_sound_decoding', session: 3, method: 'tablet_task', format: 'single_choice',
    prompt: 'Read “sun”. Which picture matches?', choices: [{ id: 'a', label: '☀️ sun' }, { id: 'b', label: '🧦 sock' }, { id: 'c', label: '🐍 snake' }], correctChoiceId: 'a' },
  { id: 'T-wm-2', domain: 'working_memory', session: 3, method: 'tablet_task', format: 'single_choice',
    prompt: 'Say these numbers backward: 5, 2, 9', choices: [{ id: 'a', label: '9, 2, 5' }, { id: 'b', label: '5, 2, 9' }, { id: 'c', label: '2, 9, 5' }], correctChoiceId: 'a' },
  { id: 'T-ol-2', domain: 'oral_language', session: 3, method: 'oral', format: 'observation_scale',
    prompt: 'Follow the two-step spoken direction.', scaleHint: 'Follows a two-step spoken direction correctly.' },
];

/** One child's responses — low reading signals, strong number sense (a clear, non-global
 * picture the screener can route without labeling the whole child). */
export const SAMPLE_TASK_RESPONSES: readonly TaskResponse[] = [
  { taskId: 'T-pa-1', choiceId: 'b' }, // wrong
  { taskId: 'T-lsd-1', choiceId: 'b' }, // wrong
  { taskId: 'T-ns-1', choiceId: 'a' }, // correct
  { taskId: 'T-ol-1', scaleValue: 0.7 },
  { taskId: 'T-wm-1', choiceId: 'a' }, // correct
  { taskId: 'T-pa-2', choiceId: 'b' }, // wrong
  { taskId: 'T-lsd-2', choiceId: 'b' }, // wrong
  { taskId: 'T-rn-1', scaleValue: 0.4 },
  { taskId: 'T-ns-2', choiceId: 'a' }, // correct
  { taskId: 'T-pc-1', scaleValue: 0.5 },
  { taskId: 'T-pa-3', scaleValue: 0.3 },
  { taskId: 'T-lsd-3', choiceId: 'b' }, // wrong
  { taskId: 'T-wm-2', choiceId: 'b' }, // wrong
  { taskId: 'T-ol-2', scaleValue: 0.68 },
];
