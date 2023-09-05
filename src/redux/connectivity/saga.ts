import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { getOfflineBrands as apiGetOfflineBrandsQty } from 'helpers';
import { connectivityApiResponseError, connectivityApiResponseSuccess } from './actions';
import { ConnectivityActionTypes } from './constants';

type ConnectivityData = {
    payload: {
        brandId: number;
        branchId: number;
        reason: string;
    };
    type: string;

}

function* offlineStoreQty({ payload: { branchId }, type }: ConnectivityData): SagaIterator {
    try {
        const storesOffline = yield call(apiGetOfflineBrandsQty, { branchId });
        yield put(connectivityApiResponseSuccess(ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO, storesOffline.data));

    } catch (error: any) {
        yield put(connectivityApiResponseError(ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO, error));
    }
}

export function* watchOfflineStoreQty() {
    yield takeEvery( ConnectivityActionTypes.CONNECTIVITY_OFFLINE_QTY_INFO, offlineStoreQty);
}

function* connectivitySaga() {
    yield all([fork(watchOfflineStoreQty)]);
}

export default connectivitySaga;