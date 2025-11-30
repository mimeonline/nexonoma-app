# JSON Server – Lokale API für Development

Dieses Setup stellt eine schnelle Fake-REST-API bereit, mit der du während der Entwicklung realistische API-Responses simulieren kannst. Ideal für Frontend-MVPs wie Nexonoma.

---

## Installation

Falls du JSON-Server noch nicht global installiert hast:

```bash
npm install -g json-server
````

oder projektbezogen:

```bash
npm install --save-dev json-server
```

## API starten

Im Projektordner ausführen:

```bash
npx json-server db.json --port 4500
````

Damit läuft die API unter:

```aruion
http://localhost:4500
````

Entwicklungsstruktur

db.json enthält die API-Daten:

```json
{
  "grid": [],
  "nodes": [],
  "edges": []
}
````

Du kannst so viele Endpunkte hinzufügen, wie du möchtest.

Typische API-Routen
Beispiel:

```bash
GET  /grid
GET  /nodes
GET  /edges
POST /nodes
DELETE /edges/7
````

JSON-Server implementiert automatisch:

- Filtering: /grid?type=sdlc
- Full-text search: /grid?q=architecture
- Pagination: /grid?_page=1&_limit=20
- Sorting: /nodes?_sort=name&_order=asc

## Live-Änderungen

JSON-Server überwacht db.json.

Änderungen in der Datei werden sofort übernommen — kein Neustart nötig.

### Optional: Eigene server.json konfigurieren

Beispiel:

```json
{
  "port": 4500,
  "watch": true
}
```

Starten mit:

```bash
npx json-server db.json -c server.json
````

## Troubleshooting

Port already in use

```bash
killall node
```

oder Mac:

```bash
lsof -i :4500
kill -9 <PID>
````

## Best Practice

- für Frontends, die später gegen Neo4j laufen werden
- für MVP-Prototyping
- für UI-Development ohne echte Datenbank
- reproduzierbare Testdaten unabhängig vom Backend

## Hinweis

JSON-Server ist NICHT für Produktion gedacht — nur für Entwicklung und Testumgebung.
