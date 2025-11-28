# Nexonoma App – ARCHITECTURE.md

Dieses Dokument beschreibt die Architektur des Nexonoma App MVP.  
Ziel ist eine klare, verständliche Struktur, die das schnelle iterative Arbeiten (Codex, Multi-Agent, VS Code Plugin) ermöglicht und eine robuste Grundlage für spätere Erweiterungen bietet.

---

## 1. Architekturziele

- **Schneller MVP** mit klarer Trennung von Frontend, Daten und Infrastruktur.
- **AI-friendly Codebase**: verständlich, konsistent, vorhersehbar für Codex.
- **Skalierbar**: MVP startet mit JSON → später Neo4j + API.
- **Visuell fokussiert**: Grid, Matrix, City Views.
- **Portabel**: läuft lokal & auf Vercel/IONOS.

---

## 2. High-Level Architekturübersicht

           ┌───────────────────────────────┐
           │        Nexonoma App           │
           │         (Next.js 16)          │
           └───────────────────────────────┘
                            │
                            ▼
    ┌──────────────────────────────────────────────┐
    │                 Data Access                  │
    │                (JSON Loader)                 │
    │ loads /content/json/*.json on request        │
    └──────────────────────────────────────────────┘
                            │
                            ▼
    ┌──────────────────────────────────────────────┐
    │                Presentation Layer            │
    ├──────────────────────────────────────────────┤
    │ Landing Page  → Intro, Navigation            │
    │ Grid View      → Cluster Cards               │
    │ Matrix View    → Cluster × Segmente          │
    │ City View      → Items im Stadt-/Blocklayout │
    └──────────────────────────────────────────────┘
                            │
                            ▼
    ┌──────────────────────────────────────────────┐
    │              Component Layer                 │
    │ (shadcn/ui, Tailwind Components, Layouts)    │
    └──────────────────────────────────────────────┘
                            │
                            ▼
    ┌──────────────────────────────────────────────┐
    │                Styling Layer                 │
    │         TailwindCSS + Design Guide           │
    └──────────────────────────────────────────────┘

---

## 3. Technologiestack (MVP)

### Frontend

- **Next.js 16**
- **React Server Components**
- **TailwindCSS**
- **shadcn/ui**

### Daten

- JSON-Dateien in `content/json`
- Kein Backend, keine API

### Infrastruktur

- Deployment: **Vercel** (oder IONOS Deploy Now)
- Optional: Docker-Setup im Ordner `infra/`

### Tools

- Codex CLI (generieren)
- VS Code Codex Plugin (iterieren)
- GitHub (Versionierung)

---

## 4. Verzeichnisstruktur (relevant für Architektur)

    nexonoma-app/
    │
    ├── apps
    │ ├── frontend/ # Next.js App – Haupteinstiegspunkt
    │ ├── api/ # spätere API (leer im MVP)
    │ └── db/ # Neo4j-Skripte/Doku (später)
    │
    ├── content
    │ └── json/ # Datenquellen für das UI
    │ ├── clusters.json
    │ ├── segments.json
    │ └── items.json
    │
    ├── schemas/ # Vollständige JSON Schemas
    │
    ├── docs/ # Projekt- & Systemdokumentation
    │ ├── PROJECT.md
    │ ├── PRD-MVP.md
    │ ├── DESIGN_GUIDE.md
    │ ├── DATA_MODEL.md
    │ └── ARCHITECTURE.md
    │
    └── infra/ # Docker / Traefik / Deployment

---

## 5. Datenfluss (MVP)

### 5.1 Laden der Daten

Die JSON-Daten werden **serverseitig** in den RSC-Komponenten geladen:

    import clusters from "@/content/json/clusters.json";
    import segments from "@/content/json/segments.json";
    import items from "@/content/json/items.json";

Diese Daten stehen dann direkt serverseitig für die Views zur Verfügung.

### 5.2 Verarbeitung

- **Grid View**: zeigt alle Cluster
- **Matrix View**: nutzt Cluster + Segmente
- **City View**: filtert Items nach `cluster` + `segment`

### 5.3 Später (nach MVP)

- Zugriff über /api Endpoints
- Graph Queries via Neo4j Aura/Local
- Caching
- Query Layer (GraphQL oder REST)

---

## 6. Präsentationsschicht (UI Layer)

### 6.1 Landing Page

- Einführung
- Navigation zu „Explore“

### 6.2 Grid View

- 3–4 Spalten
- shadcn Cards
- Cluster-Bilder optional
- Navigation → Matrix View

### 6.3 Matrix View

- Tabelle (shadcn Table)
- Zeilen = Cluster
- Spalten = Segmente
- Klick öffnet City View

### 6.4 City View

- Box-Stadtlayout (simple)
- Items = Häuser
- Einheitliche, wiederverwendbare Komponenten

---

## 7. Komponenten-Schicht

Wiederverwendbare UI-Komponenten liegen in:

    apps/frontend/components/
    ui/ ← shadcn imports
    grid/
    matrix/
    city/

Komponenten sollen:

- simpel sein
- rein visuell
- ohne Businesslogik
- Tailwind verwenden
- serverseitig gerendert werden

---

# 8. Design Layer

Gesteuert durch:

- `DESIGN_GUIDE.md`
- TailwindCSS
- shadcn/ui

Wichtige Regeln:

- Farbschema: Marineblau (#0B1220) + Akzent-Cyan (#4FF4E0)
- Keine Inline-Styles
- Keine spontane „Änderung des Design-Looks“
- Komponenten konsistent halten

---

## 9. Erweiterbarkeit für Version 0.2–0.3

### 9.1 Backend/API

- Next.js API Routes
- Node/Express Backend
- GraphQL

### 9.2 Echtes Datenmodell

- Neo4j Integration
- automatische Imports aus deinem PoC-Repo
- Knowledge Graph

### 9.3 Vollständiger Map Explorer

- Graph-basierte Visualisierung
- Pfade zwischen Items
- Relationstypen

### 9.4 User Features

- Suche
- Filter
- Personalisierung

---

## 10. Prinzipien & Entscheidungen (ADR-Level kompakt)

- **Frontend-first**: schneller Feedbackzyklus
- **JSON-first**: Minimale Komplexität
- **Server Components**: optimiert Rendering
- **Tailwind statt SCSS**: KI-Kompatibilität
- **Keine One-Shot Generierung**: kontrollierte Codex-Entwicklung
- **Design Guide als Single Source of Truth**
- **Komponentenring**: grid/matrix/city Layouts klar getrennt

---

## 11. Fazit

Die Nexonoma MVP-Architektur ist:

- **leichtgewichtig**
- **AI-freundlich**
- **klar getrennt**
- **visuell strukturiert**
- **perfekt erweiterbar**

Sie bildet eine solide Basis für die spätere Wissensgraph-Architektur mit Neo4j, ohne die Entwicklungszeit des MVP unnötig zu verlängern.
