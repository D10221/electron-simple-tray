/**
 * Single Window
 */

import { BrowserWindow, ipcMain } from "electron";
import { AppConfig } from "../common/types";
import * as createDebug from "debug";
import { API } from "../common/events";
import { isNullOrUndefined as isNull } from "util";
import { LocalStorage } from "./local-storage";
const debug = createDebug("app:config");

// Storage
const store = new LocalStorage("app-config");

/*
    INTERNAL
 */

const state: AppConfig = {} as any;

const isValid = (s: AppConfig) => {
    return !isNull(s)
        && !isNull(s.dontQuit);
};

const validate = async (): Promise<void> => {
    if (!isValid(state)) {
        const value = await store.getItem().catch(e => {
            debug("WARNING: ", e.message);
            return {};
        });
        Object.assign(state, value);
    }
};

/**
 * Update current state ,update store and notify changed
 */
const update = async (u: Partial<AppConfig>): Promise<void> => {
    debug(`dont quit:`, u);
    Object.assign(state, u);
    if (!isValid(state)) { throw new Error("Invalid State"); }
    await store.setItem(state);
    notifyChanged();
};

/**
 * Notify who requested the update or notify all if anonymous
 */
const notifyChanged = (wc?: Electron.WebContents) => {
    debug(`sending: ${API.CONFIG.CHANGED}:`, state);
    // nootify who requested the update
    if (wc) {
        wc.send(API.CONFIG.CHANGED, state);
        return;
    }
    // OR notify all
    for (const win of BrowserWindow.getAllWindows()) {
        const w = win.webContents;
        if (w) {
            w.send(API.CONFIG.CHANGED, state);
        }
    }
    ipcMain.emit(API.CONFIG.CHANGED, state);
};

/**
 * Events API subscription
 */
ipcMain.on(API.CONFIG.GET, async (e: Electron.Event, args: any[]) => {
    debug("GET: %s" + API.CONFIG.GET, args);
    notifyChanged(e.sender);
});

ipcMain.on(API.CONFIG.SET, async (_event: Electron.Event, args: any[]) => {
    const partial: Partial<AppConfig> = args[0];
    debug("SET: ", partial);
    await update(partial);
});

/**
 * Export get config
 */
export const get = async (): Promise<AppConfig> => {
    await validate();
    return state;
};

/**
 * Export set config, accept partial
 */
export const set = async (x: Partial<AppConfig>) => {
    await validate();
    return update(x);
};
