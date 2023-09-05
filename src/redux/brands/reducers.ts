import { BrandActionTypes } from "./constants";
import { Brand } from "./types";

const INIT_STATE = {
    brandInfo:  null,
    loading: false,
};

type BrandActionType = {
    type: 
    BrandActionTypes.API_RESPONSE_SUCCESS |
    BrandActionTypes.API_RESPONSE_ERROR |
    BrandActionTypes.BRAND_INFO
    payload: {
        actionType?: string;
        data?: Brand[] | {};
        error?: string;
    };
};

const Brands = (state = INIT_STATE, action: BrandActionType) => {
    switch (action.type) {
        case BrandActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case BrandActionTypes.BRAND_INFO:
                    return {
                        ...state,
                        brandInfo: action.payload.data,
                        loading: false,
                    };
                    default:
                        return { ...state };

            }
        case BrandActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case BrandActionTypes.BRAND_INFO:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                    default:
                        return { ...state };

            }
        case BrandActionTypes.BRAND_INFO:
            return { ...state, loading: true};
        default:
            return { ...state };
    }
}

export default Brands;