// ResultScreen.jsx — the journey's end, told with respect. Two stories, in
// order: (1) how well you WALKED (Journey Score + ending), (2) the score that
// matters to your teacher — accuracy — then the debrief carrying the double
// legacy: the kindness argument, and the gold rumors that launched Coronado.

import { Art } from '../../services/assets.jsx';

const TIER_CLASS = { home: 'win', survivor: 'mid', lost: 'low' };

export default function ResultScreen({ state, dispatch }) {
  const end = state.matchEnd;
  const meta = end.meta || state.match?.begin?.meta;
  const you = end.you;
  const ending = you.ending;
  const score = you.holdScore ?? 0;

  return (
    <div className="card result-screen">
      <div className="event-kicker">Mexico City · 1536</div>
      <h1 className={`result-headline ${TIER_CLASS[ending.key] || 'mid'}`}>{ending.title}</h1>

      <Art name="ending.jpg" alt="The traveler at journey's end, the long road behind him" className="result-art" />

      <p className="fall-note">
        This journey really happened. Of about ninety castaways, four walked out
        of Texas alive — not by conquering, but by <b>learning, trading, healing,
        and trusting the peoples of this land</b>. This game was about how well
        you walked their road.
      </p>

      <div className="ending-block cabeza">
        <p>{ending.text}</p>
      </div>

      <div className="score-block" aria-label="Journey Score">
        <div className="score-head">
          <span className="score-title">🌅 Journey Score</span>
          <span className="score-num">{score}<span className="muted"> / 300</span></span>
        </div>
        <span className="score-bar-track">
          <span className={`score-bar ${TIER_CLASS[ending.key] || 'mid'}`} style={{ width: `${Math.min(100, (score / 300) * 100)}%` }} />
        </span>
        <div className="meter-final-row">
          {Object.entries(you.meters || {}).map(([k, v]) => (
            <span key={k} className="meter-final">{meta?.meters?.[k]?.name || k}: <b>{v}</b></span>
          ))}
        </div>
      </div>

      <div className="accuracy-block">
        <div className="accuracy-number">{you.accuracy}%</div>
        <div>
          <b>Your accuracy — the score your teacher sees.</b>
          <p>How well your 12 choices matched what the real survivors did. A traveler who walks well <i>and</i> stays true to history scores highest.</p>
        </div>
      </div>

      <div className="debrief">
        <h3>What really happened</h3>
        <p>{you.debrief}</p>
      </div>

      <div className="btn-col">
        <button className="btn big" onClick={() => dispatch({ type: 'play-again' })}>
          Play again
        </button>
      </div>
    </div>
  );
}
