import Chart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import { ApexOptions } from 'apexcharts';
import { PerformanceChartProps } from './types';
import { getLocaleCurrencySymbol, parseNumberToLocaleCulture, toMonthName } from './utils';
import { t } from 'i18next';
import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from 'react';

export type SeriesChartData = {
    month: string;
    sales: number;
    orders: number;
}

const PerformanceChart = ({ data, loading }: PerformanceChartProps) => {

    const round: number = 1000;
    const [dataSeries, setDataSeries] = useState<SeriesChartData[]>([]);

    useEffect(() => {
        if (data) {
            let newData = [];
            for (const dataInMonth of data) {
                newData.push({
                    month: toMonthName(new Date(dataInMonth.date).getMonth()),
                    sales: dataInMonth.totalAmount / round,
                    orders: dataInMonth.totalOrders
                })
            }
            setDataSeries(newData);
        }
    }, [data]);
    
    const apexBarChartData: ApexAxisChartSeries = [
        {
            name: t('Sales'),
            data: dataSeries.map(d => d.sales) 
        },
        {
            name: t('Orders'),
            data: dataSeries.map(d => d.orders),
        },
    ];
    
    const apexBarChartOpts: ApexOptions = {
        chart: {
            height: 260,
            type: 'bar',
            stacked: true,
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        legend: {
            show: false,
        },
        colors: ['#727cf5', '#fff'],
        xaxis: {
            categories: dataSeries.map(d=> d.month),
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            seriesName: t('Sales'),
            labels: {
                formatter: function (val) {
                    return val + 'k';
                },
            },
            
        },
        fill: {
            opacity: [1, 0],
        },
        tooltip: {        
            enabledOnSeries: [0],
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    return getLocaleCurrencySymbol() + ' ' + parseNumberToLocaleCulture(val * round) + ' - ' + 
                             (series[1][dataPointIndex] || '') + ' ' + t('Orders').toLocaleLowerCase();
                    
                },
            },
        },
    };

    return (
        <Card className="tilebox-one"/*"card-h-100"*/>
            <Card.Body>               
                <div>
                    <i data-tip="performance-chart" data-for="performance-chart" className="uil uil-comment-info float-end"
                    style={{fontSize: '16px'}}></i>
                    <ReactTooltip id={"performance-chart"} place={'top'}>
                        <span style={{fontSize: '11px'}}>{t("Doesn't include discounts, commisions and other taxes")}</span>
                    </ReactTooltip>
                </div>
                {
                     <h5 className="text-uppercase mt-0">{t("Monthly evolution")}</h5>
                }
                <div dir="ltr">
                    <Chart
                        options={apexBarChartOpts}
                        series={apexBarChartData}
                        type="bar"
                        className="apex-charts"
                        height={255}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PerformanceChart;
