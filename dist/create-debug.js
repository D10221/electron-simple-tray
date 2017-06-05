"use strict";
/**
 * Internal
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
debug.formatters.e = (x) => `error: ${x}`;
debug.formatters.w = (x) => `warning: ${x}`;
/**
 *
 * @param subKey Create prefixed debugger
 */
exports.createDebug = (subKey) => debug("quick-tray:" + subKey);
