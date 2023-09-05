import { OperationalMetricsActionTypes } from "./constants";
import { OperationalMetric } from "./types";

export type OperationalMetricsActionType = {
    type: 
    OperationalMetricsActionTypes.API_RESPONSE_SUCCESS |
    OperationalMetricsActionTypes.API_RESPONSE_ERROR |
    OperationalMetricsActionTypes.METRICS_INFO | 
    OperationalMetricsActionTypes.METRICS_HISTORY
    payload: {} | string;
};

// common success
export const operationalMetricsApiResponseSuccess = (actionType: string, data: OperationalMetric[] | {}): OperationalMetricsActionType => ({
    type: OperationalMetricsActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const operationalMetricsApiResponseError = (actionType: string, error: string): OperationalMetricsActionType => ({
    type: OperationalMetricsActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getOperationalMetricsInfo = (branchId: number): OperationalMetricsActionType => ({
    type: OperationalMetricsActionTypes.METRICS_INFO,
    payload: { branchId },
});

export const getOperationalMetricsHistory = (branchId: number): OperationalMetricsActionType => ({
    type: OperationalMetricsActionTypes.METRICS_HISTORY,
    payload: { branchId },
});