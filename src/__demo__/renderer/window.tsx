
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppConfig } from "../common/types";
import { API } from "../common/events";

import { subscribe, send } from "./ipc";
interface AppProps {
    appConfig?: AppConfig;
}

class App extends React.Component<AppProps, AppConfig> {
    constructor(props?: AppProps, context?: any) {
        super(props, context);
        this.state = props.appConfig || {} as any;
    }
    subscription: { unsubscribe: () => void };
    componentWillMount() {
        this.subscription =
            // subscribe to udpates
            subscribe(API.CONFIG.CHANGED, (_event: Electron.Event, args: any[]) => {
                const config: AppConfig =
                    Array.isArray(args) && args.length ? ( args[0] || {}) : args;
                this.setState(config);
            });
        // request-get
        send(API.CONFIG.GET);
    }
    componentWillUnmount() {
        // remove listener
        this.subscription.unsubscribe();
    }

    /**
     * Action
     */
    closeWindow = () => {
        // send current window?
        send(API.WINDOW.CLOSE);
    }

    /**
     * Action
     */
    handleDontQuitChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const dontQuit = (e.target as HTMLInputElement).checked;
        // API.CONFIG.SET expects partial AppConfig
        console.log("sending: dontQuit: %s", dontQuit);
        send(API.CONFIG.SET, { dontQuit });
    }

    render() {
        const { dontQuit } = this.state;
        return <div style={{ margin: "15px" }}>
            <div className="row ">
                <div className="column ">
                    <h3> Settings </h3>
                </div>
            </div>
            <div className="row ">
                <div className="column ">
                    <div className="item">
                        <input type="checkbox"
                            id="dontQuit"
                            checked={dontQuit}
                            onChange={this.handleDontQuitChanged} />
                        <label className="label-inline" htmlFor="dontQuit">
                            Dont Quit:
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="column" style={{ margin: "5px" }}>
                    <button
                        className="button button-outline"
                        onClick={this.closeWindow}>OK</button>
                </div>
            </div>
        </div>;
    }
}
ReactDOM.render(<App />, document.getElementById("main"));
