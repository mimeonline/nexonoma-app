# Nexonoma App – PROJECT.md

## 1. Projektziel

Nexonoma ist eine visuelle Wissens- und Navigationsplattform für Softwareentwicklung, Architektur, Organisation und Technologie.  
Das MVP soll eine minimal funktionsfähige Version dieser Plattform bereitstellen, um früh Feedback zu ermöglichen und das Konzept validierbar zu machen.

## 2. MVP-Fokus

- Frontend-only
- Daten aus JSON-Dateien
- Drei Kern-Views:
  - Landing Page (Intro + Navigation)
  - Grid View (Cluster Cards)
  - Matrix View (Cluster × Segmente)
  - City View (drilldown auf Items)

## 3. Non-Goals (für den MVP)

- Keine Neo4j-Integration
- Keine API
- Kein User-Login
- Kein komplexer Graph-Explorer
- Keine Echtzeit-Funktionalität
- Keine Editierbarkeit von Daten

## 4. Architektur (MVP)

- Next.js 16
- React Server Components
- Tailwind CSS
- shadcn/ui für UI-Komponenten
- JSON als Datenquelle
- Deployment über Vercel, Netlify oder IONOS

## 5. Technical Constraints

- Simples, nachvollziehbares Frontend
- Cluster, Segmente und Items werden clientseitig geladen
- Visuelle Konsistenz (Design Guide)
- Minimaler Build- und Codex-Kontext

## 6. Deliverables

- Funktionierendes Frontend mit drei Views
- Erstes kleines Datenmodell
