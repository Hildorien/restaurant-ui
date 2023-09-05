import DarwinApi from "services/api/DarwinApi";

function getConnectivityInfo(params: {  branchId: number, companyId: number, app: string, appStoreId: string }){
    const baseUrl = '/connectivity';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, {})
}

function turnOnBrand(params: { brandId: number, branchId: number }) {
    const baseUrl = '/connectivity/store/' + params.brandId.toString() + '?branchId=' + params.branchId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().update(`${baseUrl}`, {});
}

function turnOffBrand(params: { brandId: number, reason: string, branchId: number, otherReasonDescription?: string }) {
    const baseUrl = '/connectivity/store/' + params.brandId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().delete(`${baseUrl}`, 
    { params: { branchId: params.branchId }, 
    data: { "reason": params.reason, "reasonDescription": params.otherReasonDescription }});
}

function turnOnAllBrands(params: { branchId: number }) {
    const baseUrl = '/connectivity?branchId=' + params.branchId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().update(`${baseUrl}`, {});
}

function turnOffAllBrand(params: { reason: string, branchId: number, otherReasonDescription?: string }) {
    const baseUrl = '/connectivity';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().delete(`${baseUrl}`, 
    { params: { branchId: params.branchId }, 
    data: { "reason": params.reason, "reasonDescription": params.otherReasonDescription }});
}

function getOfflineBrands(params:  { branchId: number }) {
    const baseUrl = '/connectivity/offline';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params);
}

export { getConnectivityInfo, turnOnBrand, turnOffBrand, turnOnAllBrands, turnOffAllBrand, getOfflineBrands }