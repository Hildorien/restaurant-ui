import { useRedux } from "hooks";
import { useCallback } from "react";
import { getOperationalMetricsInfo } from "redux/actions";

export default function useOperationalMetrics() {
    const { dispatch, appSelector } = useRedux();
    
    const { loading, operationalMetricsInfo, error } = appSelector((state) => ({
        loading: state.OperationalMetrics.loading,
        error: state.OperationalMetrics.error,
        operationalMetricsInfo: state.OperationalMetrics.operationalMetricsInfo, //This is an array of OperationalMetricBrand
    }));

    const onRequest = useCallback((branchId: number) => {
        dispatch(getOperationalMetricsInfo(branchId))
    },[dispatch]);

    return {
        loading,
        operationalMetricsInfo,
        error,
        onRequest,
    }

}
