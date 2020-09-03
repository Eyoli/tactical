import LoggerServicePort from "../port/primary/logger-service-port";

export default class Logger {

    private static loggerServicePort: LoggerServicePort;

    private constructor() {}

    static setLogger(logger: LoggerServicePort) {
        Logger.loggerServicePort = logger;
    }

    static log(generator: () => string): void {
        this.loggerServicePort?.log(generator());
    }
}