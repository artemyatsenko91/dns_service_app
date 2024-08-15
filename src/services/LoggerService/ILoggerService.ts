export interface ILoggerService {
    info(message: string, obj?: { [key: string]: any }): void;
    warn(message: string): void;
    error(message: string, obj?: { [key: string]: any }): void;
}