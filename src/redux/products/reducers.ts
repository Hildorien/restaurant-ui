import { ProductActionTypes } from "./constants";
import { Product } from "./types";

const INIT_STATE = {
    productInfo:  null,
    loading: false,
    offlineProductQtyInfo: null
};

type ProductActionType = {
    type: 
    ProductActionTypes.API_RESPONSE_SUCCESS |
    ProductActionTypes.API_RESPONSE_ERROR |
    ProductActionTypes.PRODUCT_INFO |
    ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO
    payload: {
        actionType?: string;
        data?: Product[] | {} | number;
        error?: string;
    };
};

const Products = (state = INIT_STATE, action: ProductActionType) => {
    switch (action.type) {
        case ProductActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ProductActionTypes.PRODUCT_INFO:
                    return {
                        ...state,
                        productInfo: action.payload.data,
                        loading: false,
                        error: ''
                    };
                case ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO:
                        return {
                            ...state,
                            offlineProductQtyInfo: action.payload.data,
                            loading: false,
                        };
                    default:
                        return { ...state };

            }
        case ProductActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ProductActionTypes.PRODUCT_INFO:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                    case ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO:
                        return {
                            ...state,
                            error: action.payload.error,
                            loading: false,
                        };
                    default:
                        return { ...state };

            }
        case ProductActionTypes.PRODUCT_INFO:
            return { ...state, loading: true};
        case ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO:
                return { ...state, loading: true};
        default:
            return { ...state };
    }

}

export default Products;