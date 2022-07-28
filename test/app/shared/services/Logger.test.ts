import { Log, ILogger, ILoggerConfig, LogLevel, ILogAppender, ILoggerUserIdGetter } from '../../../../src/app/shared/services/log/Logger';
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';

_chai.should();
_chai.expect;

class TestLogAppender implements ILogAppender {

    private _lastMessage: string;
    private _logLevel: LogLevel;
    private _dirty: boolean = false;

    log(message: string, logLevel: LogLevel): void {
        if (this._dirty) {
            throw new Error("Appender is called twice, but expected one call");
        }
        this._lastMessage = message;
        this._logLevel = logLevel;
        this._dirty = true;
    }

    public getLastMessage() : string {
        return this._lastMessage;
    }

    public getLogLevel() : LogLevel {
        return this._logLevel;
    }

    public clear() : boolean {
        let ret = this._dirty;
        this._dirty = false;
        return ret;
    }
    
    
}

@suite class LoggerTest {

    private t1 : ILogger;
    private t2 : ILogger;
    private t3 : ILogger;
    private t4 : ILogger;
    private t5 : ILogger;
    private a1: TestLogAppender;

    before() {
        this.a1 = new TestLogAppender();
        let config : ILoggerConfig = {
            appenders: [this.a1],
            logLevels: [{
                logLevel: LogLevel.ERROR,
                pattern: "Test*"
            }, {
                logLevel: LogLevel.WARN,
                pattern: "TestL*"
            }, {
                logLevel: LogLevel.INFO,
                pattern: "Test.Log*"
            },{
                logLevel: LogLevel.DEBUG,
                pattern: "Test.Logger.Logger*"
            },{
                logLevel: LogLevel.TRACE,
                pattern: "Test.Logger.Logger4"
            }]
        }
        Log.init(config);
        this.t1 = Log.get("TestLogger1");
        this.t2 = Log.get("Test.Logger2");
        this.t3 = Log.get("Test.Logger.Logger3");
        this.t4 = Log.get("Test.Logger.Logger4");
        this.t5 = Log.get("None");
    }

    @test trace() {
        this.t5.trace("Trace message: ", 123, ".");
        this.t1.trace("Trace message: ", 123, ".");
        this.t2.trace("Trace message: ", 123, ".");
        this.t3.trace("Trace message: ", 123, ".");
        expect(this.a1.clear()).to.eq(false);
        this.t4.trace("Trace message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.TRACE);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger4] Trace message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }
    
    @test debug() {
        this.t5.debug("Debug message: ", 123, ".");
        this.t1.debug("Debug message: ", 123, ".");
        this.t2.debug("Debug message: ", 123, ".");
        expect(this.a1.clear()).to.eq(false);
        this.t3.debug("Debug message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.DEBUG);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger3] Debug message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t4.debug("Debug message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.DEBUG);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger4] Debug message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }

    @test info() {
        this.t5.debug("Info message: ", 123, ".");
        this.t1.info("Info message: ", 123, ".");
        this.t1.info("Info message: ", 123, ".");
        expect(this.a1.clear()).to.eq(false);
        this.t2.info("Info message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.INFO);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger2] Info message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t3.info("Info message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.INFO);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger3] Info message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t4.info("Info message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.INFO);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger4] Info message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }

    @test warn() {
        this.t5.debug("Warn message: ", 123, ".");
        this.t1.warn("Warn message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.WARN);
        expect(this.a1.getLastMessage()).to.contains(" [TestLogger1] Warn message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t2.warn("Warn message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.WARN);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger2] Warn message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t3.warn("Warn message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.WARN);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger3] Warn message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t4.warn("Warn message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.WARN);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger4] Warn message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }

    @test error() {
        this.t5.debug("Error message: ", 123, ".");
        this.t1.error("Error message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.ERROR);
        expect(this.a1.getLastMessage()).to.contains(" [TestLogger1] Error message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t2.error("Error message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.ERROR);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger2] Error message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t3.error("Error message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.ERROR);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger3] Error message: 123.");
        expect(this.a1.clear()).to.eq(true);
        this.t4.error("Error message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.ERROR);
        expect(this.a1.getLastMessage()).to.contains(" [Test.Logger.Logger4] Error message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }

    @test name() {
        expect(this.t1.name()).to.contains("TestLogger1");
        expect(this.t2.name()).to.contains("Test.Logger2");
        expect(this.t3.name()).to.contains("Test.Logger.Logger3");
        expect(this.t4.name()).to.contains("Test.Logger.Logger4");
    }

    @test exception() {
        this.t1.error("Error message: ", new Error("12345"));
        expect(this.a1.getLastMessage()).to.contains("12345");
        expect(this.a1.getLastMessage()).to.contains("at ");
        this.a1.clear();
    }
 
    @test userId() {
        let userIdGett : ILoggerUserIdGetter = function() : string {
            return "UserIdTest";
        }
        let config : ILoggerConfig = {
            appenders: [this.a1],
            logLevels: [{
                logLevel: LogLevel.ERROR,
                pattern: "Test*"
            }, {
                logLevel: LogLevel.WARN,
                pattern: "TestL*"
            }, {
                logLevel: LogLevel.INFO,
                pattern: "Test.Log*"
            },{
                logLevel: LogLevel.DEBUG,
                pattern: "Test.Logger.Logger*"
            },{
                logLevel: LogLevel.TRACE,
                pattern: "Test.Logger.Logger4"
            }],
            currentUserIdGetter: userIdGett
        }
        Log.init(config);
        this.t1.error("Error message: ", 123, ".");
        expect(this.a1.getLogLevel()).to.eq(LogLevel.ERROR);
        expect(this.a1.getLastMessage()).to.contains(" [UserIdTest] [TestLogger1] Error message: 123.");
        expect(this.a1.clear()).to.eq(true);
    }    

    @test invalidConfig() {
        let config : ILoggerConfig = null;
        Log.init(config);
        this.t1.error("Error message: ", 123, ".");
        expect(this.a1.clear()).to.eq(false);
        config = {
            appenders: null,
            logLevels: [{
                logLevel: LogLevel.ERROR,
                pattern: "Test*"
            }]
        };
        Log.init(config);
        this.t1.error("Error message: ", 123, ".");
        expect(this.a1.clear()).to.eq(false);
    }    
   

}