// apiKeyManager.ts
import * as vscode from 'vscode';

// Funzione per ottenere la API Key dal secret storage
export async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    return await context.secrets.get('grok.apiKey');
}

// Funzione per salvare la API Key nel secret storage
export async function saveApiKey(context: vscode.ExtensionContext, apiKey: string): Promise<void> {
    await context.secrets.store('grok.apiKey', apiKey);
}

// Funzione per cancellare la API Key dal secret storage
export async function resetApiKey(context: vscode.ExtensionContext): Promise<void> {
    await context.secrets.delete('grok.apiKey');
}
