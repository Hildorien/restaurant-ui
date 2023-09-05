import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { OrderActionTypes } from './constants';
import {
    getPrintOrderCommand as orderApiGetPrintOrderCommand,
    getOrders as orderApiGetOrders,
    getOrderById as orderApiGetOrderById,
    getOrderHistory as orderApiGetOrderHistory,
} from "helpers/api/orders";
import { orderApiResponseSuccess, orderApiResponseError} from './actions';
import { OrderStatus } from 'darwinModels';
import { OrderDocument } from 'darwinModels';
import config from 'config/config';
type OrderData = {
    payload: {
        branchId: string;
        orderId: string;
        setSound: boolean;
        page: number;
        from?: Date;
        to?: Date;
        search?: string;
    };
    type: string;
}

function* getOrders({ payload: { branchId }, type }: OrderData): SagaIterator {
    try {
        let response = yield call(orderApiGetOrders, { branchId });
        let orderDocuments: OrderDocument[] = [];
        let firstPageOrders = response.data.docs as OrderDocument[];
        orderDocuments = firstPageOrders;
        while (response.data.hasNextPage && !isNaN(response.data.nextPage) ) {
            response = yield call(orderApiGetOrders, { branchId, page: response.data.nextPage });
            orderDocuments = orderDocuments.concat(response.data.docs);
        }

        //Adding filters in front until they are available through a request to backend
        const eightHoursAgo = new Date();
        const isProd = config.environment === 'production';
        eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
        orderDocuments = orderDocuments.filter(ord => 
            ord.status !== OrderStatus.DELIVERED && 
            (!isProd || new Date(ord.createdAt).getTime() > eightHoursAgo.getTime()) );
        
        yield put(orderApiResponseSuccess(OrderActionTypes.ORDER_GET_ALL, orderDocuments));
    } catch (error: any) {
        yield put(orderApiResponseError(OrderActionTypes.ORDER_GET_ALL, error));
    }
}

function* getOrderById({ payload: { orderId }, type }: OrderData): SagaIterator {
    try {
        const response = yield call(orderApiGetOrderById, { orderId });
        yield put(orderApiResponseSuccess(OrderActionTypes.ORDER_GET_ONE, response.data));
    } catch (error: any) {
        yield put(orderApiResponseError(OrderActionTypes.ORDER_GET_ONE, error));
    }
}

function* getPrintOrderCommand({ payload: { orderId }, type }: OrderData): SagaIterator {
    try {
        const response = yield call(orderApiGetPrintOrderCommand, { orderId });
        yield put(orderApiResponseSuccess(OrderActionTypes.ORDER_PRINT_COMMAND_GET, response.data));
    } catch (error: any) {
        yield put(orderApiResponseError(OrderActionTypes.ORDER_PRINT_COMMAND_GET, error));
    }
}

function* getOrderHistory({payload: { branchId, page, from, to, search }, type}: OrderData): SagaIterator {
    try {
        let response = yield call(orderApiGetOrderHistory, { branchId,  page, from, to, search });
        let orderDocuments = response.data.docs as OrderDocument[];    
        yield put(orderApiResponseSuccess(OrderActionTypes.ORDER_GET_HISTORY, 
            { docs: orderDocuments, totalDocs: response.data.totalDocs, totalPages: response.data.totalPages }));
    } catch (error: any) {
        yield put(orderApiResponseError(OrderActionTypes.ORDER_GET_HISTORY, error));
    }
}

export function* watchGetOrders() {
    yield takeEvery( OrderActionTypes.ORDER_GET_ALL, getOrders);
}

export function* watchGetOrderById() {
    yield takeEvery( OrderActionTypes.ORDER_GET_ONE, getOrderById);
}

export function* watchGetPrintOrderCommand() {
    yield takeEvery( OrderActionTypes.ORDER_PRINT_COMMAND_GET, getPrintOrderCommand);
}

export function* watchGetOrderHistory() {
    yield takeEvery( OrderActionTypes.ORDER_GET_HISTORY, getOrderHistory);
}

function* orderSaga() {
    yield all([fork(watchGetOrders), fork(watchGetOrderById), fork(watchGetPrintOrderCommand),  fork(watchGetOrderHistory)]);
}

export default orderSaga;