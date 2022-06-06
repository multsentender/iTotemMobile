import { ILogAppender, LogLevel } from "./Logger";
const R7Insight = require("../../../../js/r7insight.min.js")

export interface IR7InsightConfig {
    token: string;
    region: string;    
}

interface IR7Insight {
    init(config: IR7InsightConfig) : void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}

interface ILogMethod {
    (...data: any[]): void
}
declare global {
    interface Window {
        R7Insight: IR7Insight;
    }
}
export class R7InsightAppender implements ILogAppender {

    private R7Insight : IR7Insight;// = null;

    constructor(config: IR7InsightConfig) {
        this.R7Insight = R7Insight;//window.R7Insight;
        this.R7Insight.init(config);
    }
    
    log(message: string, logLevel: LogLevel) : void {
        let logMethod : ILogMethod;// = null;
        switch (logLevel) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
                logMethod = this.R7Insight.log;
                break;
            case LogLevel.INFO:
                logMethod = this.R7Insight.info;
                break;
            case LogLevel.WARN:
                logMethod = this.R7Insight.warn;
                break;
            case LogLevel.ERROR:
                logMethod = this.R7Insight.error;
                break;
            default:
                throw new Error("Unsupported log level: " + logLevel);
        }
        logMethod(message);
    }

}