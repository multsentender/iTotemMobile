import { Log, ILogger, LogLevel, ILogLevelConfig, ILogAppender } from "./log/Logger";
import { ConsoleLogAppender } from "./log/ConsoleLogAppender";
import { R7InsightAppender } from "./log/R7InsightAppender";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export { Log as Log };
export { ILogger as Logger };
export { LogLevel as LogLevel };

export interface Appender {
    "type": string,
    "region"?: string,
    "token"?: string
}
export interface LogLevelInt {
    "level": LogLevel,
    "pattern": string
}
export interface LogConfig {
    "appenders": Appender[],
    "logLevels": LogLevelInt[]
}


@Injectable()
export class LogService {

    setConfig(logConfig: LogConfig) {
        const appenders: ILogAppender[] = [];
        logConfig.appenders.forEach((item: Appender) => {
            if (item.type == "console") appenders.push(new ConsoleLogAppender())
            if (item.type == "rapid7" && item.token && item.region) appenders.push(new R7InsightAppender({
                token: item.token!,
                region: item.region!
            }))
        })
        Log.init({
            appenders: appenders,
            logLevels: logConfig.logLevels.map(item => {
                return {
                    logLevel: item.level,
                    pattern: item.pattern
                } as ILogLevelConfig
            }),
            currentUserIdGetter: function (): string {
                return environment.userID
            }
        })
    }

}
