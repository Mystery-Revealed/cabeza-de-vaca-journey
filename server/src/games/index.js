// games/index.js — registry of playable games. GameManager looks games up here,
// keeping the engine reusable for future Texas History units.

import cabezaDeVaca from './cabezaDeVaca.js';

export const GAMES = {
  [cabezaDeVaca.id]: cabezaDeVaca,
};

export function getGame(id) {
  return GAMES[id] || null;
}
