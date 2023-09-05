import React from 'react'
import { Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MetricCardProps } from './types'
import { Spinner } from 'components';
import { t } from 'i18next';
import { noDataMessage, shouldDisplayMetric } from './utils';

export const MetricCard4 = ({title, metricValue, metricMeasure, trendIcon, trendValue, icon, lastMonthValue, loading, 
    trendMeasure, tooltipMessage }: MetricCardProps) => {
    const displayMetricValue = shouldDisplayMetric(metricValue);
    const displayLastMonthValue = shouldDisplayMetric(lastMonthValue);
    return (
    <Card className="card h-100">
        <Card.Body>
            <div className='text-center'>
                <h3>
                    <i style={{'opacity': '0.5'}} className={icon}><span>{'   '}</span></i><span>{title}</span>
                    { tooltipMessage && 
                        (<>
                        <span>{'   '}</span>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="overlay-example">
                        {tooltipMessage}</Tooltip>}>
                        <b><i className="uil uil-comment-info" style={{'fontSize': '18px'}}></i> </b>                   
                        </OverlayTrigger>
                        </>
                        )
                    }
                </h3>
            </div>
            { 
                displayMetricValue &&
                (<div className='text-center'>
                    { loading ? 
                    (<Spinner className="m-2" color='secondary' />) :
                    (<h2>{metricValue + ' ' + metricMeasure}</h2>)
                    }
                </div>)
            }
            { !displayMetricValue &&
                    (<div className='text-center'>
                        <h3 className="p-4 text-muted hidden">
                            <span style={{'fontSize': '21px'}}>{t('No data')}</span>
                            <span>{"    "}</span>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="overlay-example">
                                {noDataMessage()}</Tooltip>}>
                                <i className="uil uil-comment-info"></i>                    
                            </OverlayTrigger>                           
                        </h3>
                    </div>)
            }
            {
                displayMetricValue &&
                <Row>
                <Col>
                    <div className='text-center text-muted'>
                    { loading ?
                    (null) :
                    
                    displayLastMonthValue ?
                        (<h4>
                            <i className={trendIcon}></i>{'    ' + trendValue + ' ' + trendMeasure}         
                        
                        
                        </h4>) :
                        (' -- ')
                    }
                    <h4>{t('Variation')}</h4> 
                    </div>
                </Col>
                <Col>
                    <div className='text-center text-muted hidden'>
                        { loading ? 
                        (null) :
                        displayLastMonthValue ?
                            (<h4>{lastMonthValue + ' ' + metricMeasure}</h4>) :
                            (' -- ')
                        }
                        <h4>{t('Previous month')}</h4>
                    </div>
                </Col>               
                </Row>
            }
        </Card.Body>
    </Card>
  )
}
