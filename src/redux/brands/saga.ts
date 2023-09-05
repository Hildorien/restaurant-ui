
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { getBrandsByBranchId as getBrandsApi } from 'helpers';
import { brandApiResponseError, brandApiResponseSuccess } from './actions';
import { BrandActionTypes } from './constants';

type BrandData = {
    payload: {
        branchId: number;
    };
    type: string;
}

function* getBrandInfo({ payload: { branchId }, type }: BrandData): SagaIterator {
    try {
        const brands = yield call(getBrandsApi, { branchId });
        yield put(brandApiResponseSuccess(BrandActionTypes.BRAND_INFO, brands.data));

    } catch (error: any) {
        yield put(brandApiResponseError(BrandActionTypes.BRAND_INFO, error));

    }
}

export function* watchBrandInfo() {
    yield takeEvery(BrandActionTypes.BRAND_INFO, getBrandInfo);
}

function* brandSaga() {
    yield all([fork(watchBrandInfo)]);
}

export default brandSaga;