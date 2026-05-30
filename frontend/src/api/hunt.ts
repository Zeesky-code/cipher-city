/**
 * API boundary between the frontend and the hunt data source.
 *
 * All functions are async and return typed data. Currently they serve the
 * static Sultanahmet dataset and persist progress to localStorage. When the
 * ADK agent backend is ready, replace the function bodies with fetch() calls
 * to the agent API — the component tree never needs to change.
 *
 * Planned endpoints (Phase 2+):
 *   GET  /api/hunts/:huntId            → Hunt
 *   POST /api/hunts/:huntId/check      → { correct: boolean }
 *   GET  /api/progress/:huntId         → { solved: number }
 *   PUT  /api/progress/:huntId         → void
 */

import type { Hunt } from '../types';
import { sultanahmetHunt } from '../data/sultanahmet';

const REGISTRY: Record<string, Hunt> = {
  sultanahmet: sultanahmetHunt,
};

export async function fetchHunt(huntId: string): Promise<Hunt> {
  // TODO: GET /api/hunts/:huntId
  const hunt = REGISTRY[huntId];
  if (!hunt) throw new Error(`Unknown hunt: ${huntId}`);
  return hunt;
}

export async function checkAnswer(
  huntId: string,
  stopIndex: number,
  answer: string,
): Promise<{ correct: boolean }> {
  // TODO: POST /api/hunts/:huntId/check  { stopIndex, answer }
  const hunt = await fetchHunt(huntId);
  const stop = hunt.stops[stopIndex];
  const normalized = answer.toUpperCase().replace(/[^A-Z]/g, '');
  return { correct: normalized === stop.answer };
}

export async function loadProgress(huntId: string): Promise<number> {
  // TODO: GET /api/progress/:huntId  (Vertex AI Memory Bank)
  try {
    const raw = localStorage.getItem(`cipher_city_${huntId}`);
    return raw ? (JSON.parse(raw) as { solved: number }).solved : 0;
  } catch {
    return 0;
  }
}

export async function saveProgress(huntId: string, solved: number): Promise<void> {
  // TODO: PUT /api/progress/:huntId  (Vertex AI Memory Bank)
  try {
    localStorage.setItem(`cipher_city_${huntId}`, JSON.stringify({ solved }));
  } catch {
    // storage unavailable — progress lost on reload, not fatal
  }
}
