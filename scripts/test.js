#!/usr/bin/env node

// "export NODE_ENV=test ",
// "export DEBUG=\"mini-shell:*\" ",
// "npm run build && node_modules/.bin/electron-mocha ./built/__test__/**/*.test.js"

/**
 * test launcher
 * export WINDOW_STATE_HOME=$HOME/tmp
 */

const fs = require("fs");
const path = require("path");
// const isNull = require("util").isNullOrUndefined;

const getFlag = (key) => {
    const args = process.argv.slice(2);
    const i = args.indexOf(key);
    return (i === -1) ? false : args[i + 1];
};

const isWindows = process.platform === "win32";

const platFormMocha = isWindows
    ? "node_modules\\.bin\\mocha.cmd"
    : "node_modiules/.bin/mocha";

/**
 * @param arg {string}
 */
const isOff = (arg) => {    
    return ["false", "off", "no"].indexOf((arg||"").toLowerCase()) !== -1;
}

const isDebug = !isOff(getFlag("--debug"));
const isBuild = !isOff(getFlag("--build"));

const build = isBuild ? "npm run build" : "";

const cmds = [
    `${build}`,
    `${platFormMocha} ./built/__test__/**/*.test.js`
]
    .filter(x => x.trim() !== "")
    .join(" &&");
// run
const shell = require("shelljs");

shell.env.DEBUG = isDebug ? "quick-tray:*" : "";
shell.env.DEBUG_COLORS = isDebug;
shell.env.NODE_ENV = "test";
process.exit(shell.exec(cmds, {}).code);  