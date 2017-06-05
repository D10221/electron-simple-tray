"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const create_debug_1 = require("./create-debug");
const util_1 = require("util");
const debug = create_debug_1.createDebug(""); // empy == top-level
const isDarwin = process.platform === "darwin";
/**
 * Emits whatever Tray emits + "top-icon", "quit-switch", "quit-button"
 */
class SimpleTray extends electron_1.Tray {
    constructor(_config) {
        super(_config.icon);
        this.quitting = false;
        /**
         * make the item emit(xKey) onClick if it didn't specified a
         * click-callback
         */
        this.setCallback = (o) => {
            const tray = this;
            o.click = o.click || (() => {
                debug("emit: " + o.xKey);
                tray.emit(o.xKey);
            });
            return o;
        };
        const tray = this;
        this.buildContextMenu = (partial) => {
            const config = {};
            Object.assign(config, _config, partial || {});
            tray.dontQuit = util_1.isNullOrUndefined(config.dontQuit) ? isDarwin : config.dontQuit;
            // tray.trayKey = config.trayKey || "app-tray";
            let items = (config.items || []).slice();
            const checkOverride = (item) => {
                const override = items.find(x => x.xKey === item.xKey);
                if (!util_1.isNullOrUndefined(override)) {
                    Object.assign(item, override);
                    // remove it so we dont add it twice
                    items = items.filter(x => x.xKey !== item.xKey);
                }
                return item;
            };
            let contextMenu;
            const menuOptions = [];
            const topIcon = checkOverride({
                xKey: SimpleTray.Keys.TOP_ICON,
                label: config.title,
                type: "normal",
                icon: config.icon,
                click: () => {
                    tray.emit(SimpleTray.Keys.TOP_ICON);
                    debug(`action: ${SimpleTray.Keys.TOP_ICON}`);
                }
            });
            const quitSwitch = checkOverride({
                xKey: SimpleTray.Keys.QUIT_SWITCH,
                label: "Dont Quit",
                type: "checkbox",
                click: () => __awaiter(this, void 0, void 0, function* () {
                    tray.dontQuit = !tray.dontQuit;
                    debug(`action: dont-quit: "quit-switch"`);
                    tray.emit(SimpleTray.Keys.QUIT_SWITCH);
                }),
                checked: tray.dontQuit === true
            });
            const quitButton = checkOverride({
                xKey: SimpleTray.Keys.QUIT_BUTTON,
                label: isDarwin ? "Quit" : "Exit",
                type: "normal",
                click: (_menuItem, _win, _event) => {
                    tray.quitting = true;
                    tray.emit(SimpleTray.Keys.QUIT_BUTTON);
                }
            });
            menuOptions.push(topIcon);
            if (!config.noQuitSwitch) {
                menuOptions.push(quitSwitch);
            }
            for (const o of items) {
                menuOptions.push(tray.setCallback(o));
            }
            menuOptions.push({
                type: "separator",
                xKey: "" // Not used
            }, quitButton);
            contextMenu = electron_1.Menu.buildFromTemplate(menuOptions);
            if (!util_1.isNullOrUndefined(config.toolTip)) {
                tray.setToolTip(config.toolTip);
            }
            tray.setContextMenu(contextMenu);
        };
        this.buildContextMenu();
    }
    get canQuit() {
        return !this.dontQuit || this.quitting;
    }
    /**
     * Subscribe to event key
     */
    subscribe(key, callback) {
        const _self = this;
        _self.on(key, callback);
        return {
            unsuscribe: () => _self.removeListener(key, callback)
        };
    }
}
/**
 * in-built MenuItemOption keys
 */
SimpleTray.Keys = {
    TOP_ICON: "top-icon",
    QUIT_SWITCH: "quit-switch",
    QUIT_BUTTON: "quit-button",
};
exports.SimpleTray = SimpleTray;
