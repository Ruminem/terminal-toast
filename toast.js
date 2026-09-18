// SPDX-License-Identifier: Apache-2.0
'use strict';
const { execFile } = require('child_process');

/*
 * Windows has no notification API in VS Code, so the toast goes through PowerShell's
 * WinRT types. Text comes in through the environment: it is UTF-16 all the way, which
 * quoting a Korean command line into a -Command string is not.
 *
 * ponytail: shown under PowerShell's app id, so the toast says "Windows PowerShell".
 * VS Code's own id is not registered for notifications, and registering one means
 * writing a shortcut with an AppUserModelID into the Start menu.
 */
const APP_ID = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe';
const SCRIPT = `
$ErrorActionPreference = 'Stop'
$null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime]
$null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType=WindowsRuntime]
$esc = { param($s) [System.Security.SecurityElement]::Escape($s) }
$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml('<toast><visual><binding template="ToastGeneric"><text>' + (& $esc $env:TT_TITLE) +
  '</text><text>' + (& $esc $env:TT_BODY) + '</text></binding></visual></toast>')
$toast = New-Object Windows.UI.Notifications.ToastNotification $xml
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('${APP_ID}').Show($toast)
`;

/** @param {string} title @param {string} text */
function toast(title, text) {
  if (process.platform !== 'win32') return;
  execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', SCRIPT], {
    env: { ...process.env, TT_TITLE: title, TT_BODY: text },
    windowsHide: true,
    timeout: 10000,
  }, (err) => {
    // The in-app notification still fires, so a failed toast is worth a log line, not a popup.
    if (err) console.error('terminal-toast: toast failed -', err.message.split('\n')[0]);
  });
}

module.exports = { toast };
