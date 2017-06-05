/**
 * @see {Electron} Menu Item Callback
 */
export type MenuItemClickCallBack =
    (item: Electron.MenuItem, win: Electron.BrowserWindow, e: Electron.Event)
        => void;

/**
 * Extend MenuOption with a key
 */
export interface MenuOption extends Electron.MenuItemConstructorOptions {
    /**
     * event key, MenuItemConfig Key
     */
    xKey: string;
}

export interface TrayConfig {
    /**
     * tray-key, and to Icon event to emit
     */
    // trayKey: string;

    /**
     * Tay icon and Main Item Icon, must be small 16x16 is good
     * @required
     */
    icon: string;
    /**
     * Main/Top menu item label
     */
    title: string;

    /**
     * Tray Tool tip
     */
    toolTip?: string;
    /**
     * don't include
     * @default false
     */
    noQuitSwitch?: boolean;

    /**
     * New & Overrides, overrides work by simply ObjectAssign the preceding definitions,
     * on top of an Existing inbuilt {MenuItemConfig}
     * to override use inbuilt keys: ["quit-button", "quit-switch", "top-icon"]
     * when adding an extra optioon if click-callback is not specified
     * the item will emit(xKey)) on click
     */
    items?: MenuOption[];
    /**
     * dont quit button initial State,
     * @default isDarwin
     */
    dontQuit: boolean;
}