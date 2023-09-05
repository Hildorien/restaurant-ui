import Api from "./Api";

export default class PrinterApi extends Api {

    private static instance: PrinterApi;
    
    private constructor(baseUrl: string){
        super(baseUrl);
        delete this.axiosInstance.defaults.headers.common["Authorization"];
    }

    public static initialize(baseUrl: string) {
        if (!this.instance) {
            this.instance = new PrinterApi(baseUrl);
        }
    }

    public static getInstance(): PrinterApi {
        return this.instance;
    }
}