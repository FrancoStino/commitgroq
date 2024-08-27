import { workspace, ExtensionContext } from "vscode";
import { getApiKey } from "./types/apiKeyManager";

// export const defaultConfig = {
//     model: Model.Llama3,
//     useEmojis: false,
//     commitEmojis: {
//         feat: "✨",
//         fix: "🐛",
//         docs: "📝",
//         style: "💎",
//         refactor: "♻️",
//         test: "🧪",
//         chore: "📦",
//         revert: "⏪",
//     },
//     temperature: 0.8,
//     // num_predict: 100,
// };

class Config {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    async getInferenceConfig() {
        const config = this.#config;

        // Load API Key
        const apiKeyGroq = await getApiKey(this.context);

        // Load model
        let modelName: string = config.get("model") as string;

        // Load Emojis Config
        const useEmojis: boolean = config.get("useEmojis") as boolean;
        const commitEmojis: string = config.get('commitEmojis') as string;

        // Load custom prompt and temperatures
        const summaryPrompt = config.get("custom.summaryPrompt") as string;
        const summaryTemperature = config.get("custom.summaryTemperature") as number;
        const commitPrompt = config.get("custom.commitPrompt") as string;
        const commitTemperature = config.get("custom.commitTemperature") as number;

        return {
            apiKeyGroq,
            modelName,
            summaryPrompt,
            summaryTemperature,
            commitPrompt,
            commitTemperature,
            useEmojis,
            commitEmojis,
        };
    }

    get #config() {
        return workspace.getConfiguration("commitgroq");
    }
}

export const createConfig = (context: ExtensionContext) => new Config(context);