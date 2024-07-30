# Commit Groq

Commit Groq è un'estensione per Visual Studio Code che utilizza l'API di Groq per migliorare il processo di commit del codice.

## Configurazione

Per utilizzare Commit Groq, è necessario configurare la tua API key di Groq. Segui questi passaggi:

1. Ottieni una API key da Groq (se non ne hai già una).
2. Apri le impostazioni di VS Code (File > Preferences > Settings).
3. Cerca "Commit Groq" nelle impostazioni.
4. Inserisci la tua API key nel campo "Groq API Key".

## Funzionalità

![Commit Groq Demo](https://raw.githubusercontent.com/FrancoStino/commitgroq/main/assets/commitgroq-demo.gif)

- Generazione automatica di messaggi di commit basati sul codice modificato.
- Analisi del codice per suggerimenti di miglioramento prima del commit.
- Integrazione seamless con il flusso di lavoro di Git in VS Code.

## Utilizzo

1. Fai le tue modifiche al codice come al solito.
2. Quando sei pronto per fare un commit, usa il comando "Commit Groq: Generate Commit Message" dalla palette dei comandi (Ctrl+Shift+P).
3. L'estensione genererà un messaggio di commit basato sulle tue modifiche.
4. Rivedi e modifica il messaggio se necessario, quindi procedi con il commit.

## Impostazioni

Questa estensione contribuisce le seguenti impostazioni:

* `commitGroq.apiKey`: La tua API key di Groq.
* `commitGroq.language`: La lingua preferita per i messaggi di commit (default: inglese).

## Problemi noti

Al momento non ci sono problemi noti. Se riscontri qualche problema, per favore apri un issue sul nostro repository GitHub.

## Note di rilascio

### 1.0.0

Rilascio iniziale di Commit Groq.

---

## Per maggiori informazioni

* [Documentazione di Groq](https://www.groq.com/docs)
* [Repository GitHub di Commit Groq](https://github.com/FrancoStino/commitgroq)

**Buon coding con Commit Groq!**
