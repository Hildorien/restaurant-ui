import { OrderDocument, PrintOrderCommand } from "darwinModels";
import { OrderActionTypes } from "./constants";
import { OrderHistoryData } from "./reducers";

export type OrderActionType = {
    type: 
    OrderActionTypes.API_RESPONSE_SUCCESS |
    OrderActionTypes.API_RESPONSE_ERROR | 
    OrderActionTypes.ORDER_GET_ONE | 
    OrderActionTypes.ORDER_GET_ALL | 
    OrderActionTypes.ORDER_PRINT_COMMAND_GET | 
    OrderActionTypes.ORDER_GET_HISTORY
    payload: {} | PrintOrderCommand | OrderDocument | OrderDocument[] | OrderHistoryData
}

// common success
export const orderApiResponseSuccess = (actionType: string, 
    data: PrintOrderCommand | OrderDocument | OrderDocument[] | boolean | OrderHistoryData): OrderActionType => ({
    type: OrderActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const orderApiResponseError = (actionType: string, error: string): OrderActionType => ({
    type: OrderActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getOrders = (branchId: string): OrderActionType => ({
    type: OrderActionTypes.ORDER_GET_ALL,
    payload: { branchId },
});

export const getOrderById = (orderId: string): OrderActionType => ({
    type: OrderActionTypes.ORDER_GET_ONE,
    payload: { orderId },
});

export const getPrintOrderCommandById = (orderId: string): OrderActionType => ({
    type: OrderActionTypes.ORDER_PRINT_COMMAND_GET,
    payload: { orderId },
});

export const getOrderHistory = (branchId: string, page: number, from?: Date, to?: Date, search?: string): OrderActionType => ({
    type: OrderActionTypes.ORDER_GET_HISTORY,
    payload: { branchId, page, from, to, search },
});
