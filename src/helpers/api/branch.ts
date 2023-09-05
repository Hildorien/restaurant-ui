import DarwinApi from 'services/api/DarwinApi';

function getBranch() {
    const baseUrl = '/branch';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, undefined)
}

function getStores(params:  { branchId: number }) {
    const baseUrl = '/branch/store';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

export { getBranch, getStores }