import * as React from "react";
import { renderToString } from "react-dom/server";

export interface IndexPageProps {
    /**
     * Window Title
     */
    title: string;
    /**
     * js src list
     */
    scripts: string[];
    /**
     * css href list
     */
    styles: string[];
}

/**
 * React Component to render 'index'
 */
export const IndexPage = (props: IndexPageProps) => {
    const { title, scripts, styles } = props;
    return (
        <html>
            <head>
                <title>{title}</title>
                <meta charSet="UTF-8" />
                {
                    styles.map((css, i) => (
                        <link key={`css_${i}`}
                            rel="stylesheet"
                            type="text/css"
                            href={css} />
                    ))
                }
            </head>
            <body>
                <div id="main"></div>
                {scripts.map((src, i) => (
                    <script key={`script_${i}`}
                        src={src} />
                ))}
            </body>
        </html>);
};

/**
 * to String
 */

/**
 * @param props Render HTML from props to string
 */
export const render = (props: IndexPageProps) => renderToString(< IndexPage {...props} />);

/**
 * To file....
 */

import * as fs from "fs";
import * as path from "path";
export interface RendertoFieProps extends IndexPageProps {
    /**
     * output directory
     */
    outDir: string;

    /**
     * output HTML FileName
     */
    fileName: string;
}

// prevent render twice
let _outPath: string;
/**
 * render 'HTML' to path.join(outDir, fileName) whet @see {render} returns
 * @returns joined path
 */
export const renderToFile = (props: RendertoFieProps) => {
    if (_outPath) return _outPath;
    const { title, scripts, styles } = props;
    _outPath = path.join(props.outDir, props.fileName);
    fs.writeFileSync(_outPath, render({ title, scripts, styles }));
    return _outPath;
};


