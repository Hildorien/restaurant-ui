import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { OperationalMetricsActionTypes } from './constants';
import { operationalMetricsApiResponseError, operationalMetricsApiResponseSuccess } from './actions';
import { fetchOperationalMetricsData as getOperationalMetricsApi,
        fetchOperationalMetricsHistory as getOperationalMetricsHistoryApi } from 'helpers';

type OperationalMetricsData = {
    payload: {
        branchId: number;
    };
    type: string;
}

function* operationalMetricsInfo({ payload: { branchId }, type }: OperationalMetricsData): SagaIterator {
    try {
        const metricsData = yield call(getOperationalMetricsApi, { branchId });
        yield put(operationalMetricsApiResponseSuccess(OperationalMetricsActionTypes.METRICS_INFO, metricsData.data));

    } catch (error: any) {
        yield put(operationalMetricsApiResponseError(OperationalMetricsActionTypes.METRICS_INFO, error));
    }
}

function* operationalMetricsHistory({ payload: { branchId }, type }: OperationalMetricsData): SagaIterator {
    try {
        const metricsData = yield call(getOperationalMetricsHistoryApi, { branchId });
        yield put(operationalMetricsApiResponseSuccess(OperationalMetricsActionTypes.METRICS_HISTORY, metricsData.data));

    } catch (error: any) {
        yield put(operationalMetricsApiResponseError(OperationalMetricsActionTypes.METRICS_HISTORY, error));
    }
}

export function* watchOperationalMetricsInfo() {
    yield takeEvery( OperationalMetricsActionTypes.METRICS_INFO, operationalMetricsInfo);
}

export function* watchOperationalMetricsHistory() {
    yield takeEvery( OperationalMetricsActionTypes.METRICS_HISTORY, operationalMetricsHistory);
}


function* operationalMetricsSaga() {
    yield all([fork(watchOperationalMetricsInfo), fork(watchOperationalMetricsHistory)]);
}

export default operationalMetricsSaga;