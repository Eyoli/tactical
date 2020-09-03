import LoggerServicePort from "../../tactical/domain/port/primary/logger-service-port";

export default class ConsoleLoggerService implements LoggerServicePort {

    log(message: string): void {
        console.log(message);
    }
}