import { workspace, ExtensionContext } from "vscode";
import { initializeApiKey } from "./types/apiKeyManager";


class Config {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    async getInferenceConfig() {
        const config = this.#config;

        const apiKeyGroq = await initializeApiKey(this.context);
        const modelName: string = config.get("model") as string;
        const useDescription: boolean = config.get("useDescription") as boolean;
        const useEmojis: boolean = config.get("useEmojis") as boolean;
        const commitEmojis: string = config.get('commitEmojis') as string;
        const summaryPrompt: string = config.get("custom.summaryPrompt") as string;
        const summaryTemperature: number = config.get("custom.summaryTemperature") as number;
        const commitPrompt: string = config.get("custom.commitPrompt") as string;
        const commitTemperature: number = config.get("custom.commitTemperature") as number;
        const forceCommitLowerCase: boolean = config.get("forceCommitLowerCase") as boolean;
        const forceCommitWithoutDotsAtEnd: boolean = config.get("forceCommitWithoutDotsAtEnd") as boolean;

        return {
            apiKeyGroq,
            modelName,
            useDescription,
            useEmojis,
            commitEmojis,
            summaryPrompt,
            summaryTemperature,
            commitPrompt,
            commitTemperature,
            forceCommitLowerCase,
            forceCommitWithoutDotsAtEnd,
        };
    }

    get #config() {
        return workspace.getConfiguration("commitgroq");
    }
}

export const createConfig = (context: ExtensionContext): Config => new Config(context);