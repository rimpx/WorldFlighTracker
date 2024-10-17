# WorldFlightTracker
WorldFlightTracker è una piattaforma permette di monitorare informazioni su voli in tutti gli aeroporti del mondo, fornendo aggiornamenti in tempo reale su gate, orari, ritardi e durata del tragitto. Offre informazioni dettagliate sui servizi aeroportuali e include recensioni verificate dai viaggiatori. Grazie a un'interfaccia intuitiva, è accessibile da qualsiasi dispositivo, che sia mobile o desktop. La piattaforma consente di condividere recensioni e esperienze, creando una community di viaggiatori con feedback reali.

WorldFlightTracker is a platform that allows users to monitor flight information from airports around the world, providing real-time updates on gates, schedules, delays, and travel duration. It offers detailed information about airport services and includes verified traveler reviews. With an intuitive interface, it is accessible from any device, whether mobile or desktop. The platform also allows users to share reviews and experiences, creating a community of travelers with real feedback.

## Requisiti Funzionali

1. **Database degli aeroporti**:
   - Creare un database che memorizzi tutti gli aeroporti.
   - Includere informazioni dettagliate come:
     - Descrizioni degli aeroporti.
     - Servizi disponibili.
     - Foto.
     - Valutazioni e recensioni degli utenti.

2. **Database degli utenti**:
   - Implementare un sistema per gestire i dati degli utenti registrati:
     - Informazioni personali.
     - Preferenze di viaggio.
     - Possibilità di eliminare i dati su richiesta.

3. **Registrazione degli utenti**:
   - Consentire agli utenti di:
     - Registrarsi e creare un profilo.
     - Gestire le proprie informazioni personali.
     - Ricevere notifiche sui voli.

4. **Funzionalità di ricerca**:
   - Implementare una funzione di ricerca avanzata per permettere agli utenti di:
     - Trovare informazioni sugli aeroporti.
     - Visualizzare orari dei voli e altri dettagli pertinenti.
     - Consultare recensioni degli aeroporti.

5. **Notifiche sugli aggiornamenti dei voli**:
   - Implementare un sistema di notifiche in tempo reale per informare gli utenti su:
     - Ritardi dei voli.
     - Cancellazioni.
     - Aggiornamenti dei gate di imbarco e altre informazioni rilevanti.

6. **Integrazione API esterne per informazioni sui voli**:
   - Integrare API esterne per ottenere dati aggiornati su:
     - Orari dei voli.
     - Stato del volo.
     - Gate di imbarco.

7. **Tracciamento voli su mappa**:
   - Integrare una mappa per visualizzare in tempo reale il percorso e la posizione attuale del volo.

8. **Pianificazione voli futuri**:
   - Consentire agli utenti di:
     - Pianificare voli futuri.
     - Impostare promemoria.
     - Ricevere aggiornamenti personalizzati sui voli pianificati.

9. **Esposizione API pubblica**:
   - Creare e documentare un'API pubblica per consentire a terze parti di:
     - Accedere ai dati sugli aeroporti.
     - Accedere ai dati sui voli.
     - Accedere ai dati degli utenti.

10. **Architettura client-server**:
    - Implementare un'architettura basata su client-server.
    - Il server gestirà:
      - Il database.
      - Gli aggiornamenti di volo.
      - La logica di gestione.
    - Il client offrirà:
      - Un'interfaccia utente intuitiva.
      - Accesso alle funzionalità tramite chiamate HTTP.

## Requisiti Non Funzionali

1. **Compatibilità multipiattaforma**:
   - Garantire che l'app sia utilizzabile su:
     - Dispositivi mobili (Android e iOS).
     - Web, offrendo un'esperienza coerente su tutte le piattaforme.

2. **Sicurezza dei dati**:
   - Proteggere i dati personali degli utenti secondo le normative (es. GDPR).
   - Implementare autenticazione sicura e gestione delle credenziali.

3. **Scalabilità**:
   - Garantire che l'app possa gestire un numero crescente di utenti e richieste API senza cali di prestazioni.

4. **Prestazioni**:
   - Assicurare tempi di risposta rapidi per:
     - Richieste di ricerca.
     - Visualizzazione di voli.
     - Notifiche in tempo reale.

5. **Affidabilità**:
   - Garantire alta disponibilità e continuità operativa con un'architettura resiliente ai guasti.

6. **Usabilità**:
   - L'interfaccia utente deve essere:
     - Intuitiva e facilmente navigabile.
     - Adatta anche a utenti non esperti.

7. **Documentazione API**:
   - Le API pubbliche devono essere ben documentate, includendo:
     - Esempi di utilizzo.
     - Istruzioni per integrazioni di terze parti.

## Requisiti di Dominio

1. **Standard aeroportuali**:
   - Il sistema deve conformarsi a standard internazionali come:
     - Codici IATA e ICAO.
     - Altri protocolli rilevanti per la gestione del traffico aereo.

2. **Dati sui voli**:
   - I dati sui voli devono essere ottenuti in tempo reale da fonti affidabili, seguendo protocolli internazionali di aviazione.

3. **Geolocalizzazione e mappatura**:
   - L'integrazione con i servizi di mappatura deve seguire standard di geolocalizzazione e fornire una visualizzazione accurata e aggiornata dei percorsi di volo.

4. **Normative sui viaggi e aviazione**:
   - Considerare normative aeroportuali e di volo che possono variare a seconda della regione o del paese.
