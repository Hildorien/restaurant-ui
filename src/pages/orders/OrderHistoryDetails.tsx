import { t } from 'i18next';
import { OrderDocument, OrderProductDocument } from "darwinModels";
import { Card, Col, Row } from 'react-bootstrap';
import { calculateOrderDiscount } from './utils';
export interface OrderHistoryDetailsProps {
    order: OrderDocument;
}

const Items = ({ items }: { items: OrderProductDocument[] }) => {
    return (
        <div className="table-responsive">
            <table className="table mb-0 ">
                <thead className="table-light">
                    <tr>
                        <th>{t('Product')}</th>
                        <th className='text-center'>{t('Quantity')}</th>
                        <th className='text-center'>{t('Unit price')}</th>
                    </tr>
                </thead>
                <tbody>
                    {(items || []).map(item =>                      
                        <ItemRow item={item} key={item.name} />)
                    }
                </tbody>
            </table>
        </div>
    );
};

const ItemRow = ({ item }: { item: OrderProductDocument}) => {
    return  (<>
            <tr key={item.name}>
                <td>{item.name}{`${item.comment ? ' ( ' + item.comment + ' )' : ''}`}</td>
                <td className='text-center'>{item.quantity}</td>
                <td align='right'>$ {item.unitPrice}</td>
            </tr>
            {(item.subItems || []).map(subitem => 
                <tr key={subitem.name}>
                    <td className='ps-4' >{subitem.name}{`${subitem.comment ? ' ( ' + subitem.comment + ' )' : ''}`}</td>
                    <td className='text-center'>{subitem.quantity}</td>
                    <td align='right'>$ {subitem.unitPrice}</td>
                </tr>)}
            </>
            )
}

const Pricing = ({ pricing }: { pricing: any}) => {
    return (
        <div className="table-responsive">
            <table className="table mb-0 ">
                <thead className="table-light">
                    <tr>
                        <th>{t('Amount')}</th>
                        <th className='text-center'>{t('Value')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>{t('Total products')}:</b></td>
                        <td align='right'>$ {pricing.totalProducts}</td>
                    </tr>
                    <tr>
                        <td><b>{t('Discounts')}:</b></td>
                        <td align='right'>$ {calculateOrderDiscount(pricing)}</td>
                    </tr>
                    <tr>
                        <td><b>Total:</b></td>
                        <td align='right'>$ {pricing.totalOrder}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export const OrderHistoryDetails = ({ order }: OrderHistoryDetailsProps) => {
    return (
        <>
        <Row>
            <Col>
                <Row>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mb-3">{t('Products')}</h4>
                            <Items items={order.products} />
                        </Card.Body>
                    </Card>
                </Row>
                <Row>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mb-3">{t('Totals')}</h4>
                            <Pricing pricing={order.pricing} />
                        </Card.Body>
                    </Card>
                </Row>
                {   order.observations &&
                    <Row>
                        <div className='mx-2'>
                        <h4 className="header-title mb-3">{t('Order observation')}:</h4>
                        <p>{order.observations}</p>
                        </div>
                    </Row>
                }
            </Col>
        </Row>
        </>
    )
}
