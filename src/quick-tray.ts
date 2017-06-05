import { Tray, Menu } from "electron";
import { createDebug } from "./create-debug";
import { isNullOrUndefined as isNull } from "util";
import { TrayConfig, MenuOption } from "./types";

const debug = createDebug(""); // empy == top-level
const isDarwin = process.platform === "darwin";

/**
 * Emits whatever Tray emits + "top-icon", "quit-switch", "quit-button"
 */
export class SimpleTray extends Tray {

    /**
     * in-built MenuItemOption keys
     */
    static Keys = {
        TOP_ICON: "top-icon",
        QUIT_SWITCH: "quit-switch",
        QUIT_BUTTON: "quit-button",
    };

    // trayKey: string;
    dontQuit: boolean;
    quitting = false;
    get canQuit() {
        return !this.dontQuit || this.quitting;
    }
    /**
     * Bulds and Set ContextMenu
     */
    buildContextMenu: (partial?: Partial<TrayConfig>) => void;
    constructor(
        _config: TrayConfig,
    ) {
        super(_config.icon);
        const tray = this;

        this.buildContextMenu = (partial?: Partial<TrayConfig>) => {
            const config: TrayConfig = {} as any;
            Object.assign(config, _config, partial || {});

            tray.dontQuit = isNull(config.dontQuit) ? isDarwin : config.dontQuit;

            // tray.trayKey = config.trayKey || "app-tray";
            let items = (config.items || []).slice();

            const checkOverride = (item: MenuOption) => {
                const override = items.find(x => x.xKey === item.xKey);
                if (!isNull(override)) {
                    Object.assign(item, override);
                    // remove it so we dont add it twice
                    items = items.filter(x => x.xKey !== item.xKey);
                }
                return item;
            };

            let contextMenu: Electron.Menu;
            const menuOptions: MenuOption[] = [];

            const topIcon: MenuOption = checkOverride({
                xKey: SimpleTray.Keys.TOP_ICON,
                label: config.title,
                type: "normal",
                icon: config.icon,
                click: () => {
                    tray.emit(SimpleTray.Keys.TOP_ICON);
                    debug(`action: ${SimpleTray.Keys.TOP_ICON}`);
                }
            });

            const quitSwitch: MenuOption = checkOverride({
                xKey: SimpleTray.Keys.QUIT_SWITCH,
                label: "Dont Quit",
                type: "checkbox",
                click: async () => {
                    tray.dontQuit = !tray.dontQuit;
                    debug(`action: dont-quit: "quit-switch"`);
                    tray.emit(SimpleTray.Keys.QUIT_SWITCH);
                },
                checked: tray.dontQuit === true
            });

            const quitButton: MenuOption = checkOverride(
                {
                    xKey: SimpleTray.Keys.QUIT_BUTTON,
                    label: isDarwin ? "Quit" : "Exit",
                    type: "normal",
                    click: (_menuItem: Electron.MenuItem, _win: Electron.BrowserWindow, _event: Event) => {
                        tray.quitting = true;
                        tray.emit(SimpleTray.Keys.QUIT_BUTTON);
                    }
                }
            );

            menuOptions.push(topIcon);

            if (!config.noQuitSwitch) {
                menuOptions.push(quitSwitch);
            }

            for (const o of items) {
                menuOptions.push(tray.setCallback(o));
            }

            menuOptions.push(
                {
                    type: "separator",
                    xKey: "" // Not used
                },
                quitButton
            );

            contextMenu = Menu.buildFromTemplate(menuOptions);

            if (!isNull(config.toolTip)) {
                tray.setToolTip(config.toolTip);
            }

            tray.setContextMenu(contextMenu);
        };

        this.buildContextMenu();
    }

    /**
     * make the item emit(xKey) onClick if it didn't specified a
     * click-callback
     */
    setCallback = (o: MenuOption)
        : MenuOption => {
        const tray = this;
        o.click = o.click || (() => {
            debug("emit: " + o.xKey);
            tray.emit(o.xKey);
        });
        return o;
    }

    /**
     * Subscribe to event key
     */
    subscribe(key: string, callback: (...args: any[]) => void) {
        const _self = (this as Electron.EventEmitter);
        _self.on(key, callback);
        return {
            unsuscribe: () => _self.removeListener(key, callback)
        };
    }
}
