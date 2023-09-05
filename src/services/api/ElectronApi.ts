import Api from "./Api";

export default class ElectronApi extends Api {

    private static instance: ElectronApi;
    
    private constructor(baseUrl: string){
        super(baseUrl);
        delete this.axiosInstance.defaults.headers.common["Authorization"];
    }

    public static initialize(baseUrl: string) {
        if (!this.instance) {
            this.instance = new ElectronApi(baseUrl);
        }
    }

    public static getInstance(): ElectronApi {
        return this.instance;
    }
}