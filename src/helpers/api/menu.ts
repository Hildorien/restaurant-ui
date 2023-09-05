import { Menu } from "pages/menu/types";
import DarwinApi from "services/api/DarwinApi";

function getProductsForMenu(params:  { branchId: number, brandId: number }) {
    const baseUrl = '/menu/products';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

function getMenus(params:  { branchId: number }) {
    const baseUrl = '/menu';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

function getApps(params:  { branchId: number, brandId: number }) {
    const baseUrl = '/menu/apps';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

function createMenu(branchId: number, brandId: number, menu: Menu) {
    const baseUrl = '/menu?branchId=' + branchId.toString() + '&brandId=' + brandId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().create(`${baseUrl}`, menu)
}

function updateMenu(branchId: number, brandId: number, menu: Menu) {
    const baseUrl = '/menu?branchId=' + branchId.toString() + '&brandId=' + brandId.toString();
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().update(`${baseUrl}`, menu)
}

function getModifierGroups(params: { branchId: number, productId: number }) {
    const baseUrl = '/menu/groups';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

function getPublishedMenus(params: { branchId: number, menuId: string, app: string}) {
    const baseUrl = '/menu/publish';
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().get(`${baseUrl}`, params)
}

function publishMenu(branchId: number, menuId: string) {
    const baseUrl = '/menu/publish?branchId=' + branchId.toString() + '&menuId=' + menuId;
    const user = DarwinApi.getInstance().getLoggedInUser();
    if (!user) {
       throw new Error('User is not logged in');
    }
    return DarwinApi.getInstance().create(`${baseUrl}`, {})
}

function deleteMenu(branchId: number, brandId: number, menu: Menu) {
    const baseUrl = 'menu?branchId=' + branchId.toString() + '&brandId=' + brandId.toString();
    return DarwinApi.getInstance().delete(`${baseUrl}`, { data: menu });
}

export { getProductsForMenu, getMenus, getApps, createMenu, updateMenu, getModifierGroups, getPublishedMenus, publishMenu, deleteMenu }
