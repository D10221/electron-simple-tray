import { SimpleTray } from "./quick-tray";
/**
 * Prevent Window from closing if Tray said so
 * @param win Manage Single Window
 * @param tray;
 */
export declare const subscribe: (tray: SimpleTray, getWindow: () => Electron.BrowserWindow) => {
    isUnsubscribed: () => boolean;
    unsubscribe: () => void;
};
