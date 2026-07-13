// gamemanager.test.js — drives the manager exactly the way socketHandlers does
// and inspects the emit instructions it returns. No sockets involved. Cabeza de
// Vaca's Journey is single-role solo, so these focus on the solo lifecycle.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameManager } from '../src/GameManager.js';
import game from '../src/games/cabezaDeVaca.js';

const PIN = '4242';

function makeSession(manager, { requireApproval = false } = {}) {
  const res = manager.createSession({ pin: PIN, requireApproval });
  assert.ok(res.joinCode, 'session created');
  return res.joinCode;
}

function join(manager, joinCode, nickname, mode = 'solo') {
  const res = manager.joinStudent({ joinCode, nickname, mode });
  assert.ok(!res.error, `join failed: ${res.error}`);
  return res;
}

const eventsOf = (emits, name) => emits.filter((e) => e.event === name);
const studentEvents = (emits, studentId, name) =>
  emits.filter((e) => e.to.type === 'student' && e.to.studentId === studentId && (!name || e.event === name));

// Play the student's current step with the historically right move.
function playRight(manager, joinCode, studentId) {
  const session = manager.registry.get(joinCode);
  const student = session.students.get(studentId);
  const match = session.matches.get(student.matchId);
  const move = game.aiMove(match.gameState);
  return manager.submitMove({ joinCode, studentId, move });
}

test('createSession rejects a bad PIN', () => {
  const manager = new GameManager();
  assert.equal(manager.createSession({ pin: 'abc' }).error, 'bad_pin');
  assert.equal(manager.createSession({ pin: '12345' }).error, 'bad_pin');
});

test('the default game is Cabeza de Vaca’s Journey', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.registry.get(joinCode).gameId, 'cabeza-de-vaca');
});

test('teacher ops require the right PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.endSession({ joinCode, pin: '9999' }).error, 'bad_pin');
  assert.equal(manager.setApproval({ joinCode, pin: '0000', requireApproval: false }).error, 'bad_pin');
});

test('solo student starts immediately when approval is off, and completes with 100% accuracy', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');

  const begin = studentEvents(res.emits, res.studentId, 'match:begin');
  assert.equal(begin.length, 1, 'solo match begins on join');
  assert.equal(begin[0].payload.side, 'cabeza');
  assert.equal(begin[0].payload.mode, 'solo');
  assert.equal(begin[0].payload.chapterCount, 6, 'six chapters');
  assert.equal(begin[0].payload.rivalMeters, null, 'single-role solo has no rival');
  assert.ok(begin[0].payload.meta.journey.length >= 7, 'journey stops ship with the match');
  assert.equal(studentEvents(res.emits, res.studentId, 'chapter:event').length, 1);
  assert.equal(studentEvents(res.emits, res.studentId, 'turn:begin').length, 1);

  // Play all 12 steps right.
  let last;
  for (let i = 0; i < 12; i++) {
    last = playRight(manager, joinCode, res.studentId);
    assert.ok(!last.error, `step ${i}: ${last.error}`);
  }
  const end = studentEvents(last.emits, res.studentId, 'match:end');
  assert.equal(end.length, 1, 'match ends after 12 actions');
  assert.equal(end[0].payload.you.accuracy, 100);
  assert.equal(end[0].payload.yourSide, 'cabeza');
  assert.equal(end[0].payload.you.ending.key, 'home', 'a perfect run walks all the way home');
  assert.ok(end[0].payload.you.holdScore >= 220);
  assert.equal(end[0].payload.rival, null, 'no rival card in a solo game');

  // Teacher got the end card and updated roster.
  assert.equal(eventsOf(last.emits, 'student:end').length, 1);
  const roster = manager.roster(manager.registry.get(joinCode));
  assert.equal(roster.students[0].status, 'completed');
  assert.equal(roster.students[0].accuracy, 100);
  assert.equal(roster.classAccuracy.cabeza.count, 1, 'one class group: cabeza');
  assert.equal(roster.classAccuracy.cabeza.average, 100);
});

test('approval gate: solo student waits, then starts on approve', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager, { requireApproval: true });
  const res = join(manager, joinCode, 'Leo');
  assert.equal(res.approved, false);
  assert.equal(studentEvents(res.emits, res.studentId, 'match:begin').length, 0);

  const ok = manager.approveStudent({ joinCode, pin: PIN, studentId: res.studentId });
  assert.equal(studentEvents(ok.emits, res.studentId, 'join:approved').length, 1);
  assert.equal(studentEvents(ok.emits, res.studentId, 'match:begin').length, 1);
});

test('a wrong-kind move is rejected (every step here is a decision)', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  const bad = manager.submitMove({ joinCode, studentId: res.studentId, move: { kind: 'map', choiceIndex: 0 } });
  assert.equal(bad.error, 'wrong_step_kind');
});

test('rejoin returns a full snapshot of the live turn', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  playRight(manager, joinCode, res.studentId); // decision 1 done; decision 2 pending

  manager.markDisconnected({ joinCode, studentId: res.studentId });
  const back = manager.rejoinStudent({ joinCode, studentId: res.studentId });
  assert.ok(!back.error);
  assert.equal(back.sync.screen, 'match');
  assert.equal(back.sync.turn.kind, 'decision');
  assert.equal(back.sync.turn.yourTurn, true);
  assert.ok(back.sync.matchBegin.meta.journey, 'journey meta ships with the snapshot');
  assert.ok(Array.isArray(back.sync.turn.choices) && back.sync.turn.choices.length === 3);
});

test('end_session wipes the session from memory', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  join(manager, joinCode, 'Ana');
  const res = manager.endSession({ joinCode, pin: PIN });
  assert.ok(eventsOf(res.emits, 'session:ended').length >= 2, 'teacher + student notified');
  assert.equal(manager.registry.get(joinCode), undefined);
});

test('students cannot reach teacher data: report requires the PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.sessionReport({ joinCode, pin: '1111' }).error, 'bad_pin');
  assert.ok(manager.sessionReport({ joinCode, pin: PIN }).report);
});
