import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import branchSaga from './branch/saga';
import connectivitySaga from './connectivity/saga';
import productsSaga from './products/saga';
import brandSaga from './brands/saga';
import salesReportSaga from './salesReport/saga';
import operationalMetricsSaga from './operationalMetrics/saga';
import printerSaga from './printer/saga';
import orderSaga from './orders/saga';

export default function* rootSaga() {
    yield all([authSaga(), layoutSaga(), branchSaga(), connectivitySaga(), productsSaga(), brandSaga(), salesReportSaga(), 
        operationalMetricsSaga(), printerSaga(), orderSaga() ]);
}
