import { ExtensionContext, window, workspace, ConfigurationTarget, Uri } from 'vscode';
import { createConfig } from '../config';
import { Groq } from "groq-sdk";

export async function getModels(context: ExtensionContext) {
    const config = createConfig(context);
    const { apiKeyGroq } = await config.getInferenceConfig();

    try {
        const groq = new Groq({ apiKey: apiKeyGroq });
        const models = await groq.models.list();

        if (!models || models.data.length === 0) {
            window.showErrorMessage('No models available from Groq.');
            return;
        }

        const selectedModel = await window.showQuickPick(
            models.data
                .filter(model => !('active' in model && model.active === false) && ['Google', 'Groq', 'Meta', 'Mistral AI'].includes(model.owned_by ?? ''))
                .map(model => ({
                    label: model.id,
                    description: model.owned_by,
                    iconPath: Uri.file(context.asAbsolutePath(`assets/${model.owned_by?.toLowerCase().replace(/\s+/g, '-')}.webp`)),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
            {
                placeHolder: 'Select a model for commit generation',
                title: 'Models',
            }
        );

        if (selectedModel) {
            await workspace.getConfiguration().update('commitgroq.model', selectedModel.label, ConfigurationTarget.Global);
            window.showInformationMessage(`Model "${selectedModel.label}" has been selected.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        window.showErrorMessage(`Failed to retrieve models from Groq: ${errorMessage}`);
    }
}