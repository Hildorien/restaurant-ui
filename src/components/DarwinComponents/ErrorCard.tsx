import React from 'react'
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorCardProps } from './types';

const ErrorCard = ({ errorMessage }: ErrorCardProps) => {
    const { t } = useTranslation();

    return (
        <Card className="cta-box bg-danger text-white">
        <Card.Body>
            <div className="d-flex align-items-center">
                <div className="w-100 overflow-hidden">
                    <h2 className="mt-0">
                        <i className="mdi mdi-alert"></i>
                    </h2>
                    <h3 className="m-0 fw-normal cta-box-title">
                        <p className="text-center">
                          {t(errorMessage)}
                        </p>                                        
                    </h3>
                </div>
            </div>
        </Card.Body>
        </Card>
  )
}

export default ErrorCard;