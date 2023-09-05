import { SalesReportActionTypes } from "./constants";
import { SalesReportAccumulatedOrdersQty, SalesReportData } from "./types";

const INIT_STATE = {
    salesReportInfo:  null,
    loading: false,
    totalOrdersQtyInfo: null
};

type SalesReportActionType = {
    type: 
    SalesReportActionTypes.API_RESPONSE_SUCCESS |
    SalesReportActionTypes.API_RESPONSE_ERROR |
    SalesReportActionTypes.SALES_INFO | 
    SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO
    payload: {
        actionType?: string;
        data?: SalesReportData | SalesReportAccumulatedOrdersQty | {};
        error?: string;
    };
};

const SalesReport =(state = INIT_STATE, action: SalesReportActionType) => {
    switch (action.type) {
        case SalesReportActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case SalesReportActionTypes.SALES_INFO:
                    return {
                        ...state,
                        salesReportInfo: action.payload.data,
                        loading: false,
                        error: ''
                    };
                case SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO:
                    return {
                        ...state,
                        totalOrdersQtyInfo: action.payload.data,
                        error: '',
                        loading: false,
                    }
                default:
                    return { ...state }
            }
        case SalesReportActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case SalesReportActionTypes.SALES_INFO:
                return {
                    ...state,
                    error: action.payload.error,
                    loading: false,
                };
                case SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    }
                default:
                    return { ...state }
            }
        case SalesReportActionTypes.SALES_INFO:
        case SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO:
            return { ...state, loading: true};
        default: 
            return { ...state }
    }
}

export default SalesReport;