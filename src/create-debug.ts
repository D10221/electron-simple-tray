/**
 * Internal
 */

import * as debug from "debug";
debug.formatters.e = (x: any) => `error: ${x}`;
debug.formatters.w = (x: any) => `warning: ${x}`;

/**
 *
 * @param subKey Create prefixed debugger
 */
export const createDebug = (subKey: string) => debug("simple-tray:" + subKey);