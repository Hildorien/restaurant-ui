import { ProductActionTypes } from "./constants";
import { Product } from "./types";

export type ProductActionType = {
    type: 
    ProductActionTypes.API_RESPONSE_SUCCESS |
    ProductActionTypes.API_RESPONSE_ERROR |
    ProductActionTypes.PRODUCT_INFO |
    ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO
    payload: {} | string;
};

// common success
export const productApiResponseSuccess = (actionType: string, data: Product[] | {}): ProductActionType => ({
    type: ProductActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const productApiResponseError = (actionType: string, error: string): ProductActionType => ({
    type: ProductActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getProductInfo = (branchId: number): ProductActionType => ({
    type: ProductActionTypes.PRODUCT_INFO,
    payload: { branchId },
});

export const getOfflineProductQty = (branchId: number): ProductActionType => ({
    type: ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO,
    payload: { branchId },
});