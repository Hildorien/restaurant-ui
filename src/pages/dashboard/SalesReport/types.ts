import { ReportCardTrend } from "./ReportCardTrend";
import ReactTooltip from "react-tooltip";
import { ReactElement } from "react";
import { AccumulatedSalesData } from "redux/salesReport/types";

export interface SalesStatisticsProps {
    data: AccumulatedSalesData | undefined;
    loading: boolean
}

export interface PerformanceChartProps {
    data: AccumulatedSalesData[];
    loading: boolean
}

export interface SalesReportStatisticsCardProps {
    title: string;
    subtitle?: string;
    stat: string;
    trend?: ReportCardTrend;
    renderTooltip: () => ReactElement<ReactTooltip>;
    loading: boolean;
}
