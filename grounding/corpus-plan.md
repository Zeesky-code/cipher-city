# Grounding Corpus — Phase 3 Plan

Every fact the agent generates must trace to a document in this corpus.
The corpus is indexed in Vertex AI Search (RAG Engine).

## Planned source types

- **Landmark fact sheets** — one JSON file per landmark:
  `sources/<city>/<slug>.json`
  Fields: `name`, `coordinates`, `facts[]`, `symbols[]`, `dates[]`, `sources[]`

- **Cipher reference** — `sources/ciphers.json`
  Catalogue of classical ciphers (Caesar, Atbash, A1Z26, etc.) with worked examples.

- **Iconography index** — `sources/iconography.json`
  Symbols found in real monuments with their documented meanings and provenance.

## Sultanahmet seed documents (to be created in Phase 3)

| Slug | Landmark |
|------|----------|
| `istanbul/obelisk-of-theodosius` | The Obelisk of Theodosius |
| `istanbul/serpent-column` | The Serpent Column |
| `istanbul/blue-mosque` | The Blue Mosque (Sultan Ahmed Mosque) |
| `istanbul/basilica-cistern` | The Basilica Cistern (Yerebatan Sarnıcı) |
| `istanbul/hagia-sophia` | Hagia Sophia |

## Index setup (Phase 3)

```bash
# Create a Vertex AI Search data store
gcloud alpha discovery-engine datastores create \
  --project=$GOOGLE_CLOUD_PROJECT \
  --location=global \
  --display-name="cipher-city-corpus" \
  --solution-type=SOLUTION_TYPE_SEARCH \
  --content-config=CONTENT_REQUIRED

# Import corpus documents
# (see Vertex AI Search docs for GCS import)
```

**Cost note:** Vertex AI Search charges per query and per indexed GB.
Index only what is needed for the active hunt set.
