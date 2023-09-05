import i18n from 'i18n';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../SalesReport/utils';
import { BrandMetrics4 } from './BrandMetrics4';
import useOperationalMetrics from './hooks/useOperationalMetrics';
import { OperationalMetric, OperationalMetricBrand } from 'redux/operationalMetrics/types';
import { MetricCardProps, MetricMetadata } from './types';
import { getTrendIcon, metricMetadata } from './utils';
import ErrorCard from 'components/DarwinComponents/ErrorCard';
import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import useBrands from 'pages/products/hooks/useBrands';
import { Brand } from 'redux/brands/types';
import MissingData from 'components/DarwinComponents/MissingData';
import { BranchContextType, BranchContext } from 'context/BranchProvider';

const OperationalMetrics = () => {
    const { t } = useTranslation();
    //Set date range
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString(i18n.language, { month: 'long' });

    //Import hooks to gather data
    const { loading, operationalMetricsInfo, onRequest: onRequestOperationalMetrics, error } = useOperationalMetrics();
    const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
    const { brandInfo, onRequest: onRequestBrands } = useBrands();


    //Initialize state variables from this section
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
    const [brandMetrics, setBrandMetrics] = useState<OperationalMetricBrand[]>([]);

    /**
     * isZombie refers to the Brand condition. If a Brand isZombie it means that the volume of sales was low
     */
    const parseOperationalMetricsToProps = (metrics: OperationalMetric[], isZombie: boolean): MetricCardProps[] => {
      let rv: MetricCardProps[] = [];
      for(const metric of metrics) {
        const metadata: MetricMetadata = metricMetadata[metric.name];
        const metricProp: MetricCardProps = {
          title: metadata.name,
          metricValue: metric?.value,
          metricMeasure: metadata.measure,
          trendIcon: getTrendIcon(metric.name, metric.variation),
          trendValue: Math.abs(metric?.variation || 0).toString(),
          trendMeasure: metadata.trendMeasure,
          icon: metadata.icon,
          lastMonthValue: metric?.lastMonthValue,
          isZombie: isZombie,
          tooltipMessage: metadata.tooltipMessage,
          show: metadata.show
        }
        rv.push(metricProp);
      }

      return rv;
    }

    useEffect(() => {
      if (operationalMetricsInfo) {
        setBrandMetrics(operationalMetricsInfo);
      }
    }, [operationalMetricsInfo]);  //This only happens when branch is changed
   
    //Fetch new data based on activeBranch
    useEffect(() => {
      if (activeBranch !== currentBranchId) {
          onRequestOperationalMetrics(currentBranchId);
          onRequestBrands(currentBranchId);
          setActiveBranch(currentBranchId);
      }
    }, [activeBranch, currentBranchId, onRequestOperationalMetrics, onRequestBrands ]);


    return (
      <>
          <Row>
            <DarwinSectionTitle 
              title={t("Operational metrics")}
              subtitle={t('In this section you can find operational metrics related to your brands')} />
          </Row>

          <Row>
            <Col>
                <h5>{'Últimos 30 días vs ' +  capitalizeFirstLetter(month)}</h5>
            </Col>
          </Row>      
          
          { !error && 
              (brandMetrics
              .sort(function (b1: OperationalMetricBrand, b2: OperationalMetricBrand): number {
                return b1.brandName < b2.brandName ? -1: 1; 
              })
              .map( (bm, index)  => {
                return (
                  <Row key={index} className="mt-2">
                      <BrandMetrics4
                            title={bm.brandName}
                            logoSrc={(brandInfo as Brand[] || [])
                              .find((br: Brand) => br.name === bm.brandName)?.logoSmall || ''}
                            metricsProps={parseOperationalMetricsToProps(bm.metrics, bm.isZombie)}
                            loading={loading}
                        />
                        <hr></hr>
                  </Row>
                );
              }))
          }

          { error && 
            (<Row>
              <Col lg={4} sm={6}></Col> 
              <Col lg={4} sm={6}>
                <ErrorCard 
                  errorMessage={
                    error === 'USER_NOT_ALLOWED' ? 
                    t("You don't have permission to view this information"):
                    t('Operational metrics is not available right now, try refreshing the webpage')}
                  />
              </Col>
              <Col lg={4} sm={6}></Col> 
            </Row>)
          }
          {
            operationalMetricsInfo && operationalMetricsInfo.length === 0 &&
            (
              <MissingData title="Your brands don't have show metrics yet"/>
            )
          }
      </>
    )
}

export { OperationalMetrics }
