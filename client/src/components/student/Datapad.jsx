// Datapad.jsx — the student game. A small state machine over socket pushes:
// title → how to play → join → (approval) → briefing → match (6 chapters) → result.
// Single-role solo: everyone walks as Cabeza de Vaca. The server owns all truth;
// this component only renders what it's told.

import { useEffect, useReducer, useRef, useState } from 'react';
import { getSocket, emitAck, errorText } from '../../services/socket.js';
import { Art } from '../../services/assets.jsx';
import MatchView from './MatchView.jsx';
import ResultScreen from './ResultScreen.jsx';

const initialState = {
  screen: 'title', // title | how | join | waiting_approval | briefing | match | result | ended
  joinCode: '',
  name: '',
  studentId: null,
  error: '',
  endedMessage: '',
  match: null,
  matchEnd: null,
};

function freshMatch(begin) {
  return {
    begin,
    map: begin.map,
    meters: begin.meters,
    eventCard: null,
    turn: null,
    feedback: null,
  };
}

// Merge live payloads (chapter:event, turn:begin, turn:resolution) into the match.
function mergeLive(match, payload) {
  const next = { ...match };
  if (payload.map) next.map = payload.map;
  if (payload.meters) next.meters = payload.meters;
  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ui':
      return { ...state, ...action.patch };
    case 'joined':
      return {
        ...state,
        studentId: action.studentId,
        error: '',
        screen: action.approved ? 'briefing' : 'waiting_approval',
      };
    case 'approved':
      return { ...state, screen: state.screen === 'waiting_approval' ? 'briefing' : state.screen };
    case 'match:begin':
      return { ...state, screen: 'match', matchEnd: null, match: freshMatch(action.payload) };
    case 'chapter:event': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      return { ...state, match: { ...match, eventCard: action.payload } };
    }
    case 'turn:begin': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      return { ...state, match: { ...match, turn: action.payload } };
    }
    case 'turn:resolution': {
      if (!state.match) return state;
      const match = mergeLive(state.match, action.payload);
      return { ...state, match: { ...match, feedback: action.payload } };
    }
    case 'match:end': {
      // Hold the result until pending feedback is dismissed (chronological order).
      const showNow = !state.match?.feedback;
      return { ...state, matchEnd: action.payload, screen: showNow ? 'result' : state.screen };
    }
    case 'dismiss-feedback': {
      if (!state.match) return state;
      if (state.matchEnd) return { ...state, screen: 'result', match: { ...state.match, feedback: null } };
      return { ...state, match: { ...state.match, feedback: null } };
    }
    case 'dismiss-event':
      return state.match ? { ...state, match: { ...state.match, eventCard: null } } : state;
    case 'sync': {
      const s = action.sync;
      if (s.screen === 'waiting_approval') return { ...state, screen: 'waiting_approval' };
      if (s.screen === 'lobby') return { ...state, screen: 'briefing' };
      if (s.screen === 'result') return { ...state, screen: 'result', matchEnd: s.matchEnd };
      if (s.screen === 'match') {
        const match = freshMatch(s.matchBegin);
        return {
          ...state,
          screen: 'match',
          matchEnd: null,
          match: { ...match, eventCard: s.chapterEvent, turn: s.turn },
        };
      }
      return state;
    }
    case 'removed':
      return { ...initialState, screen: 'join', joinCode: state.joinCode, name: '', error: 'Your teacher removed you from the session. You can join again.' };
    case 'ended':
      return { ...initialState, screen: 'ended', endedMessage: 'Your teacher ended this session. Rest well, traveler.' };
    case 'play-again':
      return { ...initialState, screen: 'join', joinCode: state.joinCode, name: state.name };
    default:
      return state;
  }
}

export default function Datapad() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const socket = getSocket();
    const on = (event, type) => {
      const fn = (payload) => dispatch({ type, payload });
      socket.on(event, fn);
      return [event, fn];
    };
    const subs = [
      on('match:begin', 'match:begin'),
      on('chapter:event', 'chapter:event'),
      on('turn:begin', 'turn:begin'),
      on('turn:resolution', 'turn:resolution'),
      on('match:end', 'match:end'),
    ];
    const approved = () => dispatch({ type: 'approved' });
    const removed = () => dispatch({ type: 'removed' });
    const ended = () => dispatch({ type: 'ended' });
    socket.on('join:approved', approved);
    socket.on('student:removed', removed);
    socket.on('session:ended', ended);

    // School wifi blip: the socket reconnects → re-attach and re-sync the screen.
    const onReconnect = async () => {
      const s = stateRef.current;
      if (!s.studentId || !s.joinCode) return;
      const res = await emitAck('student:rejoin', { joinCode: s.joinCode, studentId: s.studentId });
      if (res.ok) dispatch({ type: 'sync', sync: res.sync });
    };
    socket.io.on('reconnect', onReconnect);

    return () => {
      for (const [event, fn] of subs) socket.off(event, fn);
      socket.off('join:approved', approved);
      socket.off('student:removed', removed);
      socket.off('session:ended', ended);
      socket.io.off('reconnect', onReconnect);
    };
  }, []);

  const { screen } = state;
  return (
    <div className="app student-app">
      {screen === 'title' && <TitleScreen onStart={() => dispatch({ type: 'ui', patch: { screen: 'join' } })} onHow={() => dispatch({ type: 'ui', patch: { screen: 'how' } })} />}
      {screen === 'how' && <HowToPlay onBack={() => dispatch({ type: 'ui', patch: { screen: 'title' } })} />}
      {screen === 'join' && <JoinForm state={state} dispatch={dispatch} />}
      {screen === 'waiting_approval' && (
        <WaitCard title="Hold on, traveler!" text="Your teacher is checking names. Your journey will begin in a moment." />
      )}
      {screen === 'briefing' && (
        <WaitCard title="You are Cabeza de Vaca." text="The surf is cold, the island is gray, and the road home is eight years long. Your story is being readied — stand by." />
      )}
      {screen === 'match' && state.match && <MatchView state={state} dispatch={dispatch} />}
      {screen === 'result' && state.matchEnd && <ResultScreen state={state} dispatch={dispatch} />}
      {screen === 'ended' && (
        <WaitCard title="Session ended" text={state.endedMessage}>
          <button className="btn" onClick={() => dispatch({ type: 'ui', patch: { ...initialState, screen: 'title' } })}>
            Back to the title screen
          </button>
        </WaitCard>
      )}
      <footer className="app-footer">Made for 7th Grade Texas History · TEKS 7.2B, 7.2A</footer>
    </div>
  );
}

/* ---------------- small screens ---------------- */

function TitleScreen({ onStart, onHow }) {
  return (
    <div className="card title-screen">
      <Art name="title_hero.jpg" alt="A lone tattered traveler walking a vast Texas plain at dawn" className="hero-art" />
      <h1 className="game-title">Cabeza de Vaca’s Journey</h1>
      <p className="tagline">Eight years. Four survivors. One long walk home.</p>
      <p className="title-blurb">
        November, 1528. Your raft breaks apart in the cold surf off a Texas
        island. You are Álvar Núñez Cabeza de Vaca — no food, no weapons, not
        even shoes. To survive the next eight years, you must do something no
        conqueror planned to do: <b>listen, learn, and depend on the peoples of
        this land.</b>
      </p>
      <div className="btn-col">
        <button className="btn big" onClick={onStart}>Join your class</button>
        <button className="btn secondary" onClick={onHow}>How to play</button>
      </div>
    </div>
  );
}

function HowToPlay({ onBack }) {
  return (
    <div className="card how-screen">
      <h2>How to play</h2>
      <ol className="how-list">
        <li><b>Join with your class code.</b> You play Cabeza de Vaca, a real explorer shipwrecked in Texas in 1528.</li>
        <li><b>Live 6 chapters of his eight-year journey</b> (1528–1536). Each chapter opens with the story — then you make <b>two decisions</b>, picking 1 of 3 choices.</li>
        <li><b>Watch the map.</b> Every chapter moves you one stop closer to Mexico City.</li>
      </ol>
      <h3>Your three meters</h3>
      <ul className="how-list">
        <li>❤️ <b>Health</b> — your body. Hunger, cold, and sickness drain it.</li>
        <li>🤝 <b>Standing</b> — trust with the peoples you live among. It is the only power you have.</li>
        <li>🌅 <b>Hope</b> — the fire inside that keeps you walking toward home.</li>
      </ul>
      <div className="note">
        <b>You are not here to conquer anything. You are here to get home.</b>{' '}
        Your <b>Journey Score</b> (your three meters added up) tells how well you
        walked the road. Your <b>accuracy</b> — the score your teacher sees —
        tells how well your choices match what the real survivors did.
      </div>
      <h3>Words to know</h3>
      <ul className="how-list">
        <li><b>Castaway</b> — a person shipwrecked far from home.</li>
        <li><b>Expedition</b> — a journey made by a group with a goal.</li>
        <li><b>Malhado</b> — “the Island of Misfortune,” the castaways’ name for the island where they wrecked.</li>
        <li><b>Trader</b> — a person who carries goods between peoples and swaps them.</li>
        <li><b>Escort</b> — people who travel with you to guide and protect you.</li>
        <li><b>La Relación</b> — “The Account,” Cabeza de Vaca’s true report about Texas, the first European book to describe it.</li>
      </ul>
      <button className="btn" onClick={onBack}>Back</button>
    </div>
  );
}

function JoinForm({ state, dispatch }) {
  const [busy, setBusy] = useState(false);
  const set = (patch) => dispatch({ type: 'ui', patch });

  async function join() {
    if (busy) return;
    setBusy(true);
    set({ error: '' });
    const res = await emitAck('student:join', {
      joinCode: state.joinCode.trim(),
      nickname: state.name.trim(),
      mode: 'solo',
    });
    setBusy(false);
    if (!res.ok) return set({ error: errorText(res.error) });
    dispatch({ type: 'joined', studentId: res.studentId, approved: res.approved });
  }

  return (
    <div className="card join-screen">
      <h2>Join your class</h2>
      <label htmlFor="join-code">Class code</label>
      <input
        id="join-code" inputMode="numeric" autoComplete="off" maxLength={6}
        placeholder="6-digit code" value={state.joinCode}
        onChange={(e) => set({ joinCode: e.target.value.replace(/\D/g, '') })}
      />
      <label htmlFor="join-name">Your first name</label>
      <input
        id="join-name" maxLength={20} placeholder="e.g. Ana R." value={state.name}
        onChange={(e) => set({ name: e.target.value })}
      />
      <p className="muted">You’ll walk the long road home as Cabeza de Vaca.</p>

      <p className="err" role="alert">{state.error}</p>
      <div className="btn-col">
        <button className="btn big" disabled={busy || state.joinCode.length !== 6 || state.name.trim().length < 2} onClick={join}>
          {busy ? 'Joining…' : 'Begin the journey'}
        </button>
        <button className="btn ghost" onClick={() => set({ screen: 'title', error: '' })}>Back</button>
      </div>
    </div>
  );
}

function WaitCard({ title, text, children }) {
  return (
    <div className="card wait-card">
      <div className="pulse-dot" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  );
}
