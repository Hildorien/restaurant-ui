import { t } from "i18next";
import { OperationalMetricType } from "redux/operationalMetrics/types";
import { capitalizeFirstLetter } from "../SalesReport/utils";
import { MetricMetadata } from "./types";

export const metricMetadata: Record<OperationalMetricType, MetricMetadata> = {
    SCORING : {   
        name: t('Scoring'), 
        icon: 'uil-star',
        measure: '',
        trendMeasure: '%',
        show: true
    },
    CANCELLATIONS:  {
        name: t('Cancellation'),
        icon: 'uil-receipt',
        measure: '%',
        trendMeasure: '%',
        show: true
    },
    COOKING_TIME: {
        name: t('Delay'),
        icon: 'uil-clock',
        measure: 'min',
        trendMeasure: '%',
        tooltipMessage: t('Cooking time of your orders'),
        show: true
    },    
    AVAILABILITY: {
        name: t('Availability'),
        icon: 'uil-shop',
        measure: '%',
        trendMeasure: '%',
        show: false
    },
    PRODUCT_AVAILABILITY: {
        name: t('Product availability'),
        icon: 'uil-utensils',
        measure: '%',
        trendMeasure: '%',
        show: true
    }
}

export function convertToMonthNameLocale(year: number, month: number, language: any) {
    return capitalizeFirstLetter(new Date(year, month, 1).toLocaleString(language, { month: 'long' }));
}

export function shouldDisplayMetric(metricValue: number | undefined) {
    if (metricValue === null || metricValue === undefined) {
        return false;
    }
    return true;
}

export function noDataMessage(): string {
    return t("Not enough data to calculate metric");
}

export function getTrendIcon(metric: OperationalMetricType, variation: number | undefined): string {
    switch (metric) {
        case OperationalMetricType.CANCELLATIONS:
        case OperationalMetricType.COOKING_TIME:
            if (variation !== undefined && variation > 0) {
                return "mdi mdi-arrow-down-bold text-success";
            }
            if (variation !== undefined && variation < 0) {
                return "mdi mdi-arrow-up-bold text-danger";
            }
            if (variation !== undefined && variation === 0) {
                return "mdi mdi-equal text-info"
            }
            return '';
        case OperationalMetricType.SCORING:
        case OperationalMetricType.AVAILABILITY:
        case OperationalMetricType.PRODUCT_AVAILABILITY:
            if (variation !== undefined && variation > 0) {
                return "mdi mdi-arrow-up-bold text-success";
            }
            if (variation !== undefined && variation < 0) {
                return "mdi mdi-arrow-down-bold text-danger";
            }
            if (variation !== undefined && variation === 0) {
                return "mdi mdi-equal text-info"
            }
            return '';
        default:
            return '';
    }
}