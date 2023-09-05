import { ConnectivityActionTypes } from "./constants";
import { ConnectivityInfo } from "./types";

export type ConnectivityActionType = {
    type: 
    ConnectivityActionTypes.API_RESPONSE_SUCCESS |
    ConnectivityActionTypes.API_RESPONSE_ERROR |
    ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO
    payload: {} | string;
};

// common success
export const connectivityApiResponseSuccess = (actionType: string, data: ConnectivityInfo | {}): ConnectivityActionType => ({
    type: ConnectivityActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const connectivityApiResponseError = (actionType: string, error: string): ConnectivityActionType => ({
    type: ConnectivityActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getOfflineBrandQty = (branchId: number): ConnectivityActionType => ({
    type: ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO,
    payload: { branchId },
});