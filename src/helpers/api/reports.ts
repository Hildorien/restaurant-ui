import DarwinApi from "services/api/DarwinApi";

//import { fakeTable } from "helpers/fake-metrics-history";
//import { fakeMetrics } from "helpers/fake-metrics";

function fetchSalesReportData(params: { branchId: number, brandId?: number }){
    const baseUrl = '/report/sales?branchId=' 
    + params.branchId.toString() + 
    (params.brandId ? '&brandId=' + params.brandId.toString() : '');
    return DarwinApi.getInstance().get(`${baseUrl}`, {});
}

function fetchTotalOrdersQty(params: {branchId: number }){
    const baseUrl = '/report/sales/totalOrders?branchId=' + params.branchId.toString();
    return DarwinApi.getInstance().get(`${baseUrl}`, {});
}

function fetchOperationalMetricsData(parms: { branchId: number }){
    const baseUrl = '/report/operation?branchId=' + parms.branchId.toString();
    return DarwinApi.getInstance().get(`${baseUrl}`, {});
    //return { data: fakeMetrics }
}

function fetchOperationalMetricsHistory(parms: { branchId: number }){
    const baseUrl = '/report/operation/history?branchId=' + parms.branchId.toString();
    return DarwinApi.getInstance().get(`${baseUrl}`, {});
    //return { data: fakeTable }
}

export { fetchSalesReportData, fetchTotalOrdersQty, fetchOperationalMetricsData, fetchOperationalMetricsHistory }