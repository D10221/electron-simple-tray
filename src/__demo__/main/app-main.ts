// Electron
import { app, ipcMain } from "electron";
import { isNullOrUndefined as isNull } from "util";

// Demo
import * as appConfig from "./app-config";
import { toggleDevTools } from "./toggle-dev-tools";
import { API } from "../common/events";

// Lib
import { SimpleTray, subscribe as subscribeTray } from "../../";

// Debug
import * as createDebug from "debug";

// App Windopw: creates a window if disposed
import { getWindow } from "./app-window";

const debug = createDebug("app");

let tray: SimpleTray;

app.once("ready", async () => {

    debug("ready");

    const isDarwin = process.platform === "darwin";
    const dontQuit = ((await appConfig.get()).dontQuit || isDarwin);
    const icon = "resources/icon-16x16.png";

    tray = new SimpleTray({

        // trayKey: "my-tray", // used as top-icon emit(key)

        /**
         * tray icon and main/top item icon,
         * small 16x16 icon serves both
         */
        icon,
        title: "My App Title", // Tray top icon label
        toolTip: "My App tiny description", // Tray Tooltip,
        /**
         * Stay on tray when all window closed
         */
        dontQuit,
        /**
         * New & Overrides, overrides work by simply ObjectAssign the preceding definitions,
         * on top of an Existing inbuilt {MenuItemConfig}
         */
        items: [
            // new MenuItem
            {
                xKey: "dev-tools",
                label: "Dev Tools",
                type: "checkbox",
                checked: false,
                click: toggleDevTools
            },
            // uncomment to Override: Label
            {
                xKey: "quit-button",
                label: "Quit !!!" // default label is "Exit" on windows "Quit" on Darwin
            },
            // uncomment to Override: icon
            {
                xKey: "quit-switch",
                // icon
                // click: config.toggleDontQuit
            },
            // uncomment to Override:
            {
                xKey: "top-icon",
                // default: focus
                // click: () => { console.log("Hello top-icon click!"); }
            }
        ],
        // uncomment next line and user can't toggle "Stay in Tray"
        // noQuitSwitch: true
    });

    // tray toggled "dontQuit"
    tray.subscribe(SimpleTray.Keys.QUIT_SWITCH, () => {
        appConfig.set({ dontQuit: tray.dontQuit });
    });

    // subscribe to app config changed
    ipcMain.on(API.CONFIG.CHANGED, (config: any) => {
        // if changed
        if (config && !isNull(config.dontQuit) && config.dontQuit !== tray.dontQuit) {
            // rebuild menu
            tray.buildContextMenu(
                // partial TrayConfig to override
                { dontQuit: config.dontQuit });
        }
    });

    // getWindow returns the same window until is closed
    // then returns a new one
    const win = getWindow();
    ipcMain.on(API.WINDOW.CLOSE, () => {
        // todo: args.find(x=> window).close()
        win.close();
    });

    win.once("ready-to-show", () => {
        // subscribe to tray events, "quit", "focus"
        subscribeTray(tray, getWindow);
        win.show();
    });
});

app.on("window-all-closed", () => {
    if (tray.canQuit) {
        app.quit();
        debug("app quitting...");
        return;
    }
});
