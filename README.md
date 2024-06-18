# Prosjektdokumentasjon

## Innholdsfortegnelse

- [Introduksjon](#introduksjon)
- [Installasjon](#installasjon)
- [Prosess og utvikling](#prosess-og-utvikling)
- [Database](#database)
- [Faglig Refleksjon](#faglig-refleksjon)

## Introduksjon

_Dette prosjektet er en webapplikasjon for administrasjon av restauranter. Applikasjonen er bygget med Node.js, Express, React, og axios. Backend håndterer brukerregistrering, innlogging, og CRUD-operasjoner (Create, Read, Update, Delete) for restauranter. Den bruker JWT (JSON Web Tokens) for autentisering og autorisasjon, og CORS (Cross-Origin Resource Sharing) for å tillate forespørsler fra forskjellige domener. CRUD API-tjenesten crudapi.co.uk brukes for å lagre og hente data._

## Installasjon

_Beskriv hvordan man installerer og starter prosjektet_

### Installere prosjektet

```bash
naviger til cd client
npm install 

naviger til rotmappe og kjør
npm install 
```

### Kjøre prosjektet

```bash
npm start i rotmappe
```

## Prosess og utvikling

_Backend er bygget ved hjelp av Express, som er et populært webapplikasjonsrammeverk for Node.js. React brukes til frontend-delen av applikasjonen for å lage en dynamisk brukeropplevelse.

Brukerregistrering
Når en bruker registrerer seg, sendes brukernavn, passord og rolle til serveren. Dataene lagres via crudapi.co.uk API. JWT-token genereres og sendes tilbake til klienten, hvor det lagres i localStorage.

Innlogging
Når en bruker logger inn, sendes brukernavn og passord til serveren. Passordet valideres, og hvis det stemmer, genereres en JWT-token og sendes tilbake til klienten. Tokenen lagres i localStorage.

CRUD-operasjoner
CRUD-operasjoner for restauranter utføres ved å sende forespørsler til serveren, som videre sender forespørsler til crudapi.co.uk. Disse operasjonene inkluderer opprettelse, lesing, oppdatering og sletting av restauranter.

Frontend
Frontend er bygget med React og håndterer visning, filtrering og sortering av restauranter. Brukergrensesnittet inkluderer skjemaer for opprettelse og oppdatering av restauranter, som er tilgjengelige kun for admin-brukere.

Feilhåndtering
Applikasjonen viser feilmeldinger til brukeren ved problemer med registrering, innlogging eller CRUD-operasjoner._

## Database

_Backend bruker crudapi.co.uk som databaseløsning. Databasen inneholder data om brukere og restauranter.

Brukere: Inkluderer informasjon som brukernavn, passord og rolle (bruker eller admin).
Restauranter: Inkluderer informasjon som navn, beskrivelse, by, land, gjennomsnittspris, kjøkken, bilde-URL, åpningstider, telefon, rating, og status for booking og insider._

## Faglig refleksjon

### Evaluering av eget arbeid

_En av utfordringene har vært å sikre korrekt dataflyt mellom klient og server, spesielt når det gjelder autentisering og autorisering. Jeg har også jobbet med å sikre at dataene lagres og hentes riktig fra crudapi.co.uk._