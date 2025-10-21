/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const vscode = require('vscode');

function activate() {
    const outputChannel = vscode.window.createOutputChannel('Auth provider tests', { log: true });

    vscode.authentication.onDidChangeSessions(async (e) => {
        outputChannel.warn(`Authentication sessions changed for provider: ${e.provider.id}`);
    });

    vscode.commands.registerCommand('extension.testGetAccounts', async () => {
        outputChannel.info('Testing get accounts...');
        const accounts = await vscode.authentication.getAccounts('microsoft');
        outputChannel.info(`Found ${accounts.length} accounts.`);
    });

    vscode.commands.registerCommand('extension.testGetSessionWithCreate', async () => {
        outputChannel.info('Testing get session with createIfNone...');
        const session = await vscode.authentication.getSession('microsoft', [], { createIfNone: true });
        outputChannel.info(`Got session: ${session.id}`);
    });

    vscode.commands.registerCommand('extension.testGetSessionSilently', async () => {
        outputChannel.info('Testing get session silently...');
        const session = await vscode.authentication.getSession('microsoft', [], { createIfNone: false, silent: true });

        if (session) {
            outputChannel.info(`Got session: ${session.id}`);
        } else {
            outputChannel.info('No session found.');
        }
    });
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
