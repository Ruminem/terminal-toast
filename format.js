// SPDX-License-Identifier: MIT
'use strict';

/** @param {number} ms */
function elapsed(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return s % 60 ? `${m}m ${s % 60}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
}

/**
 * One line for the notification: where it ran, what ran, and how long it took.
 * The folder comes first because with several windows open that is the part you look for.
 * @param {string} command @param {number} ms @param {string} [where] workspace name, absent outside one
 */
function body(command, ms, where) {
  const one = command.trim().replace(/\s+/g, ' ');
  const short = one.length > 60 ? one.slice(0, 59) + '…' : one;
  return `${where ? where + ' · ' : ''}${short} · ${elapsed(ms)}`;
}

module.exports = { elapsed, body };
