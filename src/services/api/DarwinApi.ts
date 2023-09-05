import { LocalStorageKeys, LocalStorageService } from "services/LocalStorageService";
import { SessionStorageKeys, SessionStorageService } from "services/SessionStorageService";
import Api from "./Api";
import { IToken, User } from "config/types";
import { refreshToken as refreshTokenApi } from "helpers";
import { AxiosRequestConfig } from "axios";
import LoggerService from "services/LoggerService";


const AUTH_SESSION_KEY = LocalStorageKeys.USER;

export default class DarwinApi extends Api {

    private static instance: DarwinApi;
    
    private constructor(baseUrl: string){
        super(baseUrl);
        this.initializeRequestInterceptors();
        //Every time the app is refreshed -> set auth header
        if (!this.accessTokenExpired()) {
            const user = this.getUserFromLocalStorage();
            this.setAuthorization(user.token.value);
        }
    }

    public static initialize(baseUrl: string) {
        if (!this.instance) {
            this.instance = new DarwinApi(baseUrl);
        }
    }

    public static getInstance(): DarwinApi {
        return this.instance;
    }

    public static isInitialized(): boolean {
        return this.instance !== undefined;
    }

    public initializeRequestInterceptors(): void {
        this.axiosInstance.interceptors.request.use(this.handleRequest, this.handleError);
    }

    private handleRequest = async (config: AxiosRequestConfig) => {
		const user = this.getUserFromLocalStorage();
        // Only refresh token when the request does not come from refreshToken (avoid infinite recursion)
        if (!config.data?.refreshToken && user && this.accessTokenExpired()) {
            await this.requestNewToken();
            const updatedUser = this.getLoggedInUser() as User;
            if (config.headers) {
                config.headers['Authorization'] = 'Bearer ' + updatedUser.token.value;
            }
		}
		return config;
	};

    private handleError = (error: any) => {
		return Promise.reject(this.getErrorMessage(error));
	};

    private getErrorMessage(error: any) {
        let message;
        if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        else if (error.response?.data?.error) {
            message = error.response.data.error;
        }
        else if (error.response?.data) {
            message = JSON.stringify(error.response.data);
        } 
        else {
        //if no data provided in response
            message = JSON.stringify(error.response);
        }
        return message;
    }

    public override initializeResponseInterceptors() {
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                let message;
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                        case 403:
                        case 404:
                            message = error.response.data.reason ? error.response.data.reason: error.response.data;
                            break;
                        default: {
                                if (error.response.data.message) {
                                    message = error.response.data.message;
                                    break;
                                }
                                if (error.response.data.error) {
                                    message = error.response.data.error;
                                    break;
                                }
                                if (error.response.data) {
                                    message = JSON.stringify(error.response.data);
                                    break;
                                }
                                //if no data provided in response
                                message = JSON.stringify(error.response);
                            }
                    }
                    return Promise.reject(message);
                }
                return Promise.reject(error.toJSON());
            }
        );
    }

    /**
     * Sets the default authorization
     * @param {*} token
     */
    public setAuthorization = (token: string | null) => {
        if (token) this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        else delete this.axiosInstance.defaults.headers.common['Authorization'];
    };

    private getUserFromLocalStorage: any = () => {
        const user = LocalStorageService.getItem(AUTH_SESSION_KEY);
        return user ? (typeof user == 'object' ? user : JSON.parse(user)) : undefined;
    };

    public accessTokenExpired = () => {
        const user = this.getLoggedInUser() as User;
        if (!user || (user && !user.token)) {
            return true;
        }
        const currentTime = Date.now() / 1000;
        return user.token.expire && user.token.expire < currentTime
    };

    /**
     * Returns the logged in user
     */
    public getLoggedInUser = () => {
        return this.getUserFromLocalStorage();
    };

    public setUserInSession = (modifiedUser: any) => {
        let userInfo = LocalStorageService.getItem(AUTH_SESSION_KEY);
        if (userInfo) {
            const { token, user } = JSON.parse(userInfo);
            this.storeLoggedInUser({ token, ...user, ...modifiedUser });
        }
    };

    public storeLoggedInUser = (session: any) => {
        if (session) {
            LocalStorageService.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        } else {
            LocalStorageService.removeSession();
            SessionStorageService.removeSession();
        }
    };
    /**
     * This method will ask for a new access token with the refresh token of the user
     * If success then it will save the token in local storage and set the axios header auth with the new token
     */
    public async requestNewToken() {
        const user = this.getLoggedInUser() as User;
        const email = user.email;
        const refreshToken = user.refreshToken.value;
        await refreshTokenApi({ email, refreshToken })
        .then((response) => {
            const data = response.data;
            const accessToken = data.accessToken as IToken;
            const refreshToken = data.refreshToken as IToken;
            //Override auth access token value and user tokens
            this.setAuthorization(accessToken.value);
            user.token = accessToken;
            user.refreshToken = refreshToken;                    
            //Store user in local storage 
            this.storeLoggedInUser(user);
            //Set active branch as first branchId of user and store it in session storage
            SessionStorageService.setItem(SessionStorageKeys.ACTIVE_BRANCH, user.branchIds[0]);
        })
        .catch((error) => {
            LoggerService.getInstance().log('Refresh token failed...');
            LoggerService.getInstance().error(error);
            LocalStorageService.removeSession();
            SessionStorageService.removeSession();
        });
    }
}