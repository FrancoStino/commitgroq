# Commit Groq

Commit Groq is a Visual Studio Code extension that uses the Groq API to enhance the code commit process.

## Configuration

To use Commit Groq, you need to configure your Groq API key. Follow these steps:

1. Get an [API key from Groq](https://console.groq.com/keys) (if you don't have one already).
2. Open VS Code settings (File > Preferences > Settings).
3. Search for "Commit Groq" in the settings.
4. Enter your API key in the "Groq API Key" field.

## Features

![Commit Groq Demo](https://raw.githubusercontent.com/FrancoStino/commitgroq/main/assets/commitgroq-demo.gif)

- Automatic generation of commit messages based on modified code.
- Code analysis for improvement suggestions before committing.
- Seamless integration with Git workflow in VS Code.

## Usage

1. Make your code changes as usual.
2. When you're ready to commit, use the "Commit Groq: Generate Commit Message" command from the command palette (Ctrl+Shift+P).
3. The extension will generate a commit message based on your changes.
4. Review and modify the message if necessary, then proceed with the commit.

## Settings

This extension contributes the following settings:

- "Run Commit Groq": automatically generates a commit message for your commit.
- "Reset API Commit Groq": resets your API key.

- Model: You can select the model from the plugin configuration.

`llama3-groq-8b-8192-tool-use-preview` - default

`llama3-groq-70b-8192-tool-use-preview`

`llama3-70b-8192`

`llama3-8b-8192`

`mixtral-8x7b-32768`

`gemma-7b-it`

`gemma2-9b-it`

Use Emojis: It allows you to enable or disable the use of emojis in commit messages.

Custom Emojis: It allows you to write down the emojis you want to use in the next template object in the VSCode config.json.

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

## Known Issues

There are currently no known issues. If you encounter any problems, please open an issue on our GitHub repository.

---

## For more information

- [Groq Documentation](https://www.groq.com/docs)
- [Commit Groq GitHub Repository](https://github.com/FrancoStino/commitgroq)

**Happy coding with Commit Groq!**
