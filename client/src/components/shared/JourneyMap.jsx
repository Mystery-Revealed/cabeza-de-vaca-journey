// JourneyMap.jsx — the journey so far, drawn as a stylized map of the Texas
// coast and northern Mexico. Pure display (no clicking): the route unrolls a
// stop per chapter, from Isla de Malhado to Mexico City. Region names give the
// geography at headline level (TEKS 7.9A).
//
// Stops come from meta.journey (server-owned copy); this component only knows
// coordinates and which chapter the player is on.

const STOP_XY = {
  malhado:  { x: 372, y: 66 },
  coast:    { x: 312, y: 136 },
  roads:    { x: 252, y: 112 },
  brush:    { x: 226, y: 226 },
  west:     { x: 118, y: 192 },
  frontier: { x: 76,  y: 314 },
  home:     { x: 172, y: 404 },
};

// The walking route, stop to stop (gentle curves, not straight lines).
const ROUTE = [
  ['malhado', 'coast',    'M372,66 Q352,108 312,136'],
  ['coast',   'roads',    'M312,136 Q280,132 252,112'],
  ['roads',   'brush',    'M252,112 Q224,168 226,226'],
  ['brush',   'west',     'M226,226 Q168,196 118,192'],
  ['west',    'frontier', 'M118,192 Q78,248 76,314'],
  ['frontier','home',     'M76,314 Q110,384 172,404'],
];

export default function JourneyMap({ meta, chapterIndex = 0, done = false }) {
  const stops = meta?.journey || [];
  // Chapter i (0-based) means the traveler stands at stop i; done = home.
  const atIndex = done ? stops.length - 1 : Math.min(chapterIndex, stops.length - 2);
  const current = stops[atIndex] || stops[0];

  return (
    <svg
      className="journey-map"
      viewBox="0 0 440 440"
      role="img"
      aria-label={`Journey map: stop ${atIndex + 1} of ${stops.length}, ${current?.name || ''}, in the ${current?.region || ''}.`}
    >
      {/* the Gulf of Mexico */}
      <path
        className="gulf"
        d="M440,0 L440,440 L300,440 Q282,360 302,268 Q318,196 350,130 Q378,74 428,18 L440,0 Z"
      />
      <text x="382" y="286" className="water-label" transform="rotate(-62 382 286)">Gulf of Mexico</text>

      {/* the Rio Grande, dividing Texas from Mexico */}
      <path className="river" d="M6,150 Q90,196 150,242 Q226,300 306,276" />
      <text x="150" y="262" className="river-label" transform="rotate(28 150 262)">Rio Grande</text>

      {/* land labels — the regions of the road (TEKS 7.9A) */}
      <text x="216" y="52" className="land-label">TEXAS</text>
      <text x="100" y="392" className="land-label">MEXICO</text>
      <text x="284" y="176" className="region-label" transform="rotate(-52 284 176)">Coastal Plains</text>
      <text x="212" y="292" className="region-label">South Texas</text>
      <text x="100" y="150" className="region-label">Mountains &amp; Basins</text>

      {/* the route: walked = solid, ahead = dashed */}
      {ROUTE.map(([from, , d], i) => (
        <path key={from} className={`route ${i < atIndex ? 'walked' : 'ahead'}`} d={d} />
      ))}

      {/* the stops */}
      {stops.map((stop, i) => {
        const xy = STOP_XY[stop.id];
        if (!xy) return null;
        const isHome = stop.id === 'home';
        const state = i < atIndex ? 'visited' : i === atIndex ? 'current' : 'future';
        return (
          <g key={stop.id} className={`stop ${state}`} transform={`translate(${xy.x},${xy.y})`}>
            {i === atIndex && <circle className="stop-pulse" r="15" />}
            {isHome ? (
              <path
                className="stop-star"
                d="M0,-11 L2.9,-3.8 L10.5,-3.4 L4.6,1.5 L6.5,8.9 L0,4.8 L-6.5,8.9 L-4.6,1.5 L-10.5,-3.4 L-2.9,-3.8 Z"
              />
            ) : (
              <>
                <circle className="stop-dot" r="10" />
                <text className="stop-num" y="4" textAnchor="middle">{i + 1}</text>
              </>
            )}
            <text
              className="stop-name"
              y={isHome ? 24 : (stop.id === 'roads' || stop.id === 'west' ? -16 : 24)}
              textAnchor="middle"
            >
              {stop.name}
            </text>
          </g>
        );
      })}

      {/* the traveler, standing at the current stop */}
      {STOP_XY[current?.id] && (
        <g
          className="traveler"
          transform={`translate(${STOP_XY[current.id].x - 7}, ${STOP_XY[current.id].y - 34})`}
          aria-hidden="true"
        >
          <circle cx="7" cy="3" r="3.1" />
          <path d="M7,6.4 L7,14 M7,8.5 L2.5,12.5 M7,8.5 L11.5,11 L11.5,15 M7,14 L3.5,20 M7,14 L10,20 M11.8,6.5 L11.8,20" />
        </g>
      )}
    </svg>
  );
}

/* Caption under the map: where you are, and what region of the land it is. */
export function JourneyCaption({ meta, chapterIndex = 0, done = false }) {
  const stops = meta?.journey || [];
  const atIndex = done ? stops.length - 1 : Math.min(chapterIndex, stops.length - 2);
  const stop = stops[atIndex];
  if (!stop) return null;
  return (
    <div className="journey-caption">
      <span className="caption-pin" aria-hidden="true">📍</span>
      <b>{stop.name}</b>
      {stop.sub ? <span className="muted"> · {stop.sub}</span> : null}
      <span className="caption-region">{stop.region}</span>
    </div>
  );
}
