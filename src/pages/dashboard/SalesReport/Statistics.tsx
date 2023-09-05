import { Col, Row } from 'react-bootstrap';
import {  SalesStatisticsProps } from './types';
import { capitalizeFirstLetter, getLocaleCurrencySymbol, parseNumberToLocaleCulture,  } from './utils';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import SalesReportStatisticsCard from './SalesReportStatisticsCard';
import ReactTooltip from 'react-tooltip';
import { Trend } from 'redux/salesReport/types';
import { ReportCardTrend } from './ReportCardTrend';

const Statistics = ({ data, loading }: SalesStatisticsProps) => {

    const { t } = useTranslation();
    const date: Date = data?.date || new Date();   
    const totalOrders: number = data?.totalOrders || 0;
    const totalAmount: number = data?.totalAmount || 0;

    const ordersFormatted: string = parseNumberToLocaleCulture(totalOrders);
    const profitFormatted: string = getLocaleCurrencySymbol() + ' ' + parseNumberToLocaleCulture(totalAmount);

    const orderTrend = data?.orderTrend as Trend;
    let reportCardOrderTrend;
    if (orderTrend && orderTrend.isUpward) {
        reportCardOrderTrend = ReportCardTrend.UpTrend(parseNumberToLocaleCulture(orderTrend.value), t('vs last month'))
    } else if (orderTrend && !orderTrend.isUpward) {
        reportCardOrderTrend = ReportCardTrend.DownTrend(parseNumberToLocaleCulture(orderTrend.value), t('vs last month'))
        
    }
    const amountTrend = data?.amountTrend as Trend;
    let reportCardAmountTrend;
    if (amountTrend && amountTrend.isUpward) {
        reportCardAmountTrend = ReportCardTrend.UpTrend(parseNumberToLocaleCulture(amountTrend.value), t('vs last month'))
    } else if (amountTrend && !amountTrend.isUpward) {
        reportCardAmountTrend = ReportCardTrend.DownTrend(parseNumberToLocaleCulture(amountTrend.value), t('vs last month'))
    }

    const firstDayOfMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateFrom = firstDayOfMonth.toLocaleDateString( i18n.language, options);
    const dateTo = new Date(date).toLocaleDateString( i18n.language, options);
    
    return (
        <>
            <Row>
                <Col sm={6}>
                    <SalesReportStatisticsCard 
                            title={t('Sales')}
                            subtitle={capitalizeFirstLetter(t('from')) + ' ' + dateFrom + ' ' +  t('to') + ' ' + dateTo}
                            stat={profitFormatted}
                            trend={reportCardAmountTrend}
                            renderTooltip={() => 
                                <ReactTooltip id={"stat-" + t('Sales')} place={'top'}>
                                    <span style={{fontSize: '11px'}}>{t("Doesn't include discounts, commisions and other taxes")}</span>
                                </ReactTooltip>
                            }
                            loading={loading}
                    />
                </Col>
                <Col sm={6}>
                    <SalesReportStatisticsCard 
                                title={t('Orders')}
                                subtitle={capitalizeFirstLetter(t('from')) + ' ' + dateFrom + ' ' +  t('to') + ' ' + dateTo}
                                stat={ordersFormatted}
                                trend={reportCardOrderTrend}
                                renderTooltip={() => 
                                    <ReactTooltip id={"stat-" + t('Orders')} place={'top'}>
                                        <span style={{fontSize: '11px'}}>{t("Doesn't include cancelled orders")}</span>
                                    </ReactTooltip>
                                }
                                loading={loading}
                        />
                </Col>
            </Row>
        </>
    );
};

export default Statistics;
