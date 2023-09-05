export type AccumulatedSalesData = {
    date: Date;
    totalOrders: number;
    totalAmount: number;
	orderTrend?: Trend;
	amountTrend?: Trend;
}

export type Trend = {
	value: number;
	isUpward: boolean
}

export type SeriesData = {
	date: Date;
	totalOrders: number;
	totalAmount: number;
}

export type SalesReportData = {
	series: SeriesData[];
	accumulatedSalesData: AccumulatedSalesData;
	brandId?: number;
}

export type SalesReportAccumulatedOrdersQty = {
	date: Date;
	totalOrders: number;
	brandId?: number;
}