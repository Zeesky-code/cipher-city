# Cipher City — project memory for Claude Code

## What this is
A grounded symbology treasure-hunt game (working title: Cipher City; first hunt:
"The Sultanahmet Cipher"). A player walks a real city, and at each real landmark
solves a cipher puzzle whose answer is verifiable on-site. Inspired by Dan Brown
thrillers: the fiction is fun, but every historical fact must be REAL.

The first hunt was hand-authored. The goal of this project is an agent that
*generates* infinite hunts for any city/museum, grounded so it never invents a
fake symbol, date, or monument.

## Architecture
- **frontend/** — React + Vite (or Next). Map, clue cards, cipher inputs,
  geolocation check-in for "boots-on" stop unlocking. Build with the
  `frontend-design` skill. Theme: antique cryptex / illuminated manuscript
  (Cinzel + EB Garamond, oxblood + parchment + gold).
- **agent/** — Google ADK (Agent Development Kit, Python). Generates hunts and
  validates puzzles. Develop and test LOCALLY (`adk run` / dev UI) before any
  cloud deploy.
- **grounding/** — corpus + index for Vertex AI Search / RAG Engine. Sources:
  landmark facts, art history, iconography, cipher references. Every fact in a
  hunt must trace to an indexed source.
- **state** — Vertex AI Agent Engine Sessions + Memory Bank for per-player
  progress (replaces the prototype's in-browser storage).

## Stack & install
- ADK + Vertex SDK: `pip install --upgrade google-cloud-aiplatform[agent_engines,adk]>=1.112`
- gcloud CLI authenticated; Vertex AI API enabled on the project.
- Models: Gemini (latest available) for narrative + puzzle generation.

## CRITICAL — Google Cloud credit protection
There is a fixed ~$1k trial credit on the billing account. It must not be wasted.
- DEFAULT to local development. The ADK agent runs locally for free except model calls.
- Agent Engine runtime BILLS FOR UPTIME. Do NOT deploy to Agent Engine without
  explicit confirmation from me in chat, and always note expected cost first.
- After any demo deploy, REMIND me to tear the runtime down.
- Never leave a managed runtime running idle.
- Assume a GCP budget alert is set; if you touch billing config, confirm it exists.

## Grounding rule (non-negotiable)
The agent must NEVER state a historical fact, date, location, or symbol that is
not retrieved from the grounded corpus. If a fact isn't in the corpus, the agent
either retrieves it via the grounding tool or omits it — it does not improvise.

## Content rules
- Hunts are walkable: stops cluster within sensible walking distance; verify with
  real coordinates.
- Keep content respectful of living cultures and faiths; no disrespect toward
  active places of worship.
- Family-friendly. No content unsuitable for a general audience.

## Build phases
1. Lift the prototype into `frontend/` as a real app (map + clues + state via API).
2. Build the ADK agent locally: hunt generation + puzzle validation (see the
   `hunt-author` skill).
3. Stand up grounding: index a small corpus, wire Vertex AI Search into the agent.
4. Add Sessions/Memory Bank for player progress.
5. Deploy to Agent Engine for a live demo — then tear down.

## Conventions
- Small, reviewable commits. Run tests before committing.
- Secrets in env vars, never committed.
- Ask before installing new cloud services or anything that incurs cost.