# 🚀 Nexonoma Monorepo

Die visuelle Navigationsplattform für Software-, Architektur- und Organisationswissen

Dieses Repository enthält das gesamte Nexonoma-System – Frontend, API, Domain-Schemas und geteilte Typbibliotheken.
Das Ziel: Ein typsicheres, erweiterbares, modular aufgebautes Wissenssystem, das Cluster, Segmente und Content-Bausteine (Concepts, Methods, Tools, Technologies) in mehreren Views erlebbar macht.

## 📁 Monorepo-Struktur (pnpm Workspaces)

```text
nexonoma/
│
├── apps/
│   ├── frontend/         # Next.js 16 · React 19 · Tailwind 4 · shadcn/ui
│   └── api/              # NestJS 11 · REST API · Neo4j Driver (optional)
│
├── packages/
│   ├── nexonoma-types/   # TypeScript Domain Types (AssetBlocks, Relations, etc.)
│   └── nexonoma-schema/  # JSON Schemas als Source of Truth
│
├── content/
│   └── json/             # Domainspezifische Daten (gelegt nach Schema)
│
└── docs/                 # Projektunterlagen (PRD, Architektur, Patterns, ADRs)
````

Philosophie:

> „Datenmodell im Paket, Content im Workspace, Views im Frontend, Logik im Backend.“

## 🧠 Domänenmodell

Nexonoma basiert auf dem **AssetBlock-Modell**, bestehend aus:

- **MacroCluster** (oberste Ebene)
- **Cluster**
- **Segment**
- **ContentBlock**  
    → unterteilt in _Concept · Method · Tool · Technology_

Dazu kommen typisierte **Relations**:

- Structure
- Process
- Content
- Dependency

**Alle Modelle werden zentral in `nexonoma-schema` definiert und über `nexonoma-types` als TypeScript-Typen konsumiert.**

## 🎨 Features & Views (Frontend)

Das Frontend bildet Wissen in verschiedenen Navigationsmustern ab:

### ▣ Grid View

Visualisiert MacroCluster und Cluster in modularen Cards.

### ╳ Matrix View

Verknüpft Cluster × Segmente über ein zweidimensionales Raster.

### 🏙 City View

Gamifizierte Stadtmetapher: Segmente → Blocks → Content.

### 🔍 Content Detail View

Strukturierter „Bento“-Aufbau zur Darstellung eines einzelnen Wissens-Bausteins.

### 🧭 Semantic Navigation

Traversal über Relations: „Explore how things connect“.

## 🔧 API-Backend (NestJS)

Die API liefert strukturierte Daten für die Views:

- `/api/macroClusters`
- `/api/clusters/:slug`
- `/api/segments/:slug/tree`
- `/api/content/:type/:slug`

**Backend-Philosophie:**

- strikte Trennung zwischen **DTO**, **Domain Types**, **Persistence**
- OpenAPI-Generierung via Swagger
- optionale Neo4j-Persistenz

## 📦 Installation & Entwicklung

### 1️⃣ Install mit pnpm

```bash
pnpm install
```

### 2️⃣ Frontend starten

```bash
pnpm --filter frontend dev
```

Frontend:
👉 <http://localhost:3000/>

### 3️⃣ API starten

```bash
pnpm --filter api start:dev
```

API:
👉 <http://localhost:3001/>

## Tests & Qualität

- Frontend: `pnpm --filter frontend lint` für ESLint.
- API: `pnpm --filter api lint` sowie `pnpm --filter api test` für Jest.

## 🔐 Lizenzierung & Schutz

|Bereich|Lizenz|Kommentar|
|---|---|---|
|**Code (Repo)**|MIT|öffentlich nutzbar, Forks erlaubt|
|**Schemas**|MIT|sollen verbreitet & genutzt werden|
|**Content (JSON)**|**CC BY-NC 4.0**|nicht kommerziell verwertbar|
|**Premium-Module**|proprietär|nicht im Repo enthalten|

## 🧭 Roadmap

### 0.1 – In Progress

✔ Grid View  
✔ Catalog View
✔ Content Detail  
✔ Domain Types  
✔ pnpm Monorepo  
⭑ Erste API Endpunkte
⭑ Neo4j Integration  

### 0.2 – Planned

⭑ Matrix View  
⭑ City View  
⭑ Semantic Explorer  
⭑ API Tree Endpunkte

### 0.3 – Planned

⭑ Search & Filters  
⭑ Agent-gestützte Content-Generation  
⭑ Public Demo Deployment

## 🤝 Contributing / Agent Usage

Für KI-gestützte Entwicklung siehe:

`AGENTS.md`

Dort steht:

- welche Dateien KI **niemals** anfassen darf
- wie Codex Prompts aussehen sollen
- wie Views generiert werden sollen
- wie du agentisch neue Content-Bausteine erzeugst

---

## 📬 Feedback & Support

Issues, Fragen und Feedback willkommen!  
Nexonoma wächst iterativ – jede Erkenntnis fließt zurück ins Modell.
