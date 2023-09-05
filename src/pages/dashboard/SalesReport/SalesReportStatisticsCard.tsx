import { Spinner } from 'components';
import React from 'react'
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SalesReportStatisticsCardProps } from './types';


const SalesReportStatisticsCard = (props: SalesReportStatisticsCardProps) => {
    const { t } = useTranslation();
    const tooltip = props.renderTooltip();
    const loading: boolean = props.loading;
    return(
        <Card className="tilebox-one">
                        <Card.Body>
                            { tooltip && 
                            <div>
                                <i data-tip={"stat-" + props.title} data-for={'stat-' + props.title} className="uil uil-comment-info" 
                                    style={{fontSize: '16px'}}></i>
                                {tooltip}
                            </div>
                            }
                            
                            <h5 className="text-uppercase mt-0">{props.title}</h5>
                            { props.subtitle &&  <div className="text-nowrap">
                                {props.subtitle}
                            </div> }
                            {loading ?
                                <Spinner className="m-2" color='secondary' /> :
                                <h2 className="my-2" id="active-users-count">
                                {props.stat}
                                </h2>
                            }  
                            { props.trend && 
                            <div className="mb-0 text-muted">
                                {loading ?
                                <Spinner className="spinner-border-sm m-2" color='secondary' /> :
                                (
                                <>
                                <span className= {props.trend.textClass}>
                                    <span className={props.trend.icon}></span> {props.trend.value} 
                                </span>
                                <span className="text-nowrap">{t(props.trend.time)}</span>
                                </>
                                )
                                }
                            </div> 
                            }
                        </Card.Body>
        </Card>
    );
};

export default SalesReportStatisticsCard;