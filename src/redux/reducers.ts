import { combineReducers } from 'redux';
import Auth from './auth/reducers';
import Layout from './layout/reducers';
import Branch from './branch/reducers';
import Connectivity from './connectivity/reducers';
import Products from './products/reducers';
import Brands from './brands/reducers';
import SalesReport from './salesReport/reducers';
import OperationalMetrics from './operationalMetrics/reducers';
import Printer from './printer/reducers';
import Orders from './orders/reducers';

export default combineReducers({
    Auth,
    Layout,
    Branch: Branch,
    Connectivity,
    Products,
    Brands,
    SalesReport,
    OperationalMetrics,
    Printer,
    Orders
});
