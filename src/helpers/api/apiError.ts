import { t } from 'i18next';
class PrinterApiError extends Error {
    constructor(error: any) {
        super(error);
        this.name = "PrinterError";
        this.message = error.message || error.error || JSON.stringify(error);
    }

    public toFriendlyNotificationMessage(orderId: string) {
        return `${t('Order')} ${orderId} ${t("couldn't be printed")}.`
    }
}
class PrintOrderCommandApiError extends Error {
    constructor(error: any) {
        super(error);
        this.name = "OrdersApiError";
        this.message = error.message || error.error || JSON.stringify(error);
    }
    
    public toFriendlyNotificationMessage(orderId: string) {
        if (orderId) {
            return `${t('Order')} ${orderId} ${t("doesn't have a print command to print")}.`
        }
        return `${t('There is a problem receiving orders. Please restart the application')}.`
    }
}
class OrderApiError extends Error {
    constructor(error: any) {
        super(error);
        this.name = "OrdersApiError";
        this.message = error.message || error.error || JSON.stringify(error);
    }
    
    public toFriendlyNotificationMessage(orderId: string, taken: boolean) {
        return `${t('Order')} ${orderId} ${t("couldn't be")} ${taken ? t('taken') : t('accepted')}.`
    }
}

class ElectronApiError extends Error {
    constructor(error: any) {
        super(error);
        this.name = "ElectronApiError";
    }
}

export { PrinterApiError, PrintOrderCommandApiError, OrderApiError, ElectronApiError };
