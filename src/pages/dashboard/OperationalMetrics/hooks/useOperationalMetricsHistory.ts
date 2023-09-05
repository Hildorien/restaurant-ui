import { useRedux } from "hooks";
import { useCallback } from "react";
import { getOperationalMetricsHistory } from "redux/actions";

export default function useOperationalMetricsHistory() {
    const { dispatch, appSelector } = useRedux();
    
    const { loading, operationalMetricsHistory, error } = appSelector((state) => ({
        loading: state.OperationalMetrics.loading,
        error: state.OperationalMetrics.error,
        operationalMetricsHistory: state.OperationalMetrics.operationalMetricsHistory, //This is an array of BrandRecord
    }));

    const onRequest = useCallback((branchId: number) => {
        dispatch(getOperationalMetricsHistory(branchId))
    },[dispatch]);

    return {
        loading,
        operationalMetricsHistory,
        error,
        onRequest,
    }
}
