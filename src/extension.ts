import * as vscode from "vscode";
import type { GitExtension, Repository } from "./types/git";
import { getCommitMessage, getSummary } from "./generator";
import { resetApiKey } from "./types/apiKeyManager";
import { getModels } from './types/getModels';

export function activate(context: vscode.ExtensionContext) {
	// Register the commit message generator command
	const generateCommitMessageDisposable = vscode.commands.registerCommand('commitgroq.createCommit', async () => {
		try {
			const git = getGitExtension();
			if (!git) {
				throw new Error("Unable to load Git Extension");
			}

			const repo = git.repositories[0]; // Use the first repository
			if (!repo) {
				throw new Error("Repository not found");
			}

			const ind = await repo.diffIndexWithHEAD();

			if (ind.length === 0) {
				throw new Error("No changes to commit. Please stage your changes first.");
			}

			const summaries = await Promise.all(
				ind.map((change) => getSummaryUriDiff(context, repo, change.uri.fsPath))
			);

			const message = await getCommitMessage(context, summaries);
			if (message) {
				repo.inputBox.value = message;
			}
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message || "Error generating commit message");
		}
	});

	context.subscriptions.push(generateCommitMessageDisposable);

	const resetApiKeyDisposable = vscode.commands.registerCommand('commitgroq.resetGroqApiKey', async () => {
		await resetApiKey(context);
	});

	const getModelsDisposable = vscode.commands.registerCommand('commitgroq.getModels', async () => {
		await getModels(context);
	});

	context.subscriptions.push(resetApiKeyDisposable, getModelsDisposable);
}

async function getSummaryUriDiff(context: vscode.ExtensionContext, repo: Repository, uri: string) {
	const diff = await repo.diffIndexWithHEAD(uri);
	return await getSummary(context, diff);
}

function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
	return vscodeGit?.exports?.getAPI(1);
}

export function deactivate() { }