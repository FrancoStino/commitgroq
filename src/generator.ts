import { Groq } from "groq-sdk";
import { createConfig } from './config';
import * as vscode from 'vscode';

export async function getSummary(context: vscode.ExtensionContext, diff: string): Promise<string> {
    const config = createConfig(context); // Passa il contesto corretto
    const inferenceConfig = await config.getInferenceConfig();

    const { apiKeyGroq, summaryPrompt, summaryTemperature, modelName } = inferenceConfig;

    const groq = new Groq({ apiKey: apiKeyGroq });

    const defaultSummaryPrompt = `You are an expert developer specialist in creating commits.
	Provide a super concise one sentence overall changes summary of the user \`git diff\` output following strictly the next rules:
	- Do not use any code snippets, imports, file routes or bullets points.
	- Do not mention the route of file that has been change.
	- Simply describe the MAIN GOAL of the changes.
	- Output directly the summary in plain text.`;

    const prompt = summaryPrompt || defaultSummaryPrompt;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
                {
                    role: "user",
                    content: `Here is the \`git diff\` output: ${diff}`,
                },
            ],
            temperature: summaryTemperature,
        });

        return chatCompletion.choices[0]?.message?.content
            ?.trimStart()
            .split("\n")
            .map((v) => v.trim())
            .join("\n") || "";

    } catch (error: any) {
        if (error?.status === 404) {
            const errorMessage =
                error.message.charAt(0).toUpperCase() + error.message.slice(1);

            vscode.window
                .showErrorMessage(errorMessage, "Go to Groq website")
                .then((action) => {
                    if (action === "Go to Groq website") {
                        vscode.env.openExternal(
                            vscode.Uri.parse("https://www.groq.com/"),
                        );
                    }
                });

            throw new Error();
        }

        throw new Error(
            `Unable to connect to Groq. Please check your API key and internet connection. Error: ${error?.status}`,
        );
    }
}

export async function getCommitMessage(context: vscode.ExtensionContext, summaries: string[]) {
    const config = createConfig(context); // Passa il contesto corretto
    const inferenceConfig = await config.getInferenceConfig();

    const {
        apiKeyGroq,
        commitPrompt,
        commitTemperature,
        useEmojis,
        commitEmojis,
        modelName,
        useDescription,
    } = inferenceConfig;

    const groq = new Groq({ apiKey: apiKeyGroq });

    const defaultCommitPrompt = `You are an expert developer specialist in creating commits messages.
	Your only goal is to retrieve a single commit message. 
	Based on the provided user changes, combine them in ONE SINGLE commit message retrieving the global idea, following strictly the next rules:
	- Always use the next format: \`{type}: {commit_message}\` where \`{type}\` is one of \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`, \`revert\`.
	- Output directly only one commit message in plain text.
	- Be as concise as possible. 50 characters max.
	- Do not add any issues numeration nor explain your output.`;

    const prompt = commitPrompt || defaultCommitPrompt;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
                {
                    role: "user",
                    content: `Here are the summaries changes: ${summaries.join(", ")}`,
                },
            ],
            temperature: commitTemperature,
            max_tokens: 45,
        });

        let commit = chatCompletion.choices[0]?.message?.content?.replace(/["`]/g, "") || "";

        // Add the emoji to the commit if activated
        if (useEmojis) {
            const emojisMap = JSON.parse(JSON.stringify(commitEmojis));
            for (const [type, emoji] of Object.entries(emojisMap)) {
                const regex = new RegExp(`\\b${type}\\b`, "g");
                commit = commit.replace(regex, `${type} ${emoji}`);
            }
        }

        // Add files summaries as description if useDescription is activated
        if (useDescription) {
            const descriptionLines = summaries.map((s) => '- ' + s);
            const description = descriptionLines.join('\n');
            commit = commit + '\n\n' + description;
        }

        return commit.trim();
    } catch (error) {
        throw new Error("Unable to generate commit.");
    }
}
