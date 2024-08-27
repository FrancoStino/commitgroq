import * as vscode from "vscode";
import type { GitExtension, Repository } from "./types/git";
import { getCommitMessage, getSummary } from "./generator";
import { getApiKey, saveApiKey, resetApiKey } from "./types/apiKeyManager";


export function activate(context: vscode.ExtensionContext) {
	// Comando per creare un commit e poi eseguire il comando per salvare la API key
	const createCommitDisposable = vscode.commands.registerCommand("commitgroq.createCommit", async (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage("Unable to load Git Extension");
			return;
		}

		if (uri) {
			const uriPath = uri._rootUri?.path || uri.rootUri.path;
			const selectedRepository = git.repositories.find((repository) => {
				return repository.rootUri.path === uriPath;
			});
			if (selectedRepository) {
				await createCommitMessage(context, selectedRepository);
			}
		} else {
			for (const repo of git.repositories) {
				await createCommitMessage(context, repo);
			}
		}

		// Esegui il comando per salvare la API key, se necessario
		// Controlla se la API key è già stata salvata
		const existingApiKey = await getApiKey(context);
		if (existingApiKey) {
			return;
		}

		// Chiedi all'utente di inserire la API key
		const apiKey = await vscode.window.showInputBox({
			prompt: 'Insert your API Key',
			ignoreFocusOut: true,
			password: true
		});

		if (apiKey) {
			// Salva la API key nel secret storage
			await saveApiKey(context, apiKey);
			vscode.window.showInformationMessage('API Key successfully saved!');
		}
	});


	// Comando per resettare la API key
	const resetApiKeyDisposable = vscode.commands.registerCommand('commitgroq.resetGroqApiKey', async () => {
		// Mostra un messaggio prima di procedere
		const confirm = await vscode.window.showInformationMessage(
			'Are you sure you want to reset your API Key?',
			{ modal: true },
			'Yes'
		);

		if (confirm === 'Yes') {
			// Esegui il reset della API key
			await resetApiKey(context);

			// Mostra un messaggio di successo al termine dell'esecuzione
			vscode.window.showInformationMessage('API Key is reset!');
		}
	});

	// Aggiungi tutti i comandi alle subscriptions del contesto
	context.subscriptions.push(createCommitDisposable, resetApiKeyDisposable);
}

async function getSummaryUriDiff(context: vscode.ExtensionContext, repo: Repository, uri: string) {
	const diff = await repo.diffIndexWithHEAD(uri);
	const summary = await getSummary(context, diff);
	return summary;
}

async function createCommitMessage(context: vscode.ExtensionContext, repo: Repository) {
	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.SourceControl,
			cancellable: false,
			title: "Loading commit message",
		},
		async () => {
			vscode.commands.executeCommand("workbench.view.scm");
			try {
				const ind = await repo.diffIndexWithHEAD();

				if (ind.length === 0) {
					throw new Error(
						"No changes to commit. Please stage your changes first.",
					);
				}

				const callbacks = ind.map((change) =>
					getSummaryUriDiff(context, repo, change.uri.fsPath),
				);
				const summaries = await Promise.all(callbacks);

				const commitMessage = await getCommitMessage(context, summaries);
				repo.inputBox.value = commitMessage;

				// TODO: Update dinamically the models "properties" => "commitgroq.model"

				// biome-ignore lint/suspicious/noExplicitAny: no-explicit-any for error handling
			} catch (error: any) {
				if (error?.message) {
					vscode.window.showErrorMessage(error.message);
				}
			}
		},
	);
}

function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
	const gitExtension = vscodeGit?.exports;
	return gitExtension?.getAPI(1);
}

export function deactivate() { }