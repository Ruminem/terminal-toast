// SPDX-License-Identifier: Apache-2.0
'use strict';
const vscode = require('vscode');
const { body } = require('./format');
const { toast } = require('./toast');

/** Terminal or task execution object -> start time. ponytail: an entry leaks if a terminal closes mid-command; it is one number per such terminal. */
const started = new Map();

/** @type {vscode.LogOutputChannel} Written to disk as well, so "nothing happened" can be told apart from "it was skipped". */
let log;

/** @param {string} command @param {number|undefined} exitCode @param {number} ms */
function notify(command, exitCode, ms) {
  // Shell integration reports undefined when it cannot tell; treat that as finished, not failed.
  const ok = exitCode === 0 || exitCode === undefined;
  const title = ok ? vscode.l10n.t('Command finished') : vscode.l10n.t('Command failed ({0})', String(exitCode));
  const text = body(command, ms);
  toast(title, text, log);
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
  const minSeconds = config.get('minSeconds', 30);
  const focused = vscode.window.state.focused;
  log.info(`ended: ${label} · ${Math.round(ms / 1000)}s · exit ${exitCode} · focused ${focused}`);

  if (ms < minSeconds * 1000) return log.info(`skipped: shorter than ${minSeconds}s`);
  // Nothing to announce while the window is right there in front of you.
  if (config.get('unfocusedOnly', true) && focused) return log.info('skipped: window has focus');

  notify(label, exitCode, ms);
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  log = vscode.window.createOutputChannel('Terminal Toast', { log: true });
  log.info('active');
  context.subscriptions.push(
    log,
    vscode.window.onDidStartTerminalShellExecution((e) => {
      log.info(`terminal started: ${e.execution.commandLine.value}`);
      started.set(e.execution, Date.now());
    }),
    vscode.window.onDidEndTerminalShellExecution((e) => finish(e.execution, e.execution.commandLine.value, e.exitCode)),

    // Builds started from the Build command or an extension's task provider never touch a terminal.
    vscode.tasks.onDidStartTask((e) => {
      log.info(`task started: ${e.execution.task.name} (background ${e.execution.task.isBackground})`);
      // A watch task ends when you stop it, which is not news.
      if (!e.execution.task.isBackground) started.set(e.execution, Date.now());
    }),
    vscode.tasks.onDidEndTaskProcess((e) => finish(e.execution, e.execution.task.name, e.exitCode)),
    vscode.tasks.onDidEndTask((e) => finish(e.execution, e.execution.task.name, undefined)),
    vscode.commands.registerCommand('terminalToast.test', () => notify('npm run build', 0, 95000))
  );
}

module.exports = { activate };
