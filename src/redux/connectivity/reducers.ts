import { ConnectivityActionTypes } from "./constants";
import { ConnectivityInfo } from "./types";


const INIT_STATE = {
    loading: false,
    connectivityInfo: null,
    offlineBrandQtyInfo: null

};

type ConnectivityActionType = {
    type: 
    ConnectivityActionTypes.API_RESPONSE_SUCCESS |
    ConnectivityActionTypes.API_RESPONSE_ERROR |
    ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO
    payload: {
        actionType?: string;
        data?: ConnectivityInfo | number;
        error?: string;
    };
};

const Connectivity = (state = INIT_STATE, action: ConnectivityActionType) => {
    switch (action.type) {
        case ConnectivityActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO:
                    return {
                        ...state,
                        offlineBrandQtyInfo: action.payload.data,
                        loading: false,
                    }
                    default:
                        return { ...state };               
            }
        case ConnectivityActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO:
                    return {
                            ...state,
                            error: action.payload.error,
                            loading: false,
                        }
                    default:
                        return { ...state };

            }
        case ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO:
            return { ...state, loading: true }
        default:
            return { ...state };
    }

}

export default Connectivity;