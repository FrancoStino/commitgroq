import * as vscode from "vscode";
import type { GitExtension, Repository } from "./types/git";
import { getCommitMessage, getSummary } from "./generator";
import { resetApiKey } from "./types/apiKeyManager";
import { getModels } from './types/getModels';

export function activate(context: vscode.ExtensionContext) {
	const createCommitDisposable = vscode.commands.registerCommand("commitgroq.createCommit", async (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage("Unable to load Git Extension");
			return;
		}

		if (uri) {
			const uriPath = uri._rootUri?.path || uri.rootUri.path;
			const selectedRepository = git.repositories.find((repository) => repository.rootUri.path === uriPath);
			if (selectedRepository) {
				await createCommitMessage(context, selectedRepository);
			}
		} else {
			for (const repo of git.repositories) {
				await createCommitMessage(context, repo);
			}
		}

	});

	const resetApiKeyDisposable = vscode.commands.registerCommand('commitgroq.resetGroqApiKey', async () => {
		await resetApiKey(context);
	});

	const getModelsDisposable = vscode.commands.registerCommand('commitgroq.getModels', async () => {
		await getModels(context);
	});

	context.subscriptions.push(createCommitDisposable, resetApiKeyDisposable, getModelsDisposable);
}

async function getSummaryUriDiff(context: vscode.ExtensionContext, repo: Repository, uri: string) {
	const diff = await repo.diffIndexWithHEAD(uri);
	return await getSummary(context, diff);
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
					throw new Error("No changes to commit. Please stage your changes first.");
				}

				const summaries = await Promise.all(ind.map((change) => getSummaryUriDiff(context, repo, change.uri.fsPath)));
				const commitMessage = await getCommitMessage(context, summaries);
				repo.inputBox.value = commitMessage;
			} catch (error: any) {
				if (error?.message) {
					vscode.window.showErrorMessage(error.message);
				}
			}
		}
	);
}

function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
	return vscodeGit?.exports?.getAPI(1);
}

export function deactivate() { }