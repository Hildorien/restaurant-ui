import { t } from 'i18next'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { MissingDataProps } from './types'

const MissingData = ({ title }: MissingDataProps) => {
  return (
    <Row>
        <Col lg={3} sm={6}></Col> 
        <Col lg={6} sm={6}>
          <Card>
            <h4 className='text-center'>
                {t(title)}
            </h4>
            <p className='text-center'>
              {t('Contact our support staff from Whatsapp')}
            </p>
          </Card>
        </Col>
        <Col lg={3} sm={6}></Col> 
    </Row>
  )
}


export default MissingData