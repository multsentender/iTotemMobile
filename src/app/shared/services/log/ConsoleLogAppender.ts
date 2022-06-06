import { ILogAppender, LogLevel } from "./Logger";

interface ConsoleLogMethod {
    (...data: any[]): void
}

export class ConsoleLogAppender implements ILogAppender {
    
    log(message: string, logLevel: LogLevel) : void {
        let consoleMethod : ConsoleLogMethod | null = null;
        switch (logLevel) {
            case LogLevel.TRACE:
                consoleMethod = console.trace;
                break;
            case LogLevel.DEBUG:
                consoleMethod = console.debug;
                break;
            case LogLevel.INFO:
                consoleMethod = console.info;
                break;
            case LogLevel.WARN:
                consoleMethod = console.warn;
                break;
            case LogLevel.ERROR:
                consoleMethod = console.error;
                break;
            default:
                throw new Error("Unsupported log level: " + logLevel);
        }
        consoleMethod(message);
    }

}