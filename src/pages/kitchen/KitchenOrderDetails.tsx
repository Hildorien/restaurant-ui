import { t } from 'i18next';
import { Card, Col, Row } from 'react-bootstrap';
import { KitchenOrderDetailsProps, KitchenOrderItem } from "./types";


const Items = ({ items }: { items: KitchenOrderItem[] }) => {
    return (
        <div className="table-responsive">
            <table className="table mb-0 ">
                <thead className="table-light">
                    <tr>
                        <th>{t('Product')}</th>
                        <th className='text-center'>{t('Quantity')}</th>
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

const ItemRow = ({ item }: { item: KitchenOrderItem}) => {
    return  (<>
            <tr key={item.name}>
                <td>{item.name}{`${item.comment ? ' ( ' + item.comment + ' )' : ''}`}</td>
                <td className='text-center'>{item.quantity}</td>
            </tr>
            {(item.subItems || []).map(subitem => 
                <tr key={subitem.name}>
                    <td className='ps-4' >{subitem.name}{`${subitem.comment ? ' ( ' + subitem.comment + ' )' : ''}`}</td>
                    <td className='text-center'>{subitem.quantity}</td>
                </tr>)}
            </>
            )
}

/*
const DeliveryInfo = ({ details }: { details: KitchenOrderPlatform }) => {

    const logo = getLogo(details.platform);
    const appName = config.appNames[details.platform] || details.platform;

    return (
        <div className="text-center">
            {
                logo &&
                <img 
                    src={logo} 
                    title={config.appNames[details.platform]}
                    alt="appLogo" style={{borderRadius: '50%'}} height="48" width="48"/>
            }
            {
                !logo &&
                <i className="mdi mdi-truck-fast h2 text-muted"></i>
            }
            <h5>
                <b>{appName}</b>
            </h5>
            <p className="mb-1">
                <b>Display ID :</b> {details.displayId}
            </p>
            <p className="mb-0">
                <b>{t('Delivery Method')}:</b> {details.deliveryMethod}
            </p>
        </div>
    );
};*/

const KitchenOrderDetails = ({ order }: KitchenOrderDetailsProps ) => {
        
    return (
        <>
            <Row>
                <Col>
                    <Row>
                        <Card>
                            <Card.Body>
                                <h4 className="header-title mb-3">{t('Products')}</h4>
                                <Items items={order.items} />
                            </Card.Body>
                        </Card>
                    </Row>
                    {   order.observations &&
                        <Row>
                            <div className='mx-2'>
                            <h4 className="header-title">{t('Order observation')}:</h4>
                            <p>{order.observations}</p>
                            </div>
                        </Row>
                    }
                    {
                        order.customer &&
                        <Row>
                            <div className='mx-2'>
                            <h4 className="header-title">{t('Client')}:</h4>
                            <p>{order.customer.completeName}</p>
                            </div>
                        </Row>
                    }
                    {/*<Row>
                        <Card>
                            <Card.Body>
                            <h4 className="header-title mb-3">{t('Delivery Information')}</h4>
                                <DeliveryInfo details={ { displayId: order.displayId, platform: order.platform, deliveryMethod: parseDeliveryMethod(order.deliveryMethod as DeliveryMethod) } } />
                            </Card.Body>
                        </Card>
                </Row>*/}
                </Col>
            </Row>
        </>
    )
}

export default KitchenOrderDetails