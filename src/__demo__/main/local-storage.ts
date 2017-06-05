import * as fs from "fs";
import * as path from "path";
import * as electron from "electron";
import * as createDebug from "debug";
import * as mpkdir from "mkdirp";
import { isNullOrUndefined as isNull } from "util";
const debug = createDebug("local-storage");

const userDataPath = electron.app.getPath("userData");
interface JsonResult { data?: any; error?: Error; }

/**
 * JSON.parse inside a try/catch
 *  Because of uncatchable inside the promise
 * @param json stirng to parse
 */
function fromJSON(json: string): JsonResult {
    try {
        return { data: JSON.parse(json) };
    } catch (error) {
        return { error };
    }
}

/**
 * JSON local storage
 */
export class LocalStorage {
    static storagePrefix = "json-local-storage";
    static location = () => path.join(userDataPath, LocalStorage.storagePrefix);
    constructor(private storeName: string) {

        debug("localpath: ", this.localPath);

        const _self = this;

        this.getItem = () => new Promise((resolve, reject) => {
            try {
                fs.readFile(_self.localPath, "utf-8", (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // Can't catch JSON parse errors here
                    const result = fromJSON(data);
                    if (!isNull(result.error)) {
                        reject(result.error);
                        return;
                    }

                    debug("read: ", _self.localPath);
                    resolve(result.data);
                });
            } catch (e) {
                debug("ERROR: ", e.message);
                reject(e);
            }
        });
    }
    get localPath(): string {
        return path.resolve(
            LocalStorage.location(),
            `${this.storeName}.json`);
    }
    getItem: () => Promise<any>;
    setItem = (data: any) => {
        const _self = this;
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(
                    _self.localPath,
                    JSON.stringify(data),
                    (error) => {
                        if (error) { reject(error); return; }
                        debug("write: ", _self.localPath);
                        resolve();
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    clear = () => this.setItem({});
}

mpkdir.sync(LocalStorage.location());