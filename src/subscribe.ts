import { app } from "electron";
import { SimpleTray } from "./quick-tray";
import { subscription } from "./subscription";
import { createDebug } from "./create-debug";
const debug = createDebug("subscribe:");

/**
 * Prevent Window from closing if Tray said so
 * @param win Manage Single Window
 * @param tray;
 */
export const subscribe = (tray: SimpleTray, getWindow: () => Electron.BrowserWindow) => {
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
    const onTopIconClick = tray.subscribe(SimpleTray.Keys.TOP_ICON, focus);

    // On Quit, app.quit
    const onQuitClick = tray.subscribe(SimpleTray.Keys.QUIT_BUTTON, () => {
        app.quit();
    });

    // subscription
    const unsubscribe = () => {
        // ...
        debug("unsubscribing");
        onTopIconClick.unsuscribe();
        onQuitClick.unsuscribe();
    };

    return subscription(unsubscribe);
};
