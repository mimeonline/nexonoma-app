# Nexonoma App – PRD-MVP

## 1. Zweck

Dieses Dokument definiert das Verhalten und die Inhalte des Nexonoma MVP.  
Ziel: eine funktionierende, visuelle Navigationsoberfläche mit minimalem, aber repräsentativem Wissensmodell.

---

## 2. User Story

Als Nutzer möchte ich:

- Softwarewissen visuell erkunden,
- zwischen Cluster, Segmenten und Items navigieren,
- einen ersten Eindruck des potenziellen Systems bekommen.

---

## 3. Seiten / Views

### 3.1 Landing Page

**Ziele:**

- Einführung in Nexonoma
- Kurzer Text („What is Nexonoma?“)
- Navigation:
  - Explore (Grid)
  - About (optional)
  - Docs (Link zu Repo oder später)

**Elemente:**

- Marineblaues Layout (#0B1220)
- Hero-Section
- 2–3 Cards

---

### 3.2 Grid View (Clusterebene)

**Ziele:**

- Überblick über Hauptbereiche (SDLC, Architecture, Organization, AI, Tools)
- Visuelle Karten im Grid-Layout
- Jede Card führt zu Matrix View

**Elemente:**

- Cards im 3- oder 4-Column Layout
- shadcn Card-Komponente
- Icons optional

---

### 3.3 Matrix View (Cluster × Segmente)

**Ziele:**

- zeigt, wie Cluster mit Segmenten verbunden sind
- klickbare Matrix-Zellen
- führt zur City View

**Elemente:**

- Tabelle/Matrix
- Zeilen = Cluster
- Spalten = Segmente
- Klick: clusterId + segmentId → City View

---

### 3.4 City View (Items)

**Ziele:**

- Items in einem Block-/Straßenlayout anzeigen
- erste visuelle Form der Wissenslandkarte
- klickbare Item-Karten (optional)

**Elemente:**

- Box-Layout (Häuser)
- Titel + Kurzbeschreibung

---

## 4. Datenmodell im MVP

- `clusters.json`
- `segments.json`
- `items.json`  
Details in schemas.

---

## 5. Nicht enthalten

- Suche
- Filter
- Graphen
- Bearbeitung der Modelldaten
