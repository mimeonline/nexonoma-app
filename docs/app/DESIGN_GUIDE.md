# Nexonoma – DESIGN_GUIDE (MVP)

Dieser Guide definiert das visuelle, strukturelle und technische Grundgerüst für den Nexonoma MVP.  
Er dient als verbindlicher Standard für Codex, UI-Design, Komponentenarchitektur und Code-Qualität.

---

## 1. 🎨 Farben (Brand System)

### Primärfarben (Brand Core)

- **Brand Dark:** `#0B1220`
- **Brand Layer:** `#131C2E`
- **Brand Panel:** `#1F2A40`
- **Brand Border / Separation:** `#2A3C5A`

### Sekundärfarben (Navigation & Orientierung)

- **Cyan-Soft:** `#4DD0E1`
- **Blue-Light:** `#7CB9FF`
- **Blue-UltraLight:** `#8AD4FF`
- **Blue-Pale:** `#BFE6FF`

### Akzentfarben (Action)

- **Neon-Turquoise:** `#5CFCCF`
- **Aqua-Glow:** `#1AFFE4`
- **Optional Gold-Signal:** `#FFD460`

### Textfarben

- **Primary Text:** `#FFFFFF`
- **Secondary Text:** `#E4E7EE`
- **Tertiary Text:** `#9DA8C2`
- **Meta Text:** `#6F7C99`
- **Disabled Text:** `#4B566E`

---

## 2. ✒️ Typografie

### Fonts

- **Headline:** Space Grotesk (alternativ Tomorrow)
- **Body:** Inter oder DM Sans
- **Code / Tech:** JetBrains Mono

### Stilregeln

- Headline: semibold–bold
- Body: regular
- Letter-Spacing: minimal tight
- Rendering: crisp-edges

---

## 3. 📐 Layout-Richtlinien

## Ebene 1 – Grid View (Exploration)

- max. 4-Spalten Grid
- Cards enthalten:
  - Titel
  - Subtext (2–3 Wörter)
  - optional Icon
- Hover:
  - subtle glow (`rgba(255,255,255,0.03)`)

### Ebene 2 – Matrix View (Analyse)

- Full-width Tabelle
- Hover-Effekt auf Zellen
- clickable rows/columns
- aktive Zelle:
  - glow: `rgba(92,252,207,0.05)`

### Ebene 3 – City View (Deep Structure)

- „Häuser / Blocks“ → visuelle Cluster
- Hintergrund: `#0B1220`
- Panels: `#1F2A40`
- Straßen / Linien: `#2A3C5A`

---

## 4. 🧩 UI-Komponenten (shadcn/ui)

Verwende ausschließlich semantische Komponenten:

- `<Card>` – Grid/Block Darstellung
- `<Button>` – Primary/Secondary CTAs
- `<Table>` – Matrix-Ansichten
- `<Sheet>` – spätere Drilldowns
- `<Badge>` – Rollen/Cluster/Tags

---

## 5. 🎛️ Interactions & States

### Hover

- Hintergrund: `rgba(255,255,255,0.02)`
- Border: `rgba(92,252,207,0.4)`

### Active

- BG: `rgba(92,252,207,0.06)`
- Glow: `0 0 6px #1AFFE4`

### Selected

- BG: `#1F2A40`
- Border: `#4DD0E1`

### Disabled

- Text: `#4B566E`

---

## 6. 🔧 Code Style & Patterns (MVP-konsolidiert)

### Leitprinzipien

- Klarheit vor Cleverness
- DRY (Don’t Repeat Yourself)
- KISS (Keep It Simple)
- Single Responsibility pro Komponente
- Predictable Patterns
- Konsistente Strukturen für Grid, Matrix und City Views

---

## 7. 🔤 TypeScript Regeln

- **const** für unveränderliche Werte  
- **let** für veränderliche Werte  
- **kein `var`**  
- Funktions- & Variablennamen: `camelCase`  
- Komponenten & Views: `PascalCase`  
- max. Funktionslänge: **50 Zeilen**  
- keine Magic Numbers → `const` definieren  
- Utility-Funktionen in `/utils`  
- TypeScript bevorzugen  

---

## 8. 🗂️ Dateistruktur (Next.js 16)

```txt
  /app
  /(routes)
  /components
  /ui
  /layout
  /views
  /data
  /cluster
  /segments
  /relations
  /utils
  /lib
  /styles
```

Regeln:

- Keine Flat-Struktur  
- Komponenten nach Funktion gruppieren  
- JSON-first Ansatz für Content  

---

## 9. 🧹 Linting & Formatierung

- **Prettier** für Formatierung
- **ESLint** für Code-Qualität
- Automatisches Linting vor jedem Commit
- Keine Deaktivierung von Regeln ohne Begründung

---

## 10. 🔖 Git Commit Style (Conventional Commits)

**Format:**

```ts
  <type>(<scope>): <beschreibung>
```

**Types:**

- `feat:` neues Feature
- `fix:` Bugfix
- `refactor:` Verbesserung ohne neues Verhalten
- `style:` Formatierung, Kommentare
- `docs:` Dokumentation
- `chore:` Build, CI/CD, tooling
- `perf:` Performance

**Beispiele:**

```bash
  feat(ui): add city layout building heights
  fix(data): correct relation parsing
  refactor(layout): extract grid cell renderer
````

---

## 11. 🧭 UX-Regeln für Codex

- immer Tailwind-Theme Tokens nutzen  
- **keine Inline-Styles**  
- minimalistische Layouts  
- mobile-first  
- subtile Animationen  
- semantische Komponenten statt Div-Wildwuchs  

---

## 12. 🔷 Logo / Icon

Nur Anforderungen für später:

- abstraktes Wissensnetz  
- hexagonale oder nodale Formen  
- technische Linie / futuristisches Mapping  
- keine verspielten Icons  
