import * as vscode from 'vscode';
import { createConfig } from '../config';

export async function getModels(context: vscode.ExtensionContext) {
    const config = createConfig(context);
    const { apiKeyGroq } = await config.getInferenceConfig();

    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKeyGroq}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data: models } = await response.json() as { data: Array<{ id: string, active?: boolean, owned_by?: string }> };

        if (!models || models.length === 0) {
            vscode.window.showErrorMessage('No models available from Groq.');
            return;
        }

        console.log('Models:', models);

        const selectedModel = await vscode.window.showQuickPick(
            models
                .filter(model => model.active !== false && ['Google', 'Groq', 'Meta', 'Mistral AI'].includes(model.owned_by ?? ''))
                .map(model => ({
                    label: model.id,
                    description: model.owned_by,
                    iconPath: vscode.Uri.file(context.asAbsolutePath(`assets/${model.owned_by?.toLowerCase().replace(/\s+/g, '-')}.png`)),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
            {
                placeHolder: 'Select a model for commit generation',
                title: 'Models',
            }
        );

        if (selectedModel) {
            await vscode.workspace.getConfiguration().update('commitgroq.model', selectedModel.label, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Model "${selectedModel.label}" has been selected.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to retrieve models from Groq: ${errorMessage}`);
    }
}