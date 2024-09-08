import * as vscode from 'vscode';

const API_KEY_SECRET = 'grok.apiKey';

/**
 * Retrieves the API Key from the secret storage.
 * @param context The extension context.
 * @returns A promise that resolves to the API Key or undefined if not found.
 */
export async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    return context.secrets.get(API_KEY_SECRET);
}

/**
 * Saves the API Key to the secret storage.
 * @param context The extension context.
 * @param apiKey The API Key to be saved.
 */
export async function saveApiKey(context: vscode.ExtensionContext, apiKey: string): Promise<void> {
    await context.secrets.store(API_KEY_SECRET, apiKey);
}

/**
 * Removes the API Key from the secret storage.
 * @param context The extension context.
 */
export async function resetApiKey(context: vscode.ExtensionContext): Promise<void> {
    const confirm = await vscode.window.showInformationMessage(
        'Are you sure you want to reset your Groq API Key?',
        { modal: true },
        'Yes'
    );

    if (confirm === 'Yes') {
        await context.secrets.delete(API_KEY_SECRET);
        vscode.window.showInformationMessage('Groq API Key is reset!');
    }
}

/**
 * Initializes the API Key.
 * @param context The extension context.
 * @returns A promise that resolves to the API Key or undefined if not set.
 */
export async function initializeApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    const apiKey = await getApiKey(context);

    if (apiKey) {
        return apiKey;
    }

    const newApiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Groq API Key',
        ignoreFocusOut: true,
        password: true,
        placeHolder: 'Your Groq API Key'
    });

    if (newApiKey) {
        await saveApiKey(context, newApiKey);
        vscode.window.showInformationMessage('Groq API Key successfully saved!');
        return newApiKey;
    }

    return undefined;
}