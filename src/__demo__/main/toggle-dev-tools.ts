import { MenuItemClickCallBack } from "../../"; // lib types
import { BrowserWindow } from "electron";

/**
 * Single Window toggleDevTools Callback
 */
export const toggleDevTools: MenuItemClickCallBack = (item: Electron.MenuItem, w: Electron.BrowserWindow) => {
    w = w || BrowserWindow.getAllWindows()[0];
    if (!w.isVisible()) { w.show(); }
    const isOpen = w.webContents.isDevToolsOpened();
    !isOpen
        ? w.webContents.openDevTools()
        : w.webContents.closeDevTools();
    item.checked = !isOpen;
};
