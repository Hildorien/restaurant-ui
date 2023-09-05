import { BrandActionTypes } from "./constants";
import { Brand } from "./types";

export type BrandActionType = {
    type: 
    BrandActionTypes.API_RESPONSE_SUCCESS |
    BrandActionTypes.API_RESPONSE_ERROR |
    BrandActionTypes.BRAND_INFO
    payload: {} | string;
};

// common success
export const brandApiResponseSuccess = (actionType: string, data: Brand[] | {}): BrandActionType => ({
    type: BrandActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const brandApiResponseError = (actionType: string, error: string): BrandActionType => ({
    type: BrandActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});
export const getBrandInfo = (branchId: number): BrandActionType => ({
    type: BrandActionTypes.BRAND_INFO,
    payload: { branchId },
});