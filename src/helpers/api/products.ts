import DarwinApi from "services/api/DarwinApi";

function getProducts(params:  { branchId: number }) {
    const baseUrl = '/product';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

async function turnOnProduct(params: { productId: number, branchId: number }) {
    const baseUrl = '/product/' + params.productId.toString() + '?branchId=' + params.branchId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().update(`${baseUrl}`, {});
}

async function turnOffProduct(params: { productId: number, branchId: number, reason: string, otherReasonDescription?: string }) {
    const baseUrl = '/product/' + params.productId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().delete(`${baseUrl}`, 
    { params: { branchId: params.branchId }, 
    data: { "reason": params.reason, "reasonDescription": params.otherReasonDescription }});
}

function getOfflineProducts(params:  { branchId: number }) {
    const baseUrl = '/product/offline';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params);
}
export { getProducts, turnOnProduct, turnOffProduct, getOfflineProducts }