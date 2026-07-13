// content.test.js — sanity + historical-balance checks on the journey content bank.
import test from 'node:test';
import assert from 'node:assert/strict';
import game, { PHASES, JOURNEY, ENDINGS, DEBRIEF, journeyScore, endingFor } from '../src/games/cabezaDeVaca.js';

test('six chapters, each with an event and two graded decisions (3 choices: right/partial/wrong)', () => {
  assert.equal(PHASES.length, 6, 'chapter count');
  for (const [i, ph] of PHASES.entries()) {
    assert.ok(ph.title && ph.date && ph.event && ph.image, `chapter ${i} metadata`);
    assert.equal(ph.steps.length, 2, `chapter ${i} has 2 steps`);
    for (const [j, step] of ph.steps.entries()) {
      assert.equal(step.kind, 'decision', `chapter ${i} step ${j} is a decision — this journey has no map actions`);
      assert.ok(step.prompt?.length > 5, `chapter ${i} step ${j} prompt`);
      const verdicts = step.choices.map((c) => c.verdict).sort();
      assert.deepEqual(verdicts, ['partial', 'right', 'wrong'], `chapter ${i} step ${j} verdicts`);
      for (const c of step.choices) {
        assert.ok(c.label?.length > 5 && c.feedback?.length > 10, `chapter ${i} step ${j} choice text`);
      }
    }
  }
  assert.equal(PHASES.flatMap((p) => p.steps).length, 12, '12 graded actions');
});

test('the journey map has a stop per chapter plus the journey’s end', () => {
  assert.equal(JOURNEY.length, PHASES.length + 1);
  assert.equal(JOURNEY[0].id, 'malhado');
  assert.equal(JOURNEY.at(-1).name, 'Mexico City');
  for (const stop of JOURNEY) assert.ok(stop.name && stop.region, `stop ${stop.id} labeled`);
});

test('the spec’s non-negotiables are in the content', () => {
  const ch4 = PHASES[3];
  assert.match(ch4.event, /Estevanico/, 'Estevanico is named in the escape chapter');
  const ch4right = ch4.steps[1].choices.find((c) => c.verdict === 'right');
  assert.match(ch4right.feedback, /Estevanico/, 'Estevanico is honored in the feedback');
  assert.match(PHASES[5].event, /slave/i, 'the slaver scene is the chapter 6 spine');
  assert.match(PHASES[5].steps[1].prompt, /La Relación/, 'La Relación is named');
  assert.match(DEBRIEF, /Estevanico/, 'debrief names Estevanico');
  assert.match(DEBRIEF, /kindness/, 'debrief carries the humane argument');
  assert.match(DEBRIEF, /Coronado/, 'debrief ties the gold rumors to the next expeditions (7.2B cause and effect)');
});

// --- Playthrough helpers (drive the adapter directly, no GameManager) --------

function playRun(pick) {
  const state = game.initMatch();
  for (let step = 0; step < game.totalActions; step++) {
    game.chapterEvent(state);           // idempotent per chapter; safe to call each step
    const res = game.resolve(state, 'cabeza', pick(state));
    assert.ok(!res.error, `step ${step} failed: ${res.error}`);
  }
  return game.report(state);
}

const rightMove = (state) => game.aiMove(state);

function wrongMove(state) {
  const ss = state.sides.cabeza;
  const cursor = ss.cursor;
  const step = PHASES[Math.floor(cursor / 2)].steps[cursor % 2];
  const wrongReal = step.choices.findIndex((c) => c.verdict === 'wrong');
  return { kind: step.kind, choiceIndex: ss.shuffles[cursor].indexOf(wrongReal) };
}

test('all-right run: 100% accuracy and "The Long Walk Home"', () => {
  const report = playRun(rightMove);
  const you = report.perSide.cabeza;
  assert.equal(you.accuracy, 100);
  assert.ok(you.holdScore >= 220, `journey score ${you.holdScore} should reach the high tier`);
  assert.equal(you.ending.key, 'home');
  assert.equal(you.ending.title, 'The Long Walk Home');
  assert.ok(you.debrief.includes('La Relación'), 'debrief ties to the report');
});

test('all-wrong run: 0% accuracy and the journey lost', () => {
  const report = playRun(wrongMove);
  const you = report.perSide.cabeza;
  assert.equal(you.accuracy, 0);
  assert.ok(journeyScore(you.meters) < 150, `journey score ${journeyScore(you.meters)} should be low`);
  assert.equal(you.ending.key, 'lost');
  assert.equal(you.ending.title, 'Lost to the Island');
});

test('journey-score tiers: home ≥ 220, survivor 150–219, lost < 150', () => {
  assert.equal(endingFor(300, 100, { health: 50 }).key, 'home');
  assert.equal(endingFor(220, 100, { health: 50 }).key, 'home');
  assert.equal(endingFor(219, 100, { health: 50 }).key, 'survivor');
  assert.equal(endingFor(150, 100, { health: 50 }).key, 'survivor');
  assert.equal(endingFor(149, 100, { health: 50 }).key, 'lost');
  assert.equal(journeyScore({ health: 50, standing: 50, hope: 50 }), 150);
});

test('health at zero tells the collapse ending, whatever the sum', () => {
  const e = endingFor(260, 100, { health: 0, standing: 100, hope: 100 });
  assert.equal(e.key, 'lost');
  assert.equal(e.text, ENDINGS.collapsed.text);
  assert.equal(e.title, 'Lost to the Island');
});

test('currentPrompt never leaks the answer key', () => {
  const state = game.initMatch();
  game.chapterEvent(state);
  const prompt = game.currentPrompt(state);
  assert.equal(prompt.kind, 'decision');
  assert.equal(prompt.choices.length, 3);
  for (const c of prompt.choices) {
    assert.equal(typeof c, 'string', 'decision choices ship as labels only');
  }
});
