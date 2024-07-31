# Commit Groq

Commit Groq è un'estensione per Visual Studio Code che utilizza l'API di Groq per migliorare il processo di commit del codice.

## Configurazione

Per utilizzare Commit Groq, è necessario configurare la tua API key di Groq. Segui questi passaggi:

1. Ottieni una [API key da Groq](https://console.groq.com/keys) (se non ne hai già una).
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

- "Run Commit Groq": genera automaticamente un messaggio di commit per il tuo commit.
- "Reset API Commit Groq": ripristina la tua API key.

- Model: You can select the model from the plugin configuration.

`llama3` - default

  `codegemma`

  `codellama`

  `mistral`

  `custom` - It allow you to write down the model name that you have set on ollama.


Use Emojis: It allow you to enable or disable the use of emojis in commit messages.

Custom Emojis: It allow you to write down the emojis you want to use in the next template object in the VSCode config.json.


  ```json
   "commitollama.commitEmojis": {
    "feat": "✨",
    "fix": "🐛",
    "docs": "📝",
    "style": "💎",
    "refactor": "♻️",
    "test": "🧪",
    "chore": "📦",
    "revert": "⏪"
  }
  ```

- Custom Endpoint: Ollama usually uses port 11434. It is the value that will be used if empty.

- Custom Summary Prompt: The prompt that will be used to generate the summary of all git diff.

- Custom Commit Prompt: The prompt that will be used to generate the commit message.

- Custom Summary Temperature: The temperature that will be used to generate the summary of all git diff.

- Custom Commit Temperature: The temperature that will be used to generate the commit message.


## Problemi noti

Al momento non ci sono problemi noti. Se riscontri qualche problema, per favore apri un issue sul nostro repository GitHub.

---

## Per maggiori informazioni

- [Documentazione di Groq](https://www.groq.com/docs)
- [Repository GitHub di Commit Groq](https://github.com/FrancoStino/commitgroq)

**Buon coding con Commit Groq!**
