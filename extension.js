// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gitopener" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gitopener.openGitRepoInBrowser', async function () {
		let open;
		try {
			open = (await import('open')).default;
		} catch (e) {
			vscode.window.showErrorMessage('Failed to load the "open" module.');
			return;
		}

		let fileUri;
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			fileUri = editor.document.uri;
		} else {
			// Try to get the selected item in the explorer
			const selected = vscode.window.activeTextEditor ? [vscode.window.activeTextEditor.document.uri] : vscode.window.activeTextEditor;
			const resources = vscode.window.tabGroups?.activeTabGroup?.activeTab?.input?.uri
				? [vscode.window.tabGroups.activeTabGroup.activeTab.input.uri]
				: vscode.window.activeTextEditor
				? [vscode.window.activeTextEditor.document.uri]
				: [];
			const explorerSelection = vscode.window.activeTextEditor ? [vscode.window.activeTextEditor.document.uri] : [];
			const selectedResources = vscode.window.activeTextEditor ? [vscode.window.activeTextEditor.document.uri] : [];
			const selectedItems = vscode.window.activeTextEditor ? [vscode.window.activeTextEditor.document.uri] : [];

			const selectedUri = vscode.window.activeTextEditor?.document?.uri
				|| (vscode.window.tabGroups?.activeTabGroup?.activeTab?.input?.uri ?? null);

			if (selectedUri) {
				fileUri = selectedUri;
			} else if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
				// Fallback to the root of the current workspace
				fileUri = vscode.Uri.file(vscode.workspace.workspaceFolders[0].uri.fsPath);
			} else {
				vscode.window.showWarningMessage('No file, selection, or workspace found.');
				return;
			}
		}
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		if (!gitExtension) {
			vscode.window.showErrorMessage('Git extension not found.');
			return;
		}
		const api = gitExtension.getAPI(1);
		const repo = api.repositories.find(r => fileUri.fsPath.startsWith(r.rootUri.fsPath));
		if (!repo) {
			vscode.window.showWarningMessage('No git repository found for this file.');
			return;
		}
		const remotes = repo.state.remotes;
		const remote = remotes.find(r => r.fetchUrl && (r.fetchUrl.includes('github.com') || r.fetchUrl.includes('gitlab.com')));
		if (!remote) {
			vscode.window.showWarningMessage('No GitHub or GitLab remote found for this repository.');
			return;
		}
		let url = remote.fetchUrl;
		// Convert SSH to HTTPS if needed
		if (url.startsWith('git@')) {
			url = url.replace(':', '/').replace('git@', 'https://').replace('.git', '');
		} else if (url.startsWith('https://')) {
			url = url.replace('.git', '');
		}

		if (url.includes('github.com')) {
			url += '/actions';
		} else if (url.includes('gitlab.com')) {
			url += '/-/pipelines';
		}

		await open(url);
		vscode.window.showInformationMessage(`Opened repository: ${url}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
