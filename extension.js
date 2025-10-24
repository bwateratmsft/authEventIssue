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
        outputChannel.debug(`Authentication sessions changed for provider: ${e.provider.id}`);
    });

    vscode.commands.registerCommand('extension.signIn', async () => {
        await vscode.authentication.getSession('microsoft', [], { createIfNone: true, clearSessionPreference: true });
    });

    vscode.commands.registerCommand('extension.parallelGetSessions', async () => {
        const accounts = await vscode.authentication.getAccounts('microsoft');
        outputChannel.info(`Found ${accounts.length} accounts`);

        const sessionPromises = accounts.map(async account => {
            const session = await vscode.authentication.getSession('microsoft', [], { silent: true, account });

            if (session) {
                outputChannel.info(`Found session for account: ${account.label}`);
                outputChannel.info(`Session's account label: ${session.account.label}`);
                if (account.label.toLowerCase() !== session.account.label.toLowerCase()) {
                    outputChannel.error(`Account label mismatch: ${account.label} !== ${session.account.label}`);
                }
            } else {
                outputChannel.error(`No session found for account: ${account.label}`);
            }
        });

        await Promise.all(sessionPromises);
    });
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
