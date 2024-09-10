import { Groq } from "groq-sdk";
import { createConfig } from './config';
import * as vscode from 'vscode';

/**
 * Retrieves a concise summary of the changes made in the provided git diff output.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @param {string} diff - The git diff output.
 * @return {Promise<string>} A promise that resolves with the summary of the changes.
 */
export async function getSummary(context: vscode.ExtensionContext, diff: string): Promise<string> {
    const config = createConfig(context);
    let inferenceConfig = await config.getInferenceConfig();

    const { apiKeyGroq, summaryPrompt, summaryTemperature } = inferenceConfig;
    let { modelName } = inferenceConfig;

    if (!modelName) {
        await vscode.commands.executeCommand('commitgroq.getModels');
        inferenceConfig = await config.getInferenceConfig();
        modelName = inferenceConfig.modelName;
    }

    const groq = new Groq({ apiKey: apiKeyGroq });

    const defaultSummaryPrompt = `
        You are an expert developer specialist in creating commits.
        Provide a super concise one sentence overall changes summary of the user \`git diff\` output following strictly the next rules:
        - Do not use any code snippets, imports, file routes or bullets points.
        - Do not mention the route of file that has been change.
        - Simply describe the MAIN GOAL of the changes.
        - Output directly the summary in plain text.
    `.trim();

    const prompt = summaryPrompt || defaultSummaryPrompt;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: `Here is the \`git diff\` output: ${diff}` },
            ],
            temperature: summaryTemperature,
        });

        return chatCompletion.choices[0]?.message?.content
            ?.trim()
            .split("\n")
            .map(line => line.trim())
            .join("\n") || "";

    } catch (error: any) {
        if (error?.status === 404) {
            const errorMessage = error.message.charAt(0).toUpperCase() + error.message.slice(1);

            const action = await vscode.window.showErrorMessage(
                errorMessage,
                "Go to Groq website"
            );

            if (action === "Go to Groq website") {
                vscode.env.openExternal(vscode.Uri.parse("https://www.groq.com/"));
            }

            throw new Error("Model not found");
        }

        throw new Error(
            `Unable to connect to Groq. Please check your API key and internet connection. Error: ${error?.status}`
        );
    }
}

/**
 * Generates a commit message based on the provided summaries of changes.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @param {string[]} summaries - An array of summaries of changes.
 * @return {string} The generated commit message.
 */
export async function getCommitMessage(context: vscode.ExtensionContext, summaries: string[]): Promise<string> {
    const config = createConfig(context);
    const inferenceConfig = await config.getInferenceConfig();

    const {
        apiKeyGroq,
        commitPrompt,
        commitTemperature,
        useEmojis,
        commitEmojis,
        modelName,
        useDescription,
        commitLowerCase,
        commitWithoutDotsAtEnd,
    } = inferenceConfig;

    const groq = new Groq({ apiKey: apiKeyGroq });

    const defaultCommitPrompt = `
        You are an expert developer specialist in creating commit messages.
        Your only goal is to retrieve a single commit message. 
        Based on the provided user changes, combine them in ONE SINGLE commit message retrieving the global idea, following strictly the next rules:
        - Assign the commit {type} according to the next conditions: 
            feat: Only when adding a new feature.
            fix: When fixing a bug. 
            docs: When updating documentation. 
            style: When changing elements styles or design and/or making changes to the code style (formatting, missing semicolons, etc.) without changing the code logic.
            test: When adding or updating tests. 
            chore: When making changes to the build process or auxiliary tools and libraries. 
            revert: When undoing a previous commit.
            refactor: When restructuring code without changing its external behavior, or is any of the other refactor types.
        - Do not add any issues numeration, explain your output nor introduce your answer.
        - Output directly only one commit message in plain text with the next format: \`{type}: {commit_message}\`.
        - Be as concise as possible, keep the message under 50 characters.
    `.trim();

    const prompt = commitPrompt || defaultCommitPrompt;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: `Here are the summaries changes: ${summaries.join(", ")}` },
            ],
            temperature: commitTemperature,
            max_tokens: 50,
        });

        let commit = chatCompletion.choices[0]?.message?.content?.replace(/["`]/g, "") || "";


        if (commitLowerCase) {
            commit = commit.toLowerCase();
        }

        if (commitWithoutDotsAtEnd) {
            commit = commit.replace(/\.$/, "");
        }

        if (useEmojis) {
            const emojisMap = JSON.parse(JSON.stringify(commitEmojis));
            for (const [type, emoji] of Object.entries(emojisMap)) {
                const regex = new RegExp(`\\b${type}\\b`, "g");
                commit = commit.replace(regex, `${type} ${emoji}`);
            }
        }

        if (useDescription) {
            const descriptionLines = summaries.map(s => `- ${s}`);
            const description = descriptionLines.join('\n');
            commit = `${commit}\n\n${description}`;
        }


        return commit.trim();
    } catch (error) {
        throw new Error("Unable to generate commit message.");
    }
}