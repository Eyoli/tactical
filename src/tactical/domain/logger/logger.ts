import LoggerServicePort from "../port/primary/logger-service-port";

export default class Logger {

    private static loggerServicePort: LoggerServicePort;

    private constructor() {
        // Private constructor
    }

    static setLogger(logger: LoggerServicePort): void {
        Logger.loggerServicePort = logger;
    }

    static log(generator: () => string): void {
        this.loggerServicePort?.log(generator());
    }
}