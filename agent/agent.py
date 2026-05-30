"""
Cipher City — Hunt Generation Agent  (Phase 2 stub)

Run locally:  adk run agent.py
Dev UI:       adk web

This file is a stub. Phase 2 will implement:
  - hunt_generator: given a city/museum, produce a grounded Hunt schema
  - puzzle_validator: verify every fact against the grounding corpus
  - answer_checker: expose check_answer for the frontend API

All historical facts MUST be retrieved via the grounding tool (Vertex AI Search).
The agent must never invent a date, name, or symbol not present in the corpus.
See grounding/ for the corpus sources.
"""

import os
from google.adk.agents import Agent  # type: ignore

# Load env (GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, etc.)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GEMINI_MODEL = os.environ.get("CIPHER_CITY_MODEL", "gemini-2.0-flash-001")

root_agent = Agent(
    name="cipher_city_hunt_generator",
    model=GEMINI_MODEL,
    description="Generates grounded symbology treasure hunts for walkable city areas.",
    instruction=(
        "You are the Cipher City hunt generator. "
        "You MUST retrieve every historical fact from the grounding tool before including it. "
        "Never invent or assume a date, monument name, symbol, or location. "
        "If a fact cannot be retrieved, omit it."
    ),
    tools=[],  # Phase 2: add grounding + validation tools here
)
