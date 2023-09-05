import { useRedux } from "hooks";
import { useCallback } from "react";
import { getSalesReportInfo, getTotalOrdersQty } from "redux/actions";

export default function useSalesReport() {
    const { dispatch, appSelector } = useRedux();

    const { loading, salesReportInfo, error, totalOrdersQtyInfo } = appSelector((state) => ({
        loading: state.SalesReport.loading,
        error: state.SalesReport.error,
        salesReportInfo: state.SalesReport.salesReportInfo, //This is an array of AccumulatedSalesData
        totalOrdersQtyInfo: state.SalesReport.totalOrdersQtyInfo
    }));

    const onRequest = useCallback((branchId: number, brandId?: number) => {
        dispatch(getSalesReportInfo(branchId, brandId))
    },[dispatch]);

    const onRequestTotalOrdersQty = useCallback((branchId: number, brandId?: number) => {
        dispatch(getTotalOrdersQty(branchId, brandId));
    },[dispatch]);

    return {
        loading,
        salesReportInfo,
        error,
        onRequest,
        onRequestTotalOrdersQty,
        totalOrdersQtyInfo
    }

}