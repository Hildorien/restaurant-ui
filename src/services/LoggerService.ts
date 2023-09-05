import { Environment } from "config/types";

export default class LoggerService {
    private environment: string = "";
    private static instance: LoggerService;
    private isDarwinElectron: boolean = false;

    private constructor () {}

    public static initialize(environment: string, isDarwinElectron: boolean) {
        this.instance = new LoggerService();
        this.instance.environment = environment;
        this.instance.isDarwinElectron = isDarwinElectron;       
    }

    public static getInstance(): LoggerService {
		return this.instance;
	}
    
    public log(message: string) {
        if (this.environment === Environment.DEVELOPMENT || this.isDarwinElectron) {
            console.log(message);
        }
    }

    public error(error: any) {
        if (this.environment === Environment.DEVELOPMENT || this.isDarwinElectron) {
            console.error(error);
        }
    }
}