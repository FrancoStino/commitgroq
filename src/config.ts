import { workspace, ExtensionContext } from "vscode";
import { getApiKey } from "./types/apiKeyManager";


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

        // Load description
        const useDescription: boolean = config.get("useDescription") as boolean;

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
            useDescription,
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