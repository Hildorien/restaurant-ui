import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { fetchSalesReportData as getSalesReportApi,
        fetchTotalOrdersQty as getTotalOrderQtyApi } from 'helpers'
import { SalesReportActionTypes } from './constants';
import { salesReportApiResponseError, salesReportApiResponseSuccess } from './actions';

type SalesReportData = {
    payload: {
        branchId: number;
        brandId?: number
    };
    type: string;
}

function* salesReportInfo({ payload: { branchId, brandId }, type }: SalesReportData): SagaIterator {
    try {     
        const response = yield call(getSalesReportApi, { branchId, brandId });
        yield put(salesReportApiResponseSuccess(SalesReportActionTypes.SALES_INFO, response.data));

    } catch (error: any) {
        yield put(salesReportApiResponseError(SalesReportActionTypes.SALES_INFO, error));
    }
}

function* totalOrdersQty({ payload: { branchId }, type }: SalesReportData): SagaIterator {
    try {
        const response = yield call(getTotalOrderQtyApi, { branchId });
        yield put(salesReportApiResponseSuccess(SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO, response.data));

    } catch (error: any) {
        yield put(salesReportApiResponseError(SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO, error));
    }
}

export function* watchSalesReportInfo() {
    yield takeEvery( SalesReportActionTypes.SALES_INFO, salesReportInfo);
}

export function* watchTotalOrdersQty() {
    yield takeEvery( SalesReportActionTypes.TOTAL_ORDERS_QTY_INFO, totalOrdersQty);

}

function* salesReportSaga() {
    yield all([fork(watchSalesReportInfo), fork(watchTotalOrdersQty) ]);
}

export default salesReportSaga;