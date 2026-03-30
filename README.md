# Voyageur — Luxusreise-Planer (Lokale Version)

## Was ist das?
Eine private Luxusreise-Planungs-App mit:
- **Echte Hotelpreise** via Booking.com Affiliate API
- **Live Web-Recherche** via Claude AI (Condé Nast, AFAR, ELLE Travel etc.)
- **Interaktive Karte** mit Leaflet/OpenStreetMap
- **Echte Bilder** von Unsplash
- Kategorien: Hotels, Orte, Aktivitäten, Restaurants, Transport

## Setup (5 Minuten)

### 1. Voraussetzungen
- Node.js installiert (https://nodejs.org — Version 18+)
- Ein Anthropic API-Key (https://console.anthropic.com)
- Optional: Booking.com Affiliate ID (https://www.booking.com/affiliate-program)
- Optional: Unsplash API Key (https://unsplash.com/developers — kostenlos)

### 2. Installation
```bash
# Projekt entpacken und rein gehen
cd voyageur

# Dependencies installieren
npm install

# .env Datei erstellen mit deinen Keys
cp .env.example .env
# Dann .env öffnen und deine Keys eintragen
```

### 3. API Keys eintragen (.env Datei)
```
VITE_ANTHROPIC_KEY=sk-ant-...        # PFLICHT — von console.anthropic.com
VITE_BOOKING_AID=dein-affiliate-id   # OPTIONAL — für echte Hotelpreise
VITE_UNSPLASH_KEY=dein-key           # OPTIONAL — für echte Fotos
```

### 4. Starten
```bash
npm run dev
```
Öffnet sich unter http://localhost:5173

## Booking.com Integration
Die App nutzt Booking.com auf zwei Wegen:
1. **Ohne Affiliate-ID**: Links öffnen Booking.com direkt zum Suchen
2. **Mit Affiliate-ID**: Links enthalten deine Affiliate-ID für Provisionen

Für die Affiliate-ID: https://www.booking.com/affiliate-program registrieren.

## Wie funktioniert es?
1. Du gibst ein Reiseziel ein (oder "Überrasch mich")
2. Claude AI sucht das Web nach aktuellen Empfehlungen
3. Ergebnisse werden nach Kategorie sortiert angezeigt
4. Jedes Ergebnis hat echte Links zu Google Maps, Booking.com etc.
5. Die Karte zeigt alle Orte mit Pins
6. Du kannst Favoriten merken

## Datenhaushalt
- Alle API-Keys bleiben lokal auf deinem Rechner
- Nichts wird an Dritte gesendet außer an die APIs die du nutzt
- Keine Datenbank, kein Account, keine Registrierung

---

## Online stellen (Vercel + GitHub)

### Schritt 1: GitHub Repository erstellen
```bash
cd voyageur
git init
git add .
git commit -m "Voyageur initial"
```
Dann auf https://github.com/new ein neues **privates** Repository erstellen (z.B. "voyageur"), und:
```bash
git remote add origin https://github.com/DEIN-USERNAME/voyageur.git
git branch -M main
git push -u origin main
```

### Schritt 2: Vercel verbinden
1. Geh auf https://vercel.com und logge dich mit GitHub ein
2. Klick "Add New Project"
3. Wähle dein "voyageur" Repository
4. **WICHTIG** — Klick auf "Environment Variables" und trage ein:
   - `VITE_ANTHROPIC_KEY` = dein Anthropic Key
   - `VITE_PASSWORD` = dein gewähltes Passwort
   - `VITE_BOOKING_AID` = deine Booking.com Affiliate ID (optional)
   - `VITE_UNSPLASH_KEY` = dein Unsplash Key (optional)
5. Klick "Deploy"

### Schritt 3: Fertig!
Du bekommst eine URL wie `voyageur-abc123.vercel.app`.
Teile diese URL + das Passwort mit deinen Leuten.

### Passwort ändern
In Vercel Dashboard → Settings → Environment Variables → `VITE_PASSWORD` ändern → Redeploy.

### Achtung: API-Key Sicherheit
Da der Anthropic API-Key im Frontend läuft (VITE_ prefix), ist er im Browser-Code sichtbar.
Das ist OK für private Nutzung mit Passwortschutz. Für eine öffentliche App bräuchtest du ein Backend.

