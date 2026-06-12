# Konfi-Camp
Theme für OctoberCMS.

Maintainer: [@xyng](https://github.com/xyng).

## Installation
Voraussetzungen:
- Eigener Apache vHost mit `mod_rewrite`
- PHP `^8.0`
- OctoberCMS `2.0` installiert
- NVM (Node Version Manager)
- yarn `^1.22`

Vorgehen:
1. Node-Version setzen (bei jedem Öffnen des Projekts im Terminal!)
  	- `nvm use`
	- falls Version noch nicht installiert `nvm install`
2. Pakete installieren
	- `yarn install`
3. `.env.default` zu `.env` _kopieren_ und entsprechend der Systemkonfiguration einstellen
4. `yarn start` um Entwicklungsserver zu starten
5. Seite über in `.env` ausgewähltem Port aufrufen. Anfragen an October werden durch den Proxy weitergeleitet. Assets werden injiziert und automatisch neu geladen.

## Production-Build
Sicherstellen, dass SSH-Zugriff zum Deployment-Ziel auf dem Dedi verfügbar ist (SSH-Key muss dort hinterlegt sein)

1. `nvm use`
2. `yarn run build`
3. `./deploy.sh`
