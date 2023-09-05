export type OperationalMetricBrand = {
    brandName: string;
    isZombie: boolean;
    metrics: OperationalMetric[];
}

export enum OperationalMetricType {
	SCORING = 'SCORING',
	CANCELLATIONS = 'CANCELLATIONS',
	AVAILABILITY = 'AVAILABILITY',
	COOKING_TIME = 'COOKING_TIME',
    PRODUCT_AVAILABILITY = 'PRODUCT_AVAILABILITY'
}

export type OperationalMetric = {
    name: OperationalMetricType;
    value?: number;
    lastMonthValue?: number;
    variation?: number;
}

export type BrandRecord = {
    brandId: number;
    brandName: string;
    year: number;
    month: number;
    monthName: string;
	score: number;
	delay: number;
	cancellation: number;
	availability: number;
    isZombie: boolean
    brandLogoSrc?: string;
    productAvailability?: number;
}