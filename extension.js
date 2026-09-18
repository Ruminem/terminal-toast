// SPDX-License-Identifier: Apache-2.0
'use strict';
const vscode = require('vscode');
const { body } = require('./format');
const { toast } = require('./toast');

/** Execution object -> start time. ponytail: an entry leaks if a terminal closes mid-command; it is one number per such terminal. */
const started = new Map();

/** @param {string} command @param {number|undefined} exitCode @param {number} ms */
function notify(command, exitCode, ms) {
  // Shell integration reports undefined when it cannot tell; treat that as finished, not failed.
  const ok = exitCode === 0 || exitCode === undefined;
  const title = ok ? vscode.l10n.t('Command finished') : vscode.l10n.t('Command failed ({0})', String(exitCode));
  const text = body(command, ms);
  toast(title, text);
  const line = `${title} — ${text}`;
  if (ok) vscode.window.showInformationMessage(line);
  else vscode.window.showWarningMessage(line);
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  context.subscriptions.push(
    vscode.window.onDidStartTerminalShellExecution((e) => started.set(e.execution, Date.now())),
    vscode.window.onDidEndTerminalShellExecution((e) => {
      const at = started.get(e.execution);
      started.delete(e.execution);
      if (at === undefined) return;

      const ms = Date.now() - at;
      const config = vscode.workspace.getConfiguration('terminalToast');
      if (ms < config.get('minSeconds', 30) * 1000) return;
      // Nothing to announce while the window is right there in front of you.
      if (config.get('unfocusedOnly', true) && vscode.window.state.focused) return;

      notify(e.execution.commandLine.value, e.exitCode, ms);
    }),
    vscode.commands.registerCommand('terminalToast.test', () => notify('npm run build', 0, 95000))
  );
}

module.exports = { activate };
