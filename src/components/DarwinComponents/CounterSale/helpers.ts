import { t } from "i18next";
import { ItemCounterSale } from "./CounterSaleTable";

export function calculateTotal(items: ItemCounterSale[]) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
}


export enum PaymentMethod {
	CASH = 'CASH',
	CREDIT_CARD = 'CC',
	DEBIT_CARD = 'DC',
	VIRTUAL_WALLET = 'VW',
	UNKNOWN = 'UNKNOWN',
}

export function parsePaymentMethod(payment: PaymentMethod) {
    switch (payment) {
        case PaymentMethod.CASH:
            return t('Cash');
        case PaymentMethod.CREDIT_CARD:
            return t('Credit Card');
        case PaymentMethod.DEBIT_CARD:
            return t('Debit Card');
        case PaymentMethod.VIRTUAL_WALLET:
            return t('Application');
        case PaymentMethod.UNKNOWN:
            return t('Unknown');
        default:
            return t('Unknown');
    }
}