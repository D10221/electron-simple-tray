import { BrowserWindow, } from "electron";
// Node
import { isNullOrUndefined as isNull } from "util";
import { renderToFile } from "./index-page";

let _win: Electron.BrowserWindow;
export const getWindow: () => Electron.BrowserWindow = () => {
    // return same window until disposed
    if (!isNull(_win)) return _win;
    // WINDOW:
    _win = new BrowserWindow({
        show: false,
        icon: "resources/favicon.ico",
        autoHideMenuBar: true,
        width: 480,
        height: 300
    });

    // renderToFile generates minimal html, to load the window script
    _win.loadURL("file:///" +
        renderToFile({
            title: "MyApp",
            /**
             * script name to be loaded by the rendered HTML file
             * will load index.js that simply 'require("window");
             * allowing Electron to bootstrap the  renderer environment
             * trying to load "window.js" directly will find "exports"
             * doesn't exists yet
             */
            scripts: ["index.js"],
            /**
             * Generated Styles
             */
            styles: ["styles/style.css"],
            /**
             * output directory to join in path
             */
            outDir: __dirname + "/../",
            /**
             * output html file name
             */
            fileName: "window.html"
        })
    );
    _win.on("close", () => {
        // dispose window
        _win.removeAllListeners();
        _win = null;
    });

    return _win;
};
