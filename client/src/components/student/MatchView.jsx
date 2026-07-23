// MatchView.jsx — one chapter beat at a time: event card → decision → feedback.
// Single-role solo, so it's always your turn. The journey map is always on
// screen, unrolling a stop per chapter; the action panel swaps.

import { useState } from 'react';
import { emitAck, errorText } from '../../services/socket.js';
import { Art } from '../../services/assets.jsx';
import JourneyMap, { JourneyCaption } from '../shared/JourneyMap.jsx';
import MetersBar from '../shared/MetersBar.jsx';

const journeyScore = (m) => (m ? (m.health || 0) + (m.standing || 0) + (m.hope || 0) : 0);

export default function MatchView({ state, dispatch }) {
  const { match } = state;
  const { begin, eventCard, turn, feedback } = match;
  const meta = begin.meta;

  // The server pushes the NEXT chapter's chapter:event AND its first turn:begin
  // synchronously with the CURRENT chapter's LAST turn:resolution — it doesn't
  // wait for the student to dismiss anything. So while a chapter-ending verdict
  // is on screen, eventCard AND turn have BOTH already raced ahead, and
  // preferring either would make the chip read one chapter ahead. Only
  // feedback.stepIndex is baked into the feedback payload itself and can't
  // race — derive the chapter from it (2 steps per chapter, the same rule the
  // server's chapterOf uses). Once feedback is dismissed, eventCard/turn are
  // exactly what's on screen next, so THEIR chapter is what should show.
  const chapters = meta.chapters?.[begin.side] || [];
  const stepsPerChapter = meta.stepsPerChapter || 2;
  const chapterIndexFor = (stepIndex) => Math.floor(stepIndex / stepsPerChapter);
  const liveChapterIndex = feedback ? chapterIndexFor(feedback.stepIndex)
    : turn?.yourTurn ? chapterIndexFor(turn.stepIndex)
    : eventCard ? eventCard.chapter.index
    : null;
  const chapter = liveChapterIndex != null && chapters[liveChapterIndex]
    ? { index: liveChapterIndex, count: chapters.length, ...chapters[liveChapterIndex] }
    : (eventCard?.chapter || turn?.chapter); // fallback if meta.chapters is ever absent
  const chapterIndex = chapter?.index ?? 0;
  const lowMeter = Object.entries(match.meters || {}).find(([, v]) => v <= 15);

  return (
    <div className="match">
      <header className="match-header">
        <div className="nation-chip cabeza">You are <b>Cabeza de Vaca</b></div>
        <div className="hold-chip" title="Your three meters added up (max 300)">
          Journey Score <b>{journeyScore(match.meters)}</b><span className="muted"> / 300</span>
        </div>
        {chapter && (
          <div className="chapter-chip">
            Chapter {chapter.index + 1} of {chapter.count} · {chapter.date}
          </div>
        )}
      </header>

      <div className="meters-row solo">
        <MetersBar meters={match.meters} meta={meta} title="The Traveler" />
      </div>

      {lowMeter && !feedback && (
        <div className="banner danger" role="alert">
          ⚠️ Your {meta.meters[lowMeter[0]]?.name || lowMeter[0]} is running very low. Steady yourself — the road is long.
        </div>
      )}

      <div className="match-body">
        <section className="action-panel" aria-live="polite">
          {feedback ? (
            <FeedbackPanel
              feedback={feedback}
              meta={meta}
              matchEnded={!!state.matchEnd}
              onContinue={() => dispatch({ type: 'dismiss-feedback' })}
            />
          ) : eventCard ? (
            <EventCard eventCard={eventCard} meta={meta} onContinue={() => dispatch({ type: 'dismiss-event' })} />
          ) : turn?.yourTurn ? (
            <DecisionPanel turn={turn} />
          ) : (
            <div className="waiting-panel"><div className="pulse-dot" aria-hidden="true" /><p>The road waits…</p></div>
          )}
        </section>

        <section className="map-panel">
          <JourneyMap meta={meta} chapterIndex={chapterIndex} done={!!state.matchEnd} />
          <JourneyCaption meta={meta} chapterIndex={chapterIndex} done={!!state.matchEnd} />
        </section>
      </div>
    </div>
  );
}

/* -------- panels -------- */

function EventCard({ eventCard, meta, onContinue }) {
  const ch = eventCard.chapter;
  return (
    <div className="event-card">
      <div className="event-kicker">Chapter {ch.index + 1} of {ch.count} · {ch.date}</div>
      <h2>{ch.title}</h2>
      <Art name={ch.image} alt={ch.title} className="event-art" />
      <p className="event-text">{eventCard.text}</p>
      {eventCard.eventEffects && (
        <div className="effects-row">
          {Object.entries(eventCard.eventEffects).map(([k, v]) => (
            <span key={k} className={`effect-chip ${v > 0 ? 'up' : 'down'}`}>
              {meta.meters[k]?.name} {v > 0 ? `+${v}` : v}
            </span>
          ))}
        </div>
      )}
      <button className="btn big" onClick={onContinue}>Walk on</button>
    </div>
  );
}

function DecisionPanel({ turn }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function choose(choiceIndex) {
    if (busy) return;
    setBusy(true);
    const res = await emitAck('student:submit_move', { move: { kind: 'decision', choiceIndex } });
    if (!res.ok) { setErr(errorText(res.error)); setBusy(false); }
    // On success the server pushes turn:resolution and this panel unmounts.
  }

  return (
    <div className="move-panel">
      <h2>🤔 Your decision</h2>
      <p className="prompt">{turn.prompt}</p>
      {turn.hint && <p className="hint">💡 {turn.hint}</p>}
      <div className="choice-list">
        {(turn.choices || []).map((label, i) => (
          <button key={i} className="choice-btn" disabled={busy} onClick={() => choose(i)}>
            {label}
          </button>
        ))}
      </div>
      <p className="err" role="alert">{err}</p>
    </div>
  );
}

const VERDICT_UI = {
  right: { label: 'A survivor’s wisdom', className: 'right', icon: '✓' },
  partial: { label: 'Half a measure', className: 'partial', icon: '≈' },
  wrong: { label: 'A hard lesson', className: 'wrong', icon: '✗' },
};

function FeedbackPanel({ feedback, meta, matchEnded, onContinue }) {
  const v = VERDICT_UI[feedback.verdict] || VERDICT_UI.partial;
  return (
    <div className="feedback-panel">
      <div className={`verdict-badge ${v.className}`}>
        <span aria-hidden="true">{v.icon}</span> {v.label}
      </div>
      <p className="feedback-text">{feedback.feedback}</p>
      <div className="effects-row">
        {Object.entries(feedback.effects || {}).map(([k, val]) => (
          <span key={k} className={`effect-chip ${val > 0 ? 'up' : 'down'}`}>
            {meta.meters[k]?.name} {val > 0 ? `+${val}` : val}
          </span>
        ))}
      </div>
      <button className="btn big" onClick={onContinue}>
        {matchEnded ? 'See how the journey ends' : 'Continue'}
      </button>
    </div>
  );
}
