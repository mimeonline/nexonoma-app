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

Für das MVP liegen **keine einzelnen großen JSON-Dateien** wie `clusters.json`, `segments.json` oder `items.json` vor.

Stattdessen existiert folgende Struktur:

```text
  content/json/
  clusters/.json
  segments/.json
  concepts/.json
  methods/.json
  technologies/.json
  tools/.json
  roles/*.json
````

Jede Datei ist ein **vollständiger AssetBlock**, validiert von einem der vorhandenen Schemas.

---

## 3. Cluster (`content/json/clusters/...`)

Cluster definieren thematische Hauptbereiche.

Eine Datei entspricht **einem Cluster**.

MVP-relevante Felder:

- `id` (string)
- `name` (string)
- `slug` (string)
- `type` = "cluster"
- `segments` (array von Segment-IDs)

Beispiel:

```json
{
  "id": "software-architecture",
  "name": "Software Architecture",
  "slug": "software-architecture",
  "type": "cluster",
  "segments": ["design", "development", "operations"]
}
````

Validierung & Details: siehe /schemas/cluster.schema.json.

## 4. Segmente (content/json/segments/...)

Segmente repräsentieren Unterbereiche eines Clusters.

MVP-relevante Felder:

- id
- name
- slug
- type = "segment"

Beispiel:

```json
{
  "id": "design",
  "name": "Design",
  "slug": "design",
  "type": "segment"
}
```

Validierung: /schemas/segment.schema.json.

## 5. AssetBlocks (Items)

AssetBlocks sind konkrete Wissenselemente, z. B.:

- Event Storming
- C4 Model
- CQRS
- Microservices
- Kanban
- Kafka
- Terraform
- etc.

Sie liegen in:

```text
content/json/concepts/
content/json/methods/
content/json/technologies/
content/json/tools/
content/json/roles/
```

Ein AssetBlock enthält sehr viele Felder, aber das MVP nutzt nur eine minimale Teilmenge:

MVP-relevante Felder:

- id (UUID)
- name
- slug
- type
- cluster
- segment
- shortDescription (optional)

Alles weitere (useCases, relations, metrics etc.) bleibt für spätere Releases bestehen.

Beispiel (gekürzt):

```json
{
  "id": "b2e3b1a4-62b8-4dbf-bde1-ff3f0c3f7f9c",
  "name": "12-Factor App",
  "slug": "12-factor-app",
  "type": "concept",
  "cluster": "software-architecture",
  "segment": "development",
  "shortDescription": "Ein Methodenset für moderne SaaS-Anwendungen."
}
```

## 6. Relationen (MVP)

Es gibt keine eigene relations.json.
Relationen entstehen implizit:

- Cluster ↔ Segmente: über cluster.segments[]
- Items → Cluster: über item.cluster
- Items → Segment: über item.segment

Das MVP nutzt ausschließlich diese Basis-Relationen.

## 7. Regeln für das Datenmodell (MVP)

- IDs sind lowercase-kebab-case
- JSON-Dateien sollen so klein wie möglich bleiben
- Jede City View lädt ausschließlich:
  - Items, deren cluster === X
  - und deren segment === Y
- Items dürfen nur gültige IDs referenzieren
- Keine Duplikate
-

 Keine circular dependencies im MVP

## 8. Erweiterbarkeit (Post MVP)

Zukünftige Features basieren auf deinen vorhandenen Schemas:

- Tags / Kategorien
- Relations (Nodes + Edges)
- Capability Mapping
- Versionierung
- Complexity & Maturity Levels
- AssetBlock Full Model (alle Felder)
- Graph Queries in Neo4j
- Vollständiger Knowledge Graph Explorer
- Empfehlungssystem (Graph Embeddings)
- Navigation Context Maps (hierarchisch + lateral)

## 9. Verbindung zu den JSON-Schemas

Die folgenden Schemas definieren langfristig das vollständige Datenmodell:

```text
schemas/
  assetblock-base.schema.json
  assetblock-implementation.schema.json
  cluster.schema.json
  segment.schema.json
  concept.schema.json
  method.schema.json
  role.schema.json
  technology.schema.json
  tool.schema.json
````

Für die MVP-Implementierung gilt:

- nur Kernfelder werden genutzt
- Daten bleiben bewusst flach
- Schemas sorgen für Zukunftssicherheit
- Neo4j kann später alle Daten direkt übernehmen

## 10. Fazit

Das MVP-Datenmodell ist:

- minimal
- verständlich
- KI-freundlich
- leicht erweiterbar
- kompatibel mit Neo4j
- perfekt für iteratives Bauen mit Codex

Es bildet den optimalen Kompromiss aus Einfachheit für den Start und Skalierbarkeit für die Vision von Nexonoma.
