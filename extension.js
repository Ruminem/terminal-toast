// SPDX-License-Identifier: Apache-2.0
'use strict';
const vscode = require('vscode');
const { body } = require('./format');
const { toast } = require('./toast');

/** Terminal or task execution object -> start time. ponytail: an entry leaks if a terminal closes mid-command; it is one number per such terminal. */
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

/**
 * Called for whatever just ended, terminal command or task alike.
 * @param {object} key the execution object it started with
 * @param {string} label @param {number|undefined} exitCode
 */
function finish(key, label, exitCode) {
  const at = started.get(key);
  // A task reports its process end and then the task end; only the first one gets here.
  if (at === undefined) return;
  started.delete(key);

  const ms = Date.now() - at;
  const config = vscode.workspace.getConfiguration('terminalToast');
  if (ms < config.get('minSeconds', 30) * 1000) return;
  // Nothing to announce while the window is right there in front of you.
  if (config.get('unfocusedOnly', true) && vscode.window.state.focused) return;

  notify(label, exitCode, ms);
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  context.subscriptions.push(
    vscode.window.onDidStartTerminalShellExecution((e) => started.set(e.execution, Date.now())),
    vscode.window.onDidEndTerminalShellExecution((e) => finish(e.execution, e.execution.commandLine.value, e.exitCode)),

    // Builds started from the Build command or an extension's task provider never touch a terminal.
    vscode.tasks.onDidStartTask((e) => {
      // A watch task ends when you stop it, which is not news.
      if (!e.execution.task.isBackground) started.set(e.execution, Date.now());
    }),
    vscode.tasks.onDidEndTaskProcess((e) => finish(e.execution, e.execution.task.name, e.exitCode)),
    vscode.tasks.onDidEndTask((e) => finish(e.execution, e.execution.task.name, undefined)),
    vscode.commands.registerCommand('terminalToast.test', () => notify('npm run build', 0, 95000))
  );
}

module.exports = { activate };
