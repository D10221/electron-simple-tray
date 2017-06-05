import { Tray } from "electron";
import { TrayConfig, MenuOption } from "./types";
/**
 * Emits whatever Tray emits + "top-icon", "quit-switch", "quit-button"
 */
export declare class SimpleTray extends Tray {
    /**
     * in-built MenuItemOption keys
     */
    static Keys: {
        TOP_ICON: string;
        QUIT_SWITCH: string;
        QUIT_BUTTON: string;
    };
    dontQuit: boolean;
    quitting: boolean;
    readonly canQuit: boolean;
    /**
     * Bulds and Set ContextMenu
     */
    buildContextMenu: (partial?: Partial<TrayConfig>) => void;
    constructor(_config: TrayConfig);
    /**
     * make the item emit(xKey) onClick if it didn't specified a
     * click-callback
     */
    setCallback: (o: MenuOption) => MenuOption;
    /**
     * Subscribe to event key
     */
    subscribe(key: string, callback: (...args: any[]) => void): {
        unsuscribe: () => Electron.EventEmitter;
    };
}
