import { lastDayOfEachMonthOfGivenYear } from 'pages/dashboard/SalesReport/utils';
import { SalesReportData, SeriesData } from 'redux/salesReport/types';

  
const randomIntFromInterval = function(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateSales(brandId: number): SalesReportData {
    const lastYearDates = lastDayOfEachMonthOfGivenYear(new Date().getFullYear());
    let series: SeriesData[] = [];
    for(const date of lastYearDates) {
        const totalOrdersInDay = randomIntFromInterval(5,30);
        const totalProfitOfTheDay = (totalOrdersInDay *  randomIntFromInterval(800, 1200)) - randomIntFromInterval(100,200);
        series.push({
            date: date,  
            totalOrders: totalOrdersInDay, 
            totalAmount: totalProfitOfTheDay,
            });
    }
    const accumulatedSalesData = {
        date: series[series.length-1].date,
        totalOrders: series[series.length-1].totalOrders,
        totalAmount: series[series.length-1].totalAmount,
        orderTrend: {
            value: 0,
            isUpward: true
        },
        amountTrend: {
            value: 0,
            isUpward: true
        }
    }
    
    return { series: series, accumulatedSalesData: accumulatedSalesData, brandId: brandId }

}