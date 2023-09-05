import { parseSearchTextForOrders, splitDate } from "pages/orders/utils";
import DarwinApi from "services/api/DarwinApi";
import { PrinterApiError } from "./apiError";
import { PaymentMethod } from "darwinModels";

export type LocalOrder = {
	products: LocalOrderProduct[];
	brandId: number;
	branchId: number;
	paymentMethod: PaymentMethod;
};

export type LocalOrderProduct = {
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
};


function getPrintOrderCommand(params:  { orderId: string }) {
    const baseUrl = '/order/' + params.orderId + '/print';
    return DarwinApi.getInstance().get(`${baseUrl}`, {})
}

async function getOrdersForDelivery(params: { branchId: string, page?: number }) {
    let baseUrl = '/order/delivery?branchId=' + params.branchId;
    if (params.page) {
        baseUrl = baseUrl + '&page=' + params.page;
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, {})
}

function getOrderById(params: { orderId: string}) {
    const baseUrl = '/order/' + params.orderId;
    return DarwinApi.getInstance().get(`${baseUrl}`, {})
}

function acceptOrder(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/accept';
    return DarwinApi.getInstance().create(baseUrl, {});

}

function rejectOrder(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/reject';
    return DarwinApi.getInstance().create(baseUrl, { reason: 'Rejected by kitchen' });

}

function deliverOrder(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/delivered';
    return DarwinApi.getInstance().create(baseUrl, {});
}

function readyOrder(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/ready';
    return DarwinApi.getInstance().create(baseUrl, {});
}

function takeOrder(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/take';
    return DarwinApi.getInstance().create(baseUrl, {});
}

/**
 * 
 * @returns Returns order printer commands of that are NEW for the past 15 minutes
 */
function getOrdersCommands() {
    const baseUrl = '/order/commands';
    return DarwinApi.getInstance().get(baseUrl, {});
}

async function getOrderHistory(params: { branchId: string, page?: number, from?: Date, to?: Date, search?: string }) {
    let queryParameters = {};
    queryParameters = { ...queryParameters, branchId: params.branchId };
    if (params.page) {
        queryParameters = { ...queryParameters, page: params.page };
    }
    if (params.from) {
        queryParameters = { ...queryParameters, from: splitDate(params.from, '-') };
    }
    if (params.to) {
        queryParameters = { ...queryParameters, to: splitDate(params.to, '-') };
    }
    if (params.search) {
        queryParameters = { ...queryParameters, s: parseSearchTextForOrders(params.search) };
    }
    return DarwinApi.getInstance().get('/order', queryParameters)
}

function markOrderAsMarketing(params: {orderId: string}) {
    const baseUrl = '/order/' + params.orderId + '/marketing';
    return DarwinApi.getInstance().update(baseUrl, {});
}

function sendOrderPrintError(params: {orderId: string, error: PrinterApiError}) {
    const baseUrl =  '/order/' + params.orderId + '/print/error';
    return DarwinApi.getInstance().update(baseUrl, {  message: params.error.message });

}

function createLocalOrder(localOrder: LocalOrder) {
    const baseUrl = '/order';
    return DarwinApi.getInstance().create(baseUrl, localOrder);
}

export { getPrintOrderCommand, getOrderById, getOrdersForDelivery as getOrders, acceptOrder, rejectOrder, 
    deliverOrder, readyOrder, takeOrder, getOrdersCommands, getOrderHistory, markOrderAsMarketing, sendOrderPrintError, createLocalOrder }