import { AxiosInstance } from "axios";
import axios from 'axios';

export default abstract class Api {
    private baseUrl: string = "";
    protected readonly axiosInstance: AxiosInstance;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,    
        });
        this.axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
        this.initializeResponseInterceptors();
    }
    
    public initializeResponseInterceptors() {
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
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

    public get = (path:string, params?: any) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
            response =  this.axiosInstance.get(`${path}?${queryString}`, params);
        } else {
            response = this.axiosInstance.get(`${path}`, params);
        }
        return response;
    };

    /**
     * post given data to url
     */
    public create = (path: string, data: any) => {
        return this.axiosInstance.post(path, data);
    };

    /**
     * Updates patch data
     */
    public updatePatch = (path:string, data: any) => {
        return this.axiosInstance.patch(path, data);
    };

    /**
     * Updates data
     */
    public update = (path: string, data: any) => {
        return this.axiosInstance.put(path, data);
    };

    /**
     * Deletes data
     */
    public delete = (path: string, data: any) => {
        return this.axiosInstance.delete(path, data);
    };
}