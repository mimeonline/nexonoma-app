# Nexonoma App – MVP

Nexonoma ist eine visuelle Navigationsplattform für Software-, Architektur- und Organisationswissen.  
Dieses Repository enthält die **MVP-Version** der Nexonoma App – gebaut mit Next.js, TailwindCSS und shadcn/ui.

Ziel: ein funktionierender Prototyp, der aufzeigt, wie Cluster, Segmente und Wissens-Items visuell erfahrbar werden.

---

## 🚀 Features (MVP)

- Landing Page  
- Grid View (Cluster als Cards)  
- Matrix View (Cluster × Segmente)  
- City View (Items in Stadt-/Block-Layout)  
- Daten aus JSON-Dateien  
- Marineblauer Nexonoma-Look (#0B1220)

---

## 📁 Projektstruktur

```text
nexonoma-app/
│
├── apps
│ ├── frontend/ # Next.js App
│ ├── api/ # (später) API + Services
│ └── db/ # (später) Neo4j / SQLite
│
├── content
│ └── json/ # clusters.json, segments.json, items.json
│
├── schemas/ # JSON Schemas (AssetBlocks, Cluster usw.)
│
├── docs/
│ ├── PROJECT.md
│ ├── PRD-MVP.md
│ ├── DESIGN_GUIDE.md
│ ├── DATA_MODEL.md
│ └── adr/ # Architecture Decision Records
│
├── infra/
│ ├── docker/
│ ├── traefik/
│ └── scripts/
│
└── README.md
````

---

## 🧩 Datenquellen

Alle Daten liegen im Ordner:
content/json/

Beispieldateien:

- `clusters.json`
- `segments.json`
- `items.json`

Strukturen siehe → `docs/DATA_MODEL.md`.

---

## 🛠️ Tech Stack

- Next.js 16  
- React Server Components  
- TailwindCSS  
- shadcn/ui  
- JSON als Datenlayer  
- optional: Neo4j (später)  

---

## 🧪 Entwicklung

Dev-Server starten:

```bash
cd apps/frontend
npm install
npm run dev
````

Frontend erreichbar unter:
<http://localhost:3000>

## 🤖 Entwicklung mit Codex

Die Datei AGENTS.md beschreibt:

- wie Codex CLI eingesetzt wird
- wie Prompts strukturiert werden sollen
- welche Dateien nie verändert werden dürfen
- welche Schritte empfohlen sind

Bitte beachten:

- Iteratives Vorgehen
- Jede Page separat generieren
- Niemals One-Shot Projektgenerierung

## 📦 Deployment

Zwei Wege möglich:

- Vercel (empfohlen für MVP)
- IONOS Deploy Now

Build-Command für Next.js:

npm run build

## 📄 Lizenzen & Rechte

Die Nexonoma-Codebasis und Schemadefinitionen werden unter der MIT-Lizenz veröffentlicht.

Alle *Inhalte*, einschließlich Beschreibungen, Beispiele, Anwendungsfälle,
Langtexte, relationale Interpretationen und Domänenmodelle, unterliegen der Lizenz
CC BY-NC 4.0 und dürfen NICHT für kommerzielle Zwecke verwendet werden.

Premium-Module und Knowledge Packs sind urheberrechtlich geschützt und nicht Teil dieses Repositorys.

## 📬 Feedback

Feedback, Issues und Vorschläge sind willkommen.
Wenn das Repository später public wird, werden GitHub Issues aktiviert.

## 🗺️ Roadmap (0.1 → 0.3)

0.1

- Landing Page
- Grid View
- Matrix View

0.2

- City View
- Verbesserte Daten

0.3

- Search
- Filters

Neo4j-Integration (optional)
