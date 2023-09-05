import classNames from 'classnames';
import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CardSummaryProps } from './types';
import { Spinner } from 'components';


const CardSummary = ({ icon, title, subtitle, redirectText, redirectLink, colorCard, loading }: CardSummaryProps) => {
    return (
        <Card className={classNames('text-white', 'bg-' + colorCard)}>
            <Card.Body>
                <div className="text-center">
                    <i className={icon} style={{fontSize: '24px'}}></i>       
                </div>   
                <div className='text-center'>
                {loading ?
                    <Spinner className="m-2" color='white' /> :
                    <Card.Title as="h1" >{title}</Card.Title>
                }  
                </div>
                <div className="text-center">
                    <Card.Text>
                        {subtitle}
                    </Card.Text>           
                </div>    
            </Card.Body>
            <Card.Footer className={classNames('text-white', 'bg-' + colorCard)}>
                    <div style={{'textAlign': 'right'}}>
                        <Link style={{'color': 'white'}} to={redirectLink}>{redirectText}</Link>
                    </div>
            </Card.Footer>
        </Card>
    );
}

export default CardSummary
