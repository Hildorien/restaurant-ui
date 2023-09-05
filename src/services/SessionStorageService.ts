import { User } from "config/types";
import config from "config/config";
import DarwinApi from "./api/DarwinApi";

export enum SessionStorageKeys {
    ACTIVE_BRANCH = "active_branch"
}
class SessionStorageService {
    public static setItem(key: string, item: any): void {
        sessionStorage.setItem(key, JSON.stringify(item));
    }

    public static getItem(key: string) {
        const saved = sessionStorage.getItem(key);        
        //Multiple components ask for ACTIVE_BRANCH. Here we handle the case where SessionStorage was cleared
        if(!saved && key === SessionStorageKeys.ACTIVE_BRANCH) {
            //If storage was cleared we can default to the first branch of the logged in user
            //Check if DarwinApi wrapper is initalized.
            if (!DarwinApi.isInitialized()) {
                //This happens when app is reloaded. Initialize DarwinApi again
                DarwinApi.initialize(config.api.url);
            }
            const loggedInUser = DarwinApi.getInstance().getLoggedInUser();
            if(loggedInUser) {
                //Default to 1st branchId
                const branchId = (loggedInUser as User).branchIds[0]; 
                this.setItem(key, branchId)
                return branchId;
            } else {
                return null;
            }
        }    
        return saved ? JSON.parse(saved) : null;
    }

    public static removeSession() {
        sessionStorage.clear();
    }

} 

export { SessionStorageService }
