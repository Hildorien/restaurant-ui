import i18n from "i18n";
import { t } from "i18next";
import { CardSummaryData, ConnectivityCardData, ProductCardData, SalesCardData } from "./types";

export function createCardData({ ordersInMonth, loadingSalesInMonth}: SalesCardData , 
    { offlineBrands, loadingOfflineBrandQty, errorBrandOfflineQty}: ConnectivityCardData,
    { offlineProducts, loadingProductsOfflineQty, errorProductsOfflineQty}: ProductCardData,
    canViewSales: boolean) {
    const cards: CardSummaryData[] = [ 
        { 
            key: 'Sales',
            data: 
            {   icon: 'uil-chart', 
                title: (ordersInMonth?.totalOrders || 0).toString(), 
                subtitle: t('Orders of') + ' ' + 
                (ordersInMonth?.date !== undefined ? 
                new Date(ordersInMonth.date).toLocaleString(i18n.language, { month: 'long' }) : 
                ''), 
                redirectText: t('Manage your sales'), 
                redirectLink: '/dashboard/sales-report', 
                colorCard: 'secondary', 
                loading: loadingSalesInMonth,
            }, 
            visible: canViewSales
        },
        { 
            key: 'Connectivity',
            data: 
            {   icon: 'uil-toggle-on', 
                title: offlineBrands.toString(), 
                subtitle: offlineBrands === 1 ?  t('Offline brand') : t('Offline brands'), 
                redirectText: t('Manage connectivity'), 
                redirectLink: '/connectivity', 
                colorCard: 'secondary', 
                loading: loadingOfflineBrandQty,
            }, 
            visible: !errorBrandOfflineQty 
        },
        { 
            key: 'Products',
            data: 
            {   icon: 'mdi mdi-food-outline',
                title: offlineProducts.toString(), 
                subtitle: offlineProducts === 1 ? t('Offline product') : t('Offline products'), 
                redirectText: t('Manage your products'), 
                redirectLink: '/products', 
                colorCard: 'secondary', 
                loading: loadingProductsOfflineQty,
            }, 
            visible: !errorProductsOfflineQty 
        }
    ]
    return cards;
}