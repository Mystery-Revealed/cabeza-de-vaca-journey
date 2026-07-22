// cabezaDeVaca.js — Unit 2 game adapter: "Cabeza de Vaca's Journey" (SOLO only).
// Everyone plays Álvar Núñez Cabeza de Vaca, shipwrecked on a Texas island in
// November 1528. Six chapters × 2 decisions = 12 graded actions, 1528–1536.
//
// Tone: the first European account of Texas is a story where the explorer
// survives only by LEARNING FROM and DEPENDING ON Native peoples — the game
// flips the conqueror script. Native peoples are rescuers, teachers, and hosts
// with full agency; the hardship years are told without villainizing any people.
// Estevanico is named and honored. The slaver scene is the moral spine, told at
// headline level, no gore (spec §6).
//
// THE ANSWER KEY LIVES HERE, ON THE SERVER (verdicts/effects/feedback). The
// factory ships labels only; the client submits { kind, choiceIndex }.
// Student-facing text is written at a 5th grade reading level.

import { createStepGame } from './_stepGame.js';

// ---------------------------------------------------------------------------
// Board metadata (shipped to clients at match:begin — display info only)
// ---------------------------------------------------------------------------

export const METERS = {
  health:   { name: 'Health',   icon: 'health',   blurb: 'Your body. Hunger, cold, and sickness drain it. At 0, your journey ends.' },
  standing: { name: 'Standing', icon: 'standing', blurb: 'Trust with the peoples you live among. It is the only power you have.' },
  hope:     { name: 'Hope',     icon: 'hope',     blurb: 'The fire inside that keeps you walking toward home.' },
};

// The stops on the journey map (client display only). One waypoint per chapter,
// plus the journey's end. `region` names the Texas region at headline level
// (TEKS 7.9A); the client draws the route and advances a marker per chapter.
export const JOURNEY = [
  { id: 'malhado',  name: 'Isla de Malhado',    sub: 'Galveston Island',    region: 'Gulf Coast' },
  { id: 'coast',    name: 'The Coastal Camps',  sub: 'the hard years',      region: 'Coastal Plains' },
  { id: 'roads',    name: 'The Trade Roads',    sub: 'coast to inland',     region: 'Coastal Plains → inland' },
  { id: 'brush',    name: 'Prickly Pear Country', sub: 'the escape west',   region: 'South Texas' },
  { id: 'west',     name: 'The Far West',       sub: 'the healer’s road',   region: 'Mountains & Basins' },
  { id: 'frontier', name: 'The Spanish Frontier', sub: 'near the Pacific',  region: 'northern Mexico' },
  { id: 'home',     name: 'Mexico City',        sub: 'journey’s end',       region: '1536' },
];

const START_METERS = { health: 50, standing: 50, hope: 50 };

// ---------------------------------------------------------------------------
// CHAPTERS — the full content bank (Fable draft, verbatim). Each chapter: an
// event card + 2 graded decisions. ✅ right (+1) · ⚠️ partial (+0.5) · ❌ wrong (0).
// Event cards may carry a one-time meter toll (eventEffects).
// ---------------------------------------------------------------------------

export const PHASES = [
  // ---- Chapter 1 — Malhado, the Island of Misfortune (November 1528) ----
  {
    title: 'Malhado, the Island of Misfortune', date: 'November 1528', image: 'event_malhado.jpg',
    event: 'Your raft breaks apart in the November surf. You crawl onto a cold, gray island — you will come to call it Malhado, the Island of Misfortune. Local people find your freezing party on the beach. They are strong and healthy in a land that is starving you. They look at you with wonder — and with pity.',
    steps: [
      {
        kind: 'decision',
        prompt: 'The islanders offer food, fire, and shelter. What do you do?',
        choices: [
          { label: 'Accept, but keep your group apart and guarded.',
            verdict: 'partial', effects: { health: 5, standing: -5 },
            feedback: 'Warmth with walls. You’ll need these people far more than they need you.' },
          { label: 'Demand help in the name of Spain.',
            verdict: 'wrong', effects: { standing: -15 },
            feedback: 'You are a starving stranger with no shoes. Spain is very far away.' },
          { label: 'Accept their help humbly — food, fire, shelter.',
            verdict: 'right', effects: { health: 15, standing: 10 },
            feedback: 'They wept at the castaways’ suffering and shared what they had. Pride would have been a grave.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Winter deepens. Food is scarce for everyone — the islanders too. How do you get through it?',
        choices: [
          { label: 'Work as the band works — dig roots, haul wood, earn your keep.',
            verdict: 'right', effects: { standing: 10, health: 5 },
            feedback: 'You learn the first rule of this land: everyone works, or everyone starves. Earning your keep earns respect.' },
          { label: 'Trade away your last Spanish goods for food.',
            verdict: 'partial', effects: { hope: 5 },
            feedback: 'It buys a few meals. But goods run out. Work and trust do not.' },
          { label: 'Steal from the winter stores.',
            verdict: 'wrong', effects: { standing: -15 },
            feedback: 'Stealing from hungry people who saved your life? If they cast you out, the winter will finish you.' },
        ],
      },
    ],
  },

  // ---- Chapter 2 — The Hard Years (1529–1532) ----
  {
    title: 'The Hard Years', date: '1529–1532', image: 'event_hardyears.jpg',
    eventEffects: { health: -10, hope: -10 },
    event: 'The years that follow are the hardest of your life. Sickness takes most of the castaways. You live as a servant among hard-pressed peoples — hauling wood, digging roots until your fingers bleed. The work is brutal, and you are often hungry. But you are alive. And every day, this land is teaching — if you are willing to learn. (Health −10, Hope −10)',
    steps: [
      {
        kind: 'decision',
        prompt: 'The labor is endless and you are treated as the lowest of the band. What keeps you alive?',
        choices: [
          { label: 'Keep your head down and just get through each day.',
            verdict: 'partial', effects: { health: 5 },
            feedback: 'You survive — but only barely. The ones who lasted did more than endure. They learned.' },
          { label: 'Endure, watch, and learn the language word by word.',
            verdict: 'right', effects: { standing: 10, hope: 5 },
            feedback: 'Survival here is learning. Every word you learn turns a stranger into someone you can talk to.' },
          { label: 'Run for the mainland alone, with no plan.',
            verdict: 'wrong', effects: { health: -15, hope: -5 },
            feedback: 'Alone, with no food, no map, and no friends? The land is not the enemy — but it does not forgive.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'The seasons turn. The people move camp to follow the food. How do you eat?',
        choices: [
          { label: 'Eat what you’re given, but never learn to find it yourself.',
            verdict: 'partial', effects: { health: 5, hope: -5 },
            feedback: 'A guest who never learns stays helpless. You want to be useful — useful people are kept alive.' },
          { label: 'Learn what the people eat and when — roots, pecans, prickly pear — and follow their year.',
            verdict: 'right', effects: { health: 10, standing: 5 },
            feedback: 'The land is a calendar, and the people can read it. Pecan groves in fall, prickly pear in summer. Now you can read it too.' },
          { label: 'Hold out for Spanish food — bread, meat, wine.',
            verdict: 'wrong', effects: { health: -10 },
            feedback: 'There is no Spanish food for six hundred miles. Hunger is a poor teacher, but an honest one.' },
        ],
      },
    ],
  },

  // ---- Chapter 3 — The Trader (1530s) ----
  {
    title: 'The Trader', date: 'the 1530s', image: 'event_trader.jpg',
    event: 'You see something no one else sees. The coastal peoples have shells and sea beans. The inland peoples have hides and red ochre. They want each other’s goods — but old conflicts make the road between them dangerous. A stranger who belongs to no band could walk that road. Someone like you.',
    steps: [
      {
        kind: 'decision',
        prompt: 'You could become a trader between the coast and the inland country. What do you do?',
        choices: [
          { label: 'Carry shells inland and hides back — become useful between peoples.',
            verdict: 'right', effects: { standing: 15, hope: 5 },
            feedback: 'This is your true story. As a trader you walked free, welcomed on every side, because everyone needed what you carried.' },
          { label: 'Trade, but only close to camp where it feels safe.',
            verdict: 'partial', effects: { standing: 5 },
            feedback: 'Safe, but small. The real prize was the long road — it made you known far inland, and that fame will matter later.' },
          { label: 'Hoard the best goods to buy your own escape someday.',
            verdict: 'wrong', effects: { standing: -10 },
            feedback: 'Word travels faster than you do. A trader no one trusts is just a man walking alone with a full pack.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Two bands you trade with have an old grudge. Each wants you to favor them. What is your rule?',
        choices: [
          { label: 'Quietly favor the band that feeds you best.',
            verdict: 'partial', effects: { standing: -5, health: 5 },
            feedback: 'A full belly today, a closed road tomorrow. Grudges stick to those who pick sides.' },
          { label: 'Play the bands against each other for better prices.',
            verdict: 'wrong', effects: { standing: -15 },
            feedback: 'Games like that get traders killed. Your only armor on this road is trust.' },
          { label: 'Deal fairly with every band, and carry no side’s quarrel.',
            verdict: 'right', effects: { standing: 10, hope: 5 },
            feedback: 'Fair and neutral — that is why your road stayed open. You became the one man welcome in every camp.' },
        ],
      },
    ],
  },

  // ---- Chapter 4 — The Escape West (1534) ----
  {
    title: 'The Escape West', date: '1534', image: 'event_escape.jpg',
    event: 'At a prickly pear harvest, you find them: Estevanico, Dorantes, and Castillo — the last other survivors of the ninety. Estevanico is an enslaved man, born in Morocco, and he has a gift you will come to depend on: languages and signs seem to open before him. The four of you whisper a plan. West. Together. Toward Mexico — however far that is.',
    steps: [
      {
        kind: 'decision',
        prompt: 'The harvest gathering is the one time of year you four are in the same place. How do you escape?',
        choices: [
          { label: 'Send one man ahead alone to scout the way.',
            verdict: 'partial', effects: { hope: 5, health: -5 },
            feedback: 'Splitting up in this country loses people. The gathering comes once a year — a scout who vanishes costs you everything.' },
          { label: 'Go together — four survivors, one plan, one chance a year.',
            verdict: 'right', effects: { hope: 15, standing: 5 },
            feedback: 'Together. That is how it really happened — and it is the only way any of you make it. Four know more than one.' },
          { label: 'Wait another year. It never feels safe enough.',
            verdict: 'wrong', effects: { hope: -15 },
            feedback: 'You have waited six years already. Some doors open once. Hope dies of waiting.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Ahead lie lands and languages none of you know. Whose gifts lead the way?',
        choices: [
          { label: 'Lead yourself, as the ranking Spaniard, and use his gifts only when stuck.',
            verdict: 'partial', effects: { standing: 5, hope: -5 },
            feedback: 'Rank means nothing out here. The four of you lived because you used every gift you had — and his was the greatest.' },
          { label: 'Avoid all villages and slip west unseen.',
            verdict: 'wrong', effects: { health: -10, hope: -5 },
            feedback: 'There is no unseen. The villages are the food, the water, the guides. Hiding from the people means starving in the dark.' },
          { label: 'Follow Estevanico’s lead — his gift for languages opens village after village.',
            verdict: 'right', effects: { standing: 10, hope: 5 },
            feedback: 'Name him and give him his due: Estevanico, enslaved and unfree, became one of the great explorers of this continent. He went first into nearly every new village.' },
        ],
      },
    ],
  },

  // ---- Chapter 5 — The Healer's Road (1535) ----
  {
    title: 'The Healer’s Road', date: '1535', image: 'event_healers.jpg',
    eventEffects: { health: -5 },
    event: 'Word runs ahead of you on the road west. A man was sick; you knelt, prayed, breathed a blessing — and he got better. Now every village brings you their sick. They call you healers. Crowds gather at each stop, and the road is long, and you are so tired. (Health −5)',
    steps: [
      {
        kind: 'decision',
        prompt: 'A village brings you a man burning with fever. All eyes are on you. What do you do?',
        choices: [
          { label: 'Treat him humbly — pray with the people, in their way and yours, and take no payment but food.',
            verdict: 'right', effects: { standing: 15, hope: 5 },
            feedback: 'This is the voice of your real account: humble hands, shared faith, no payment but a meal. The people’s own belief did work no medicine could.' },
          { label: 'Refuse — you are no doctor, and you fear doing harm.',
            verdict: 'partial', effects: { standing: -5, hope: -5 },
            feedback: 'Honest — but refusing a gift of trust is its own wound here. They did not ask you to be a doctor. They asked you to care.' },
          { label: 'Act the great magician, and demand gifts for your power.',
            verdict: 'wrong', effects: { standing: -15 },
            feedback: 'The moment you charge for mercy, you become a fraud. And frauds are found out on a road this long.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Now thousands escort you from village to village, singing. Each village loads you with gifts. What do you do with the honor?',
        choices: [
          { label: 'Accept it all quietly and keep the gifts for the road ahead.',
            verdict: 'partial', effects: { health: 5, standing: -5 },
            feedback: 'Supplies help. But hoarding honor makes it curdle. The road runs on generosity.' },
          { label: 'Use your fame to command the crowds like a lord.',
            verdict: 'wrong', effects: { standing: -15, hope: -5 },
            feedback: 'They walk with you out of love and wonder, not fear. Command them, and watch the road empty.' },
          { label: 'Credit the people’s own faith, and pass the gifts on to each new village’s guides.',
            verdict: 'right', effects: { standing: 10, hope: 10 },
            feedback: 'The gifts flowed through you, not to you — and the escort grew at every stop. Humility, it turns out, travels well.' },
        ],
      },
    ],
  },

  // ---- Chapter 6 — The Slavers (1536) ----
  {
    title: 'The Slavers', date: '1536', image: 'event_slavers.jpg',
    event: 'Eight years. Six hundred leagues. And then, near the western coast, you see them: men on horses, armored, speaking Spanish. Your own people — at last. But your joy curdles fast. These men are slave hunters. They look at the Native families walking beside you — the people who fed you, healed with you, carried you home — and they see prey.',
    steps: [
      {
        kind: 'decision',
        prompt: 'The slavers move toward your escorts. What do you do?',
        choices: [
          { label: 'Stand between the slavers and the people who carried you.',
            verdict: 'right', effects: { standing: 15, hope: 10 },
            feedback: 'You did. It is one of the most remarkable moments in Texas history: the rescued explorer defending his Native friends from his own countrymen.' },
          { label: 'Bargain quietly — you win a delay, but you don’t stop them.',
            verdict: 'partial', effects: { standing: -5 },
            feedback: 'Half a shield is not a shield. Your real stand was louder than this — and it cost you with the slavers, and you paid it.' },
          { label: 'Rejoin your countrymen and hand over your guides.',
            verdict: 'wrong', effects: { standing: -20, hope: -10 },
            feedback: 'After eight years — after everything these people gave you? Some choices unmake a man. This was never yours.' },
        ],
      },
      {
        kind: 'decision',
        prompt: 'Home at last, you must write your report to the King — La Relación, the first European book about Texas. What do you write?',
        choices: [
          { label: 'Mostly truth — but you let hints of golden cities glitter between the lines.',
            verdict: 'partial', effects: { hope: 5, standing: -5 },
            feedback: 'Careful. Garbled retellings of your journey will feed the Cities of Gold rumors either way — but a report that winks at gold sends armies.' },
          { label: 'The truth: a land rich in peoples, not gold — and an argument that they be treated with kindness.',
            verdict: 'right', effects: { hope: 15, standing: 5 },
            feedback: 'You wrote it: to bring these people to Spain’s friendship, “they must be won by kindness, the only certain way.” Few conquerors ever wrote a sentence like that.' },
          { label: 'Say little. You just want to forget Texas.',
            verdict: 'wrong', effects: { hope: -10 },
            feedback: 'Then the only stories told will be the wrong ones. You carried eight years of truth home. Spend it.' },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Endings & debrief. Journey Score = health + standing + hope (max 300).
// A journey that ends with Health at 0 shows the collapse telling of the low
// ending — the run still plays all 12 actions, so the grade stays honest.
// ---------------------------------------------------------------------------

export const ENDINGS = {
  home: {
    title: 'The Long Walk Home',
    text: 'Eight years after the wreck, you walk into Mexico City — alive, changed, and carrying a story no one expected: the explorer who survived by learning, trading, healing, and trusting the peoples of Texas. Of ninety castaways, four made it. You made it your way — their way.',
  },
  survivor: {
    title: 'Survivor of Malhado',
    text: 'You survive the island, the hard years, and the long road — but only just. You reach Mexico worn thin, with fewer friends on the road behind you. You made it home. The land and its peoples carried more of you than you let them.',
  },
  lost: {
    title: 'Lost to the Island',
    text: 'The journey breaks you before Mexico ever appears. Most of the ninety castaways were lost this way — to cold, to hunger, to pride. In this land, the ones who survived were the ones who learned to depend on its peoples.',
  },
  collapsed: {
    title: 'Lost to the Island',
    text: 'Your strength gives out, far from home. Texas in the 1530s spared almost no one — of ninety castaways, only four ever saw Mexico. They survived by earning trust, learning the land, and walking together.',
  },
};

export const DEBRIEF =
  'What really happened: Cabeza de Vaca survived eight years in Texas (1528–1536) — castaway, servant, trader, and healer — by learning from and depending on Native peoples. Of about ninety castaways, four survived: Cabeza de Vaca, Dorantes, Castillo, and Estevanico, the enslaved Moroccan-born man whose gift for languages helped lead them all home. Cabeza de Vaca’s book about the journey, La Relación, described Texas’s lands and peoples for the first time in a European book — and argued they should be treated with kindness. But garbled retellings of his story fed rumors of golden cities. Those rumors launched Coronado and the next wave of expeditions. One journey, two legacies: an argument for humanity, and an accidental spark for conquest.';

export const journeyScore = (m) =>
  (m?.health || 0) + (m?.standing || 0) + (m?.hope || 0);

// Tier thresholds (content bank): home ≥ 220, survivor ≥ 150, lost < 150.
// Health at 0 tells the low ending in its collapse voice, whatever the sum.
export function endingFor(score, _accuracy, meters = {}) {
  if ((meters.health ?? 1) <= 0) return { key: 'lost', ...ENDINGS.collapsed };
  if (score >= 220) return { key: 'home', ...ENDINGS.home };
  if (score >= 150) return { key: 'survivor', ...ENDINGS.survivor };
  return { key: 'lost', ...ENDINGS.lost };
}

export default createStepGame({
  id: 'cabeza-de-vaca',
  title: 'Cabeza de Vaca’s Journey',
  side: 'cabeza',              // one class-wide group: everyone walks the same road
  startMeters: () => ({ ...START_METERS }),
  phases: PHASES,
  meta: { meters: METERS, journey: JOURNEY, positions: {}, markers: {} },
  scoreMeters: journeyScore,
  endingFor,
  debrief: DEBRIEF,
});
