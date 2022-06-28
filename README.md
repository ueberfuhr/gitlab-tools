# Gitlab-Tools
[![CI Build](https://github.com/ueberfuhr/gitlab-tools/actions/workflows/ci.yml/badge.svg)](https://github.com/ueberfuhr/gitlab-tools/actions/workflows/ci.yml)

Ein Projekt mit Beispiel-Skripten für die automatisierte Verwendung von GitLab mithilfe der [REST API](https://docs.gitlab.com/ee/api/).

Live-Demo: [https://gitlab-tool.herokuapp.com/](https://gitlab-tool.herokuapp.com/)

## Initiales Setup

### Access Token für Zugriffe einrichten

Bevor die Skripte laufen können, muss im Git ein Access Token für Deinen Account eingerichtet werden.

![img.png](doc/img.png)
![img_1.png](doc/img_1.png)

Das Access Token sowie die URL zum Gitlab erstellst Du als Datei
- `src/environments/gitlab-config.json` (für lokales Testen)
- `gitlab-config.json` im Wurzelverzeichnis der gebauten Anwendung vor dem Deployment

**Hinweis:** Du kannst in der lokalen Testumgebung die Datei initial generieren mit dem Befehl

```bash
npm run create-env
```

### IntelliJ HttpClient konfigurieren

Im IntelliJ erstellst Du Dir eine private Umgebungskonfiguration für den HTTP Client (`http-requests/http-client.private.env.json`) und trägst dort die Daten ein:

```json
{
  "dev": {
    "token": "{{access-token}}",
    "sample-project-id": "{{project-id}}"
  }
}
```

In der Datei `http-requests/http-client.env.json` passt Du außerdem die Gitlab-URL an.
