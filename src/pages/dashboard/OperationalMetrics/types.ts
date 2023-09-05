export interface MetricsBrandCardProps {
    title: string;
    logoSrc: string;
    metricsProps: MetricCardProps[];
    loading: boolean;
}

export interface MetricCardProps {
    title: string;
    metricValue?: number;
    metricMeasure: string;
    trendIcon: string;
    trendValue: string;
    trendMeasure: string;
    icon?: string;
    lastMonthValue?: number;
    loading?: boolean;
    isZombie: boolean;
    tooltipMessage?: string
    show: boolean;
}

export interface MetricCard2Props {
    title: string;
    metricValue: string;
    metricMeasure: string;
    trend: string;
    trendValue: string;
    chartType: 'line' | 'bar';
    colors: Array<string>;
    data: Array<number>;
    strokeWidth: number;
}

export interface MetricMetadata {
    name: string;
    icon: string;
    measure: string;
    trendMeasure: string;
    tooltipMessage?: string; //If metric title needs clarification
    show: boolean;
}