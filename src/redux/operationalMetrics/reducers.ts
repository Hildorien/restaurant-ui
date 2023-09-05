import { OperationalMetricsActionTypes } from "./constants";
import { OperationalMetric } from "./types";

const INIT_STATE = {
    operationalMetricsInfo:  null,
    operationalMetricsHistory: null,
    loading: false,
};

type OperationalMetricActionType = {
    type: 
    OperationalMetricsActionTypes.API_RESPONSE_SUCCESS |
    OperationalMetricsActionTypes.API_RESPONSE_ERROR |
    OperationalMetricsActionTypes.METRICS_INFO | 
    OperationalMetricsActionTypes.METRICS_HISTORY
    payload: {
        actionType?: string;
        data?: OperationalMetric[] | {};
        error?: string;
    };
};

const OperationalMetrics =(state = INIT_STATE, action: OperationalMetricActionType) => {
    switch (action.type) {
        case OperationalMetricsActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case OperationalMetricsActionTypes.METRICS_INFO:
                    return {
                        ...state,
                        operationalMetricsInfo: action.payload.data,
                        loading: false,
                        error: ''
                    }
                case OperationalMetricsActionTypes.METRICS_HISTORY:
                    return {
                        ...state,
                        operationalMetricsHistory: action.payload.data,
                        loading: false,
                        error: ''
                    }
                default:
                    return { ...state }
            }      
        case OperationalMetricsActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case OperationalMetricsActionTypes.METRICS_INFO:
                case OperationalMetricsActionTypes.METRICS_HISTORY:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false
                    }
                default:
                    return { ...state }
            }
        case OperationalMetricsActionTypes.METRICS_INFO:
        case OperationalMetricsActionTypes.METRICS_HISTORY:
            return { ...state, loading: true}
        default: 
            return { ...state }
    }
}

export default OperationalMetrics;