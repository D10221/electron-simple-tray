#!/usr/bin/env node
const shell = require("shelljs");
process.exit(
    shell.exec(
        "rimraf built && tsc -p . && node-sass ./src -o ./built")
);