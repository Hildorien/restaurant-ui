import config from "config/config";
import { parseDeliveryTranslationToDeliveryMethod, parseOrderStatusTranslationToOrderStatus } from "pages/kitchen/utils";

export function calculateOrderDiscount(pricing: any) {
    const discounts = pricing.totalProducts - pricing.totalOrder;
    return Math.abs(Math.round((discounts + Number.EPSILON) * 100) / 100)
}

export function splitDate(date: Date, separator: string):string {
    return String(date.getDate()).padStart(2, '0') + separator + String(date.getMonth()+1).padStart(2, '0') + separator + String(date.getFullYear());
}

/**
 * This function takes the input of the search of the orders table and tries to parse it based on the translations of the fields
 * @param search 
 * @returns 
 */
export function parseSearchTextForOrders(search: string) {
    search = search.trim();

    //Try to search for an app with the same name as the search and return the app code
    const appNames = config.appNames;
    const apps: [string, string][] = Object.entries(appNames);
    const appNamesRegex = apps.filter(app => {
        return app[1].toLowerCase() === search.toLowerCase();
    });
    if (appNamesRegex.length > 0) {
        return appNamesRegex[0][0];
    }
    //Try to search for a delivery method with the same name as the search and return the delivery method code
    const deliveryMethodSearch = parseDeliveryTranslationToDeliveryMethod(search);
    if (deliveryMethodSearch) {
        return deliveryMethodSearch.toString();
    }
    //Try to search for the status with ther same name as the search and return the status code
    const status = parseOrderStatusTranslationToOrderStatus(search);
    if (status) {
        return status.toString();
    }
    return search;
}

export function fromDateStringToDate(dateString: string): Date | null {
    if (dateString) {
        const dateParts = dateString.split('-');
        return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);   
    }
    return null;
}