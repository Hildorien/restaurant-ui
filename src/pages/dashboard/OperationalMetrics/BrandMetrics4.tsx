import { DarwinRowOfCards } from 'components/DarwinComponents/DarwinRowOfCards'
import config from 'config/config'
import React from 'react'
import { Row } from 'react-bootstrap'
import { MetricCard4 } from './MetricCard4'
import { MetricsBrandCardProps } from './types'

export const BrandMetrics4 = ({ title, logoSrc, metricsProps, loading}: MetricsBrandCardProps) => {
    return (
        <>
            <Row>
              <h3 style={{'position': 'relative'}}>
              { logoSrc !== '' &&
                <img 
                    src={config.imageUrl + logoSrc} 
                    title={title}
                    alt="brandLogo" style={{borderRadius: '50%', 'marginRight': '20px' }} height="48" width="48"/>
              } 
              {title}
              </h3>
            </Row>          
            
            <DarwinRowOfCards 
              cards={
                metricsProps.filter(metric => metric.show).map(mp => {
                  return(
                      <MetricCard4 
                        title={mp.title}
                        metricValue={mp.metricValue}
                        metricMeasure={mp.metricMeasure}
                        trendIcon={mp.trendIcon}
                        trendValue={mp.trendValue}
                        trendMeasure={mp.trendMeasure}
                        icon={mp.icon}
                        lastMonthValue={mp.lastMonthValue}
                        loading={loading}
                        isZombie={mp.isZombie}
                        tooltipMessage={mp.tooltipMessage}
                        show={mp.show}
                        />)
                    })
              } />
        </>
    )
}
