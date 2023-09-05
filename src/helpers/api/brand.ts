import DarwinApi from "services/api/DarwinApi";

function getBrandsByBranchId(params:  { branchId: number }) {
    const baseUrl = '/brand';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

export { getBrandsByBranchId }