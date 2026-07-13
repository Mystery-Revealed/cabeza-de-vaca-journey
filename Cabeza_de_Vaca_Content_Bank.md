# Cabeza de Vaca's Journey — Content Bank (Fable draft)
### All student-facing copy for the adapter. 5th-grade reading level. Meters: Health ❤️ · Standing 🤝 · Hope 🌅 (all start at 50).

**Structure notes for the build:** Solo journey, one class-wide group. 6 chapters × 2 decisions = 12 graded actions. Each decision has 3 choices: ✅ right (1 pt), ⚠️ partial (0.5), ❌ wrong (0). Choice order is shuffled per match. Event cards may carry a one-time meter toll (`eventEffects`), same as Claim the Land. Health at 0 = journey ends early ("Lost to the Island" collapse variant).

---

## Meters (blurbs for the UI)

| Meter | Icon | Blurb |
|---|---|---|
| Health | ❤️ | Your body. Hunger, cold, and sickness drain it. At 0, your journey ends. |
| Standing | 🤝 | Trust with the peoples you live among. It is the only power you have. |
| Hope | 🌅 | The fire inside that keeps you walking toward home. |

## Title screen

**Title:** Cabeza de Vaca's Journey
**Subtitle:** Eight years. Four survivors. One long walk home.
**Intro:** November, 1528. Your raft breaks apart in the cold surf off a Texas island. You are Álvar Núñez Cabeza de Vaca. You have no food, no weapons — not even shoes. Ninety castaways made it this far. Almost none will make it home. To survive, you must do something no conqueror planned to do: listen, learn, and depend on the peoples of this land.

---

## Chapter 1 — Malhado, the Island of Misfortune (November 1528)

**Event:** Your raft breaks apart in the November surf. You crawl onto a cold, gray island — you will come to call it Malhado, the Island of Misfortune. Local people find your freezing party on the beach. They are strong and healthy in a land that is starving you. They look at you with wonder — and with pity.

**Decision 1 — The people offer help.**
*Prompt:* The islanders offer food, fire, and shelter. What do you do?
- ✅ **Accept their help humbly — food, fire, shelter.** `{ health:+15, standing:+10 }`
  *"They wept at the castaways' suffering and shared what they had. Pride would have been a grave."*
- ⚠️ **Accept, but keep your group apart and guarded.** `{ health:+5, standing:-5 }`
  *"Warmth with walls. You'll need these people far more than they need you."*
- ❌ **Demand help in the name of Spain.** `{ standing:-15 }`
  *"You are a starving stranger with no shoes. Spain is very far away."*

**Decision 2 — Winter deepens.**
*Prompt:* Winter deepens. Food is scarce for everyone — the islanders too. How do you get through it?
- ✅ **Work as the band works — dig roots, haul wood, earn your keep.** `{ standing:+10, health:+5 }`
  *"You learn the first rule of this land: everyone works, or everyone starves. Earning your keep earns respect."*
- ⚠️ **Trade away your last Spanish goods for food.** `{ hope:+5 }`
  *"It buys a few meals. But goods run out. Work and trust do not."*
- ❌ **Steal from the winter stores.** `{ standing:-15 }`
  *"Stealing from hungry people who saved your life? If they cast you out, the winter will finish you."*

---

## Chapter 2 — The Hard Years (1529–1532)

**Event toll:** `{ health:-10, hope:-10 }`
**Event:** The years that follow are the hardest of your life. Sickness takes most of the castaways. You live as a servant among hard-pressed peoples — hauling wood, digging roots until your fingers bleed. The work is brutal, and you are often hungry. But you are alive. And every day, this land is teaching — if you are willing to learn. (Health −10, Hope −10)

**Decision 1 — Surviving servitude.**
*Prompt:* The labor is endless and you are treated as the lowest of the band. What keeps you alive?
- ✅ **Endure, watch, and learn the language word by word.** `{ standing:+10, hope:+5 }`
  *"Survival here is learning. Every word you learn turns a stranger into someone you can talk to."*
- ⚠️ **Keep your head down and just get through each day.** `{ health:+5 }`
  *"You survive — but only barely. The ones who lasted did more than endure. They learned."*
- ❌ **Run for the mainland alone, with no plan.** `{ health:-15, hope:-5 }`
  *"Alone, with no food, no map, and no friends? The land is not the enemy — but it does not forgive."*

**Decision 2 — Learning the land.**
*Prompt:* The seasons turn. The people move camp to follow the food. How do you eat?
- ✅ **Learn what the people eat and when — roots, pecans, prickly pear — and follow their year.** `{ health:+10, standing:+5 }`
  *"The land is a calendar, and the people can read it. Pecan groves in fall, prickly pear in summer. Now you can read it too."*
- ⚠️ **Eat what you're given, but never learn to find it yourself.** `{ health:+5, hope:-5 }`
  *"A guest who never learns stays helpless. You want to be useful — useful people are kept alive."*
- ❌ **Hold out for Spanish food — bread, meat, wine.** `{ health:-10 }`
  *"There is no Spanish food for six hundred miles. Hunger is a poor teacher, but an honest one."*

