import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { branchApiResponseError, branchApiResponseSuccess } from './actions';
import { BranchActionTypes } from "./constants";
import {    getBranch as getBranchApi,
            getStores as getStoresApi, } from 'helpers'
import { BranchInfo, BranchMetadata, Store  } from './types';

type BranchData = {
    payload: {
        branchId: number;
    };
    type: string;

}

function* branchInfo({ payload: { branchId }, type }: BranchData): SagaIterator {
    try {
        const storesResponse = yield call(getStoresApi, { branchId: branchId });
        const storeData = storesResponse.data;
        let stores: Store[] = [];
        for(const store of storeData) {
            stores.push({...store});                
        }
        const branchInfo: BranchInfo = {
            branchId: branchId,
            stores: stores
        }
        yield put(branchApiResponseSuccess(BranchActionTypes.BRANCH_INFO, branchInfo));

    } catch (error: any) {
        yield put(branchApiResponseError(BranchActionTypes.BRANCH_INFO, error));
    }
}

function* branchMetadata(): SagaIterator {
    try {
        let branchMetadata: BranchMetadata[] = [];
        const branchResponse = yield call(getBranchApi);
        branchMetadata = branchResponse.data;
        yield put(branchApiResponseSuccess(BranchActionTypes.BRANCH_METADATA, branchMetadata));

    } catch(error: any) {
        yield put(branchApiResponseError(BranchActionTypes.BRANCH_METADATA, error));
    }
}

export function* watchBranchInfo() {
    yield takeEvery( BranchActionTypes.BRANCH_INFO, branchInfo);
}

export function* watchBranchMetadata() {
    yield takeEvery( BranchActionTypes.BRANCH_METADATA, branchMetadata);
}

function* branchSaga() {
    yield all([fork(watchBranchInfo), fork(watchBranchMetadata)]);
}

export default branchSaga;