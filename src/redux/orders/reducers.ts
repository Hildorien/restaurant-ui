import { OrderDocument, PrintOrderCommand } from "darwinModels";
import { OrderActionTypes } from "./constants";

const INIT_STATE = {
    loading: false,
    printOrderCommand: null,
    order: null,
    orders:null,
    orderHistory: null,
    orderHistoryTotalPages: null,
    orderHistoryTotalDocs: null,
};

export type OrderHistoryData = {
    docs: OrderDocument[];
    totalDocs: number;
    totalPages: number;
}

type OrderActionType = {
    type: 
    OrderActionTypes.API_RESPONSE_SUCCESS |
    OrderActionTypes.API_RESPONSE_ERROR | 
    OrderActionTypes.ORDER_GET_ONE | 
    OrderActionTypes.ORDER_GET_ALL | 
    OrderActionTypes.ORDER_PRINT_COMMAND_GET | 
    OrderActionTypes.ORDER_GET_HISTORY
    payload: {
        actionType?: string;
        data?: PrintOrderCommand | OrderDocument | OrderDocument[] | OrderHistoryData
        error?: string;
    };
};

const Orders = (state = INIT_STATE, action: OrderActionType) => {
    switch (action.type) {
        case OrderActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case OrderActionTypes.ORDER_GET_ONE:
                    return {
                        ...state,
                        order: action.payload.data,
                        loading: false
                    }
                case OrderActionTypes.ORDER_GET_ALL:
                    return {
                        ...state,
                        orders: action.payload.data,
                        loading: false
                    }
                case OrderActionTypes.ORDER_PRINT_COMMAND_GET:
                    return {
                        ...state,
                        printOrderCommand: action.payload.data,
                        loading: false
                    }
                case OrderActionTypes.ORDER_GET_HISTORY:
                    return {
                        ...state,
                        orderHistory: (action.payload.data as OrderHistoryData).docs,
                        orderHistoryTotalPages: (action.payload.data as OrderHistoryData).totalPages,
                        orderHistoryTotalDocs: (action.payload.data as OrderHistoryData).totalDocs,
                        loading: false
                    }
                default:
                    return { ...state };

            }
        case OrderActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case OrderActionTypes.ORDER_GET_ONE:
                case OrderActionTypes.ORDER_PRINT_COMMAND_GET:
                case OrderActionTypes.ORDER_GET_ALL:
                case OrderActionTypes.ORDER_GET_HISTORY:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    }
                default:
                    return { ...state };
            }
        case OrderActionTypes.ORDER_GET_ONE:
        case OrderActionTypes.ORDER_GET_ALL:
        case OrderActionTypes.ORDER_PRINT_COMMAND_GET:
        case OrderActionTypes.ORDER_GET_HISTORY:
            return { ...state, loading: true }
        default:
            return { ...state };
    }
}

export default Orders;