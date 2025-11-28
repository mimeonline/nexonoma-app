# Nexonoma – DATA_MODEL.md (MVP)

Dieses Dokument beschreibt das vereinfachte Datenmodell für den Nexonoma MVP.  
Die vollständigen validierbaren JSON-Schemas befinden sich im Ordner `/schemas`.  
Für den MVP arbeitet das Frontend ausschließlich mit JSON-Dateien im Ordner `content/json`.

---

## 1. Übersicht

Das MVP nutzt drei logische Entitäten:

1. **Cluster**  
   Oberkategorien wie SDLC, Architecture, Organization, AI, Tools.

2. **Segments**  
   Unterbereiche eines Clusters (z. B. Plan, Build, Run oder Concepts, Patterns).

3. **AssetBlocks**  
   Wissenselemente wie Event Storming, C4 Model, CQRS.

Diese drei Ebenen bilden zusammen die Grundlage der Grid View → Matrix View → City View Navigation.

---

## 2. Dateien

Alle Daten liegen im MVP unter:

content/json/
clusters.json
segments.json
items.json

---

## 3. `clusters.json`

Cluster definieren thematische Hauptbereiche.  
Sie referenzieren Segmente über deren IDs.

**Beispielstruktur (vereinfachte Form):**

```json
[
  {
    "id": "sdlc",
    "name": "SDLC",
    "description": "Software Development Lifecycle",
    "segments": ["plan", "build", "run"]
  },
  {
    "id": "architecture",
    "name": "Architecture",
    "description": "Architecture principles & patterns",
    "segments": ["concepts", "patterns", "governance"]
  }
]
```

Felder (MVP):

- id (string)
- name (string)
- description (string)
- segments (array of segment IDs)

Validierung & Details: siehe /schemas/cluster.schema.json.

## 4. segments.json

Segmente repräsentieren Einordnungen innerhalb eines Clusters.
Sie sind eigenständig definierte Entitäten und werden in Clustern verlinkt.

Beispielstruktur:

```json
[
  { "id": "plan", "name": "Plan" },
  { "id": "build", "name": "Build" },
  { "id": "run", "name": "Run" },

  { "id": "concepts", "name": "Concepts" },
  { "id": "patterns", "name": "Patterns" },
  { "id": "governance", "name": "Governance" }
]
````

Felder (MVP):

- id (string)
- name (string)

Validierung: siehe /schemas/segment.schema.json.

## 5. items.json

Items sind die eigentlichen Wissenselemente.
Die City View visualisiert sie.

Beispielstruktur:

```json
[
  {
    "id": "event-storming",
    "title": "Event Storming",
    "cluster": "sdlc",
    "segment": "plan",
    "summary": "Collaborative modeling for domain exploration."
  },
  {
    "id": "c4-model",
    "title": "C4 Model",
    "cluster": "architecture",
    "segment": "concepts",
    "summary": "Visual modeling for software architecture."
  },
  {
    "id": "cqrs",
    "title": "CQRS",
    "cluster": "architecture",
    "segment": "patterns",
    "summary": "Split read & write models for complex domains."
  }
]
```

Felder (MVP):

- id (string)
- title (string)
- cluster (cluster ID)
- segment (segment ID)
- summary (string)

Validierung: siehe /schemas/technology.schema.json, /schemas/method.schema.json, etc.
(MVP erlaubt gemischte Items in einem File; spätere Version trennt nach AssetBlocks.)

## 6. Relationen (MVP)

Relationen werden implizit durch die IDs hergestellt:

- Cluster → Segment: über cluster.segments[]
- Segment → Cluster: über items[].segment
- Item → Cluster: über items[].cluster

Keine explizite relations.json im MVP.

## 7. Regeln für das Datenmodell (MVP)

- IDs sind lowercase-kebab-case
    z. B. event-storming, c4-model
- JSON-Dateien sollen keine unnötigen Felder enthalten
- Jede City View lädt:
→ alle Items, die cluster === X und segment === Y
  - Clusters und Segments müssen zueinander passen
- Items referenzieren nur bestehende IDs
- Keine Duplikate in IDs

## 8. Erweiterbarkeit (Post MVP)

Später kann das Modell erweitert werden um:

- Tags / Kategorien
- Relations (from, to, type)
- Capability-Maps
- Versionierung
- Complexity Levels
- Maturity Levels
- AssetBlocks (nach den JSON-Schemas)
- Neo4j + Graph Queries
- Full Knowledge Graph Explorer

## 9. Verbindung zu den JSON-Schemas

Die MVP-Daten orientieren sich an:

/schemas/
  assetblock-base.schema.json
  assetblock-implementation.schema.json
  cluster.schema.json
  segment.schema.json
  concept.schema.json
  method.schema.json
  role.schema.json
  technology.schema.json
  tool.schema.json

Für das MVP gilt:

- nur kleine Teilmengen werden genutzt
- die vollständigen Schemas sind bereits zukunftssicher
- die MVP-JSONs sollen so simpel wie möglich sein
- beim Umstieg auf Neo4j können alle bestehenden Schemas direkt verwendet werden

## 10. Fazit

Dieses Datenmodell ist:

- minimal
- verständlich
- AI-freundlich
- skalierbar
- kompatibel mit deinen bestehenden Schemas
- perfekt für den MVP und Codex-Iterationen
