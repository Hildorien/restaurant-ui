import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { DarwinRowOfCardsProps } from './types'

export const DarwinRowOfCards = ({ cards }: DarwinRowOfCardsProps) => {
  return (
    <Row>
        {
            cards.map( (c, index) => {
                return (
                    <Col className='my-2' xxl={3} md={6} key={index.toString()}>
                        {c}
                    </Col>
                )
            })
        }              
    </Row>
  )
}
