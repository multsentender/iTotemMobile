import { StringUtils } from "../../utils/StringUtils";

export interface ILogger {

    name() : string;
    trace(...data: any[]) : void;
    debug(...data: any[]) : void;
    info(...data: any[]) : void;
    warn(...data: any[]) : void;
    error(...data: any[]) : void;
    log(logLevel: LogLevel, ...data: any[]) : void;

}

export enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    NONE = 10
}

export interface ILogAppender {

    log(message: string, logLevel: LogLevel): void;

}

export interface ILogLevelConfig {
    pattern: string;
    logLevel: LogLevel;
}

export interface ILoggerUserIdGetter {
    (): string;
}

export interface ILoggerConfig {
    appenders: ILogAppender[];
    logLevels: ILogLevelConfig[];
    currentUserIdGetter?: ILoggerUserIdGetter;
}

export interface ILogFactory {
    get(name: string) : ILogger;
    init(config: ILoggerConfig): void;
}

export /*declare*/ let Log : ILogFactory;

class Logger implements ILogger {

    private _name: string;
    private _factory: LoggerFactory;
    private _minLogLevel: LogLevel | null = null;

    constructor(name: string, factory: LoggerFactory) {
        this._name = name;
        this._factory = factory;
    }

    name(): string {
        return this._name;
    }

    trace(...data: any[]): void {
        this.log(LogLevel.TRACE, data);
    }

    debug(...data: any[]): void {
        this.log(LogLevel.DEBUG, data);
    }

    info(...data: any[]): void {
        this.log(LogLevel.INFO, data);
    }

    warn(...data: any[]): void {
        this.log(LogLevel.WARN, data);
    }

    error(...data: any[]): void {
        this.log(LogLevel.ERROR, data);
    }

    log(logLevel: LogLevel, data: any[]): void {
        if (this._minLogLevel == null) {
            this._minLogLevel = this._factory.getMinLogLevel(this._name);
        }
        if (this._minLogLevel > logLevel) {
            return;
        }
        this._factory.writeLogMessage(this._name, logLevel, data);
    }  

    clearMinLogLevelCache() {
        this._minLogLevel = null;
    }

}

class LoggerFactory {

    private _loggers : Map<string, Logger> = new Map<string, Logger>();
    private _config: ILoggerConfig | null = null;

    get(name: string) : ILogger {
        let ret : Logger | undefined = this._loggers.get(name);
        if (!ret) {
            ret = new Logger(name, this);
            this._loggers.set(name, ret);
        }
        return ret;
    }

    init(config: ILoggerConfig) {
        this._loggers.forEach(function (logger: Logger) {
            logger.clearMinLogLevelCache();
        });
        this._config = config;
        if (this._config && this._config.logLevels) {            
            this._config.logLevels = this._config.logLevels.sort(function(a:ILogLevelConfig, b: ILogLevelConfig): number {
                return StringUtils.replaceAll(b.pattern, "*", "").length - StringUtils.replaceAll(a.pattern, "*", "").length;
            });
        }
    }

    getMinLogLevel(loggerName: string) : LogLevel {
        if (this._config == null || this._config.logLevels == null) {
            return LogLevel.NONE;
        }
        for (let i : number = 0; i < this._config.logLevels.length; i++) {
            let logLevelConfig : ILogLevelConfig = this._config.logLevels[i];
            if (StringUtils.patternMatch(logLevelConfig.pattern, loggerName)) {
                return logLevelConfig.logLevel;
            }
        }
        return LogLevel.NONE;
    }

    writeLogMessage(loggerName: string, logLevel: LogLevel, data: any[]) {
        if (this._config == null || this._config.appenders == null || this._config.appenders.length == 0) {
            return;
        }
        let userId : string | null = null;
        if (this._config.currentUserIdGetter) {
            userId = this._config.currentUserIdGetter();
        }
        let message : string = this.formatMessage(loggerName, userId, data);
        for (let i : number = 0; i < this._config.appenders.length; i++) {
            this._config.appenders[i].log(message, logLevel);
        }
    }

    formatMessage(loggerName: string, userId: string | null, data: any[]) : string {
        let message: string[] = [];
        let date : Date = new Date();
        message.push(StringUtils.padNumber(date.getUTCHours(), 2), ":", 
            StringUtils.padNumber(date.getMinutes(), 2), ":",
            StringUtils.padNumber(date.getSeconds(), 2), ".", 
            StringUtils.padNumber(date.getMilliseconds(), 3), ' ');
        if (userId) {
            message.push("[", userId, "] ");
        }
        message.push("[", loggerName, "] ");
        for (let i : number = 0; i < data.length; i++) {
            let v = data[i];
            if (v && v.stack) {
                message.push(v.stack); // log error as stack traces
            } else {
                message.push(v);
            }
        }
        return message.join('');
    }
}

Log = new LoggerFactory();