---

## Chapter 3 — The Trader (1530s)

**Event:** You see something no one else sees. The coastal peoples have shells and sea beans. The inland peoples have hides and red ochre. They want each other's goods — but old conflicts make the road between them dangerous. A stranger who belongs to no band could walk that road. Someone like you.

**Decision 1 — A niche opens.**
*Prompt:* You could become a trader between the coast and the inland country. What do you do?
- ✅ **Carry shells inland and hides back — become useful between peoples.** `{ standing:+15, hope:+5 }`
  *"This is your true story. As a trader you walked free, welcomed on every side, because everyone needed what you carried."*
- ⚠️ **Trade, but only close to camp where it feels safe.** `{ standing:+5 }`
  *"Safe, but small. The real prize was the long road — it made you known far inland, and that fame will matter later."*
- ❌ **Hoard the best goods to buy your own escape someday.** `{ standing:-10 }`
  *"Word travels faster than you do. A trader no one trusts is just a man walking alone with a full pack."*

**Decision 2 — Between peoples.**
*Prompt:* Two bands you trade with have an old grudge. Each wants you to favor them. What is your rule?
- ✅ **Deal fairly with every band, and carry no side's quarrel.** `{ standing:+10, hope:+5 }`
  *"Fair and neutral — that is why your road stayed open. You became the one man welcome in every camp."*
- ⚠️ **Quietly favor the band that feeds you best.** `{ standing:-5, health:+5 }`
  *"A full belly today, a closed road tomorrow. Grudges stick to those who pick sides."*
- ❌ **Play the bands against each other for better prices.** `{ standing:-15 }`
  *"Games like that get traders killed. Your only armor on this road is trust."*

---

## Chapter 4 — The Escape West (1534)

**Event:** At a prickly pear harvest, you find them: **Estevanico**, Dorantes, and Castillo — the last other survivors of the ninety. Estevanico is an enslaved man, born in Morocco, and he has a gift you will come to depend on: languages and signs seem to open before him. The four of you whisper a plan. West. Together. Toward Mexico — however far that is.

**Decision 1 — The break.**
*Prompt:* The harvest gathering is the one time of year you four are in the same place. How do you escape?
- ✅ **Go together — four survivors, one plan, one chance a year.** `{ hope:+15, standing:+5 }`
  *"Together. That is how it really happened — and it is the only way any of you make it. Four know more than one."*
- ⚠️ **Send one man ahead alone to scout the way.** `{ hope:+5, health:-5 }`
  *"Splitting up in this country loses people. The gathering comes once a year — a scout who vanishes costs you everything."*
- ❌ **Wait another year. It never feels safe enough.** `{ hope:-15 }`
  *"You have waited six years already. Some doors open once. Hope dies of waiting."*

**Decision 2 — Who leads the way?**
*Prompt:* Ahead lie lands and languages none of you know. Whose gifts lead the way?
- ✅ **Follow Estevanico's lead — his gift for languages opens village after village.** `{ standing:+10, hope:+5 }`
  *"Name him and give him his due: Estevanico, enslaved and unfree, became one of the great explorers of this continent. He went first into nearly every new village."*
- ⚠️ **Lead yourself, as the ranking Spaniard, and use his gifts only when stuck.** `{ standing:+5, hope:-5 }`
  *"Rank means nothing out here. The four of you lived because you used every gift you had — and his was the greatest."*
- ❌ **Avoid all villages and slip west unseen.** `{ health:-10, hope:-5 }`
  *"There is no unseen. The villages are the food, the water, the guides. Hiding from the people means starving in the dark."*

---

## Chapter 5 — The Healer's Road (1535)

**Event toll:** `{ health:-5 }`
**Event:** Word runs ahead of you on the road west. A man was sick; you knelt, prayed, breathed a blessing — and he got better. Now every village brings you their sick. They call you healers. Crowds gather at each stop, and the road is long, and you are so tired. (Health −5)

**Decision 1 — The sick are brought to you.**
*Prompt:* A village brings you a man burning with fever. All eyes are on you. What do you do?
- ✅ **Treat him humbly — pray with the people, in their way and yours, and take no payment but food.** `{ standing:+15, hope:+5 }`
  *"This is the voice of your real account: humble hands, shared faith, no payment but a meal. The people's own belief did work no medicine could."*
- ⚠️ **Refuse — you are no doctor, and you fear doing harm.** `{ standing:-5, hope:-5 }`
  *"Honest — but refusing a gift of trust is its own wound here. They did not ask you to be a doctor. They asked you to care."*
- ❌ **Act the great magician, and demand gifts for your power.** `{ standing:-15 }`
  *"The moment you charge for mercy, you become a fraud. And frauds are found out on a road this long."*

**Decision 2 — Thousands walk with you.**
*Prompt:* Now thousands escort you from village to village, singing. Each village loads you with gifts. What do you do with the honor?
- ✅ **Credit the people's own faith, and pass the gifts on to each new village's guides.** `{ standing:+10, hope:+10 }`
  *"The gifts flowed through you, not to you — and the escort grew at every stop. Humility, it turns out, travels well."*
- ⚠️ **Accept it all quietly and keep the gifts for the road ahead.** `{ health:+5, standing:-5 }`
  *"Supplies help. But hoarding honor makes it curdle. The road runs on generosity."*
- ❌ **Use your fame to command the crowds like a lord.** `{ standing:-15, hope:-5 }`
  *"They walk with you out of love and wonder, not fear. Command them, and watch the road empty."*

---

## Chapter 6 — The Slavers (1536)

**Event:** Eight years. Six hundred leagues. And then, near the western coast, you see them: men on horses, armored, speaking Spanish. Your own people — at last. But your joy curdles fast. These men are slave hunters. They look at the Native families walking beside you — the people who fed you, healed with you, carried you home — and they see prey.

**Decision 1 — Your countrymen, their hunters.**
*Prompt:* The slavers move toward your escorts. What do you do?
- ✅ **Stand between the slavers and the people who carried you.** `{ standing:+15, hope:+10 }`
  *"You did. It is one of the most remarkable moments in Texas history: the rescued explorer defending his Native friends from his own countrymen."*
- ⚠️ **Bargain quietly — you win a delay, but you don't stop them.** `{ standing:-5 }`
  *"Half a shield is not a shield. Your real stand was louder than this — and it cost you with the slavers, and you paid it."*
- ❌ **Rejoin your countrymen and hand over your guides.** `{ standing:-20, hope:-10 }`
  *"After eight years — after everything these people gave you? Some choices unmake a man. This was never yours."*

**Decision 2 — The report.**
*Prompt:* Home at last, you must write your report to the King — *La Relación*, the first European book about Texas. What do you write?
- ✅ **The truth: a land rich in peoples, not gold — and an argument that they be treated with kindness.** `{ hope:+15, standing:+5 }`
  *"You wrote it: to bring these people to Spain's friendship, 'they must be won by kindness, the only certain way.' Few conquerors ever wrote a sentence like that."*
- ⚠️ **Mostly truth — but you let hints of golden cities glitter between the lines.** `{ hope:+5, standing:-5 }`
  *"Careful. Garbled retellings of your journey will feed the Cities of Gold rumors either way — but a report that winks at gold sends armies."*
- ❌ **Say little. You just want to forget Texas.** `{ hope:-10 }`
  *"Then the only stories told will be the wrong ones. You carried eight years of truth home. Spend it."*

---

## Endings (sum of the three meters; max 300, start 150)

| Tier | Threshold (suggested) | Title | Text |
|---|---|---|---|
| High | sum ≥ 220 | **The Long Walk Home** | Eight years after the wreck, you walk into Mexico City — alive, changed, and carrying a story no one expected: the explorer who survived by learning, trading, healing, and trusting the peoples of Texas. Of ninety castaways, four made it. You made it your way — their way. |
| Mid | sum ≥ 150 | **Survivor of Malhado** | You survive the island, the hard years, and the long road — but only just. You reach Mexico worn thin, with fewer friends on the road behind you. You made it home. The land and its peoples carried more of you than you let them. |
| Low | sum < 150 | **Lost to the Island** | The journey breaks you before Mexico ever appears. Most of the ninety castaways were lost this way — to cold, to hunger, to pride. In this land, the ones who survived were the ones who learned to depend on its peoples. |
| Collapse | health = 0 (early end) | **Lost to the Island** | Your strength gives out, far from home. Texas in 1530 spared almost no one — of ninety castaways, only four ever saw Mexico. They survived by earning trust, learning the land, and walking together. |

## Debrief (shown with every ending)

**What really happened:** Cabeza de Vaca survived eight years in Texas (1528–1536) — castaway, servant, trader, and healer — by learning from and depending on Native peoples. Of about ninety castaways, four survived: Cabeza de Vaca, Dorantes, Castillo, and **Estevanico**, the enslaved Moroccan-born man whose gift for languages helped lead them all home. Cabeza de Vaca's book about the journey, *La Relación*, described Texas's lands and peoples for the first time in a European book — and argued they should be treated with kindness. But garbled retellings of his story fed rumors of golden cities. Those rumors launched Coronado and the next wave of expeditions. One journey, two legacies: an argument for humanity, and an accidental spark for conquest. (TEKS 7.2B — cause and effect.)

## Meter-note for teachers (Command Center footer)
One class-wide group ("The Castaways"). Accuracy = correct historical choices out of 12. PDF footer: TEKS 7.2B, 7.2A.

---
### Copy checklist (Fable phase)
- [x] All sentences ≤ ~20 words; hard terms defined on first use (Malhado, La Relación)
- [x] Native peoples are rescuers, teachers, hosts with agency; hardship years told without villainizing ("hard-pressed peoples")
- [x] Estevanico named and honored (Ch4, debrief)
- [x] Slaver scene kept as the moral spine, headline level, no gore
- [x] Double legacy (kindness argument + gold rumors) closes the debrief
