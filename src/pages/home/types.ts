import { SalesReportAccumulatedOrdersQty } from "redux/salesReport/types";

export type CardSummaryProps = {
    icon: string;
    title: string;
    subtitle: string;
    redirectText: string;
    redirectLink: string;
    colorCard: string;
    loading: boolean;
};

export type CardSummaryData = {
    key: string;
    data: CardSummaryProps;
    visible: boolean;
}

export type SalesCardData = {
    ordersInMonth: SalesReportAccumulatedOrdersQty | undefined;
    loadingSalesInMonth: boolean;
}

export type ConnectivityCardData = {
    offlineBrands: number;
    loadingOfflineBrandQty: boolean;
    errorBrandOfflineQty: string
}

export type ProductCardData = {
    offlineProducts: number;
    loadingProductsOfflineQty: boolean;
    errorProductsOfflineQty: string
}