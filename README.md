<div align="center">

# Commit Groq AI

<img src="assets/icon.png" width="25%">

---

[![Version][version-badge]][marketplace-url]
[![Installs][installs-badge]][marketplace-url]
[![Rating][rating-badge]][marketplace-url]
[![License][license-badge]][license-url]

[version-badge]: https://img.shields.io/visual-studio-marketplace/v/DavideLadisa.commitgroq?style=for-the-badge
[installs-badge]: https://img.shields.io/visual-studio-marketplace/i/DavideLadisa.commitgroq?style=for-the-badge&color=red
[rating-badge]: https://img.shields.io/visual-studio-marketplace/r/DavideLadisa.commitgroq?style=for-the-badge
[license-badge]: https://img.shields.io/github/license/FrancoStino/commitgroq?style=for-the-badge
[marketplace-url]: https://marketplace.visualstudio.com/items?itemName=DavideLadisa.commitgroq
[license-url]: https://github.com/FrancoStino/commitgroq/blob/main/LICENSE

</div>

---

## Configuration

To use Commit Groq, you need to configure your Groq API key. Follow these steps:

1. Get an [API key from Groq](https://console.groq.com/keys) (if you don't have one already).
2. Click on Sparkle icon on Source Control Bar.
3. Insert your **Free** or **Paid** API key.
4. Open VS Code settings (File > Preferences > Settings).
5. Search for "Commit Groq AI" in the settings in you want customize it.
6. Enjoy.

## Features

![Commit Groq Demo](https://raw.githubusercontent.com/FrancoStino/commitgroq/main/assets/commitgroq-demo.gif)

-   Automatic generation of commit messages based on modified code.
-   Code analysis for improvement suggestions before committing.
-   Seamless integration with Git workflow in VS Code.

## Reset API Key

1. `CTRL+SHIFT+P` or `CMD+SHIFT+P`
2. Type "Reset Groq API Key"

## Usage

1. Make your code changes as usual.
2. When you're ready to commit, use the "Commit Groq AI" command from the command palette (Ctrl+Shift+P).
3. The extension will generate a commit message based on your changes.
4. Review and modify the message if necessary, then proceed with the commit.

## Settings

This extension contributes the following settings:

-   Run "Commit Groq AI": automatically generates a commit message for your commit.

-   "Reset API Commit Groq": resets your API key.

-   Model: You can select the model from the plugin configuration.

<table>
    <thead>
        <tr>
            <th>Models</th>
            <th>Provider</th>
            <th>Type</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>llama-3.1-8b-instant</code></td>
            <td><img src="/assets/meta.png" width="20"/>
            <code>Meta</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>llama-3.1-70b-versatile</code></td>
            <td><img src="/assets/meta.png" width="20"/>
            <code>Meta</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>llama3-70b-8192</code></td>
            <td><img src="/assets/meta.png" width="20"/>
            <code>Meta</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>llama3-8b-8192</code></td>
            <td><img src="/assets/meta.png" width="20"/>
            <code>Meta</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>llama-guard-3-8b</code></td>
            <td><img src="/assets/meta.png" width="20"/>
            <code>Meta</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>mixtral-8x7b-32768</code></td>
            <td><img src="/assets/mixtral.webp" width="20"/>
            <code>Mixtral</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>gemma-7b-it</code></td>
            <td><img src="/assets/google.png" width="20"/>
            <code>Google</code></td>
            <td><code>Cloud</code></td>
        </tr>
        <tr>
            <td><code>gemma2-9b-it</code></td>
            <td><img src="/assets/google.png" width="20"/>
            <code>Google</code></td>
            <td><code>Cloud</code></td>
        </tr>
    </tbody>
</table>

-   Use Emojis: It allows you to enable or disable the use of emojis in commit messages.

-   Custom Emojis: It allows you to write down the emojis you want to use in the next template object in the VSCode config.json.

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

-   Custom Summary Prompt: The prompt that will be used to generate the summary of all git diff.

-   Custom Commit Prompt: The prompt that will be used to generate the commit message.

-   Custom Summary Temperature: The temperature that will be used to generate the summary of all git diff.

-   Custom Commit Temperature: The temperature that will be used to generate the commit message.

## Known Issues

There are currently no known issues. If you encounter any problems, please open an issue on our GitHub repository.

---

> ## For more information
>
> -   [Groq Documentation](https://www.groq.com/docs)
> -   [Commit Groq GitHub Repository](https://github.com/>FrancoStino/commitgroq) > **Happy coding with Commit Groq!**
