import { SalesReportActionTypes } from "./constants";
import { AccumulatedSalesData } from "./types";


export type SalesReportActionType = {
    type: 
    SalesReportActionTypes.API_RESPONSE_SUCCESS |
    SalesReportActionTypes.API_RESPONSE_ERROR |
    SalesReportActionTypes.SALES_INFO | 
    SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO
    payload: {} | string;
};

// common success
export const salesReportApiResponseSuccess = (actionType: string, data: AccumulatedSalesData[] | {}): SalesReportActionType => ({
    type: SalesReportActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const salesReportApiResponseError = (actionType: string, error: string): SalesReportActionType => ({
    type: SalesReportActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getSalesReportInfo = (branchId: number, brandId?: number): SalesReportActionType => ({
    type: SalesReportActionTypes.SALES_INFO,
    payload: { branchId, brandId },
});

export const getTotalOrdersQty = (branchId: number, brandId?: number): SalesReportActionType => ({
    type: SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO,
    payload: { branchId, brandId }
});