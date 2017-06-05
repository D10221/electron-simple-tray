"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const quick_tray_1 = require("./quick-tray");
const subscription_1 = require("./subscription");
const create_debug_1 = require("./create-debug");
const debug = create_debug_1.createDebug("subscribe:");
/**
 * Prevent Window from closing if Tray said so
 * @param win Manage Single Window
 * @param tray;
 */
exports.subscribe = (tray, getWindow) => {
    debug("subscribing...");
    // Tray's Top Item Click
    const focus = () => {
        const win = getWindow();
        debug("focus: window: #%s", win.id);
        if (win.isVisible()) {
            debug("Focus Visible");
            win.focus();
            return;
        }
        debug("not visible, just created?");
        win.once("ready-to-show", win.show);
    };
    // Tray's Top Item Click
    // trayKey is set when creating the tray
    // implements focus
    const onTopIconClick = tray.subscribe(quick_tray_1.SimpleTray.Keys.TOP_ICON, focus);
    // On Quit, app.quit
    const onQuitClick = tray.subscribe(quick_tray_1.SimpleTray.Keys.QUIT_BUTTON, () => {
        electron_1.app.quit();
    });
    // subscription
    const unsubscribe = () => {
        // ...
        debug("unsubscribing");
        onTopIconClick.unsuscribe();
        onQuitClick.unsuscribe();
    };
    return subscription_1.subscription(unsubscribe);
};
