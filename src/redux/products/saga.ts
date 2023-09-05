import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { productApiResponseError, productApiResponseSuccess } from './actions';
import { ProductActionTypes } from "./constants";
import { getProducts as getProductsApi, getOfflineProducts as getOfflineProductsApi } from 'helpers/api/products'

type ProductData = {
    payload: {
        branchId: number;
    };
    type: string;

}


function* productInfo({ payload: { branchId }, type }: ProductData): SagaIterator {
    try {
        const products = yield call(getProductsApi, { branchId });
        yield put(productApiResponseSuccess(ProductActionTypes.PRODUCT_INFO, products.data));

    } catch (error: any) {
        yield put(productApiResponseError(ProductActionTypes.PRODUCT_INFO, error));
    }
}

function* offlineProductQty({ payload: { branchId }, type }: ProductData): SagaIterator {
    try {
        const products = yield call(getOfflineProductsApi, { branchId });
        yield put(productApiResponseSuccess(ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO, products.data));

    } catch (error: any) {
        yield put(productApiResponseError(ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO, error));
    }
}

export function* watchProductInfo() {
    yield takeEvery( ProductActionTypes.PRODUCT_INFO, productInfo);
}

export function* watchOfflineProductQtyInfo() {
    yield takeEvery( ProductActionTypes.PRODUCT_OFFLINE_QTY_INFO, offlineProductQty);
}

function* productSaga() {
    yield all([fork(watchProductInfo), fork(watchOfflineProductQtyInfo) ]);
}

export default productSaga;