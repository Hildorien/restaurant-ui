import classNames from 'classnames';
import { t } from 'i18next';
import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Card, useAccordionButton, AccordionContext, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductAccordionRow from './ProductAccordionRow';
import { AccordionItem, CustomToggleProps, ProductAccordionProps, ProductForAccordion } from './types';

const CustomToggle = ({ children, eventKey, containerClass, linkClass, callback }: CustomToggleProps) => {
    const { activeEventKey } = useContext(AccordionContext);  
    const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));
  
    const isCurrentEventKey =  activeEventKey?.includes(eventKey);
  
    return (
        <h5 className={containerClass}>
            <Link
                to="#"
                className={classNames(linkClass, {
                    collapsed: !isCurrentEventKey,
                })}
                onClick={decoratedOnClick}
            >
                {children}
            </Link>
        </h5>
    );
};

const ProductAccordion = ({ products, activeItems, handleStatusChange, finishLoading, brands }: ProductAccordionProps) => {

    const [activeAccordions, setActiveAccordions] = useState(activeItems);
    const [productsToDisplay, setProductsToDisplay] = useState(products);
    const [finishLoadingAccordion, setFinishLoadingAccordion ] = useState(finishLoading);


    const handleClickOnAccordion = (id: string, hasItemsToDisplay: boolean) => {
        if (!hasItemsToDisplay) {
            return;
        }
        let prevActiveAccordions = activeAccordions.slice();
        if (!prevActiveAccordions.includes(id)) {
            prevActiveAccordions.push(id);
        } else {
            // If we click on an open accordion, close it.
            prevActiveAccordions = prevActiveAccordions.filter(acc => acc !== id);
        }
        setActiveAccordions(prevActiveAccordions);
    }

    const handleProductRowStatusChange = (turnOn: boolean, sku: string) => {
        handleStatusChange(turnOn, sku);
    }

    const findBrand = (product: ProductForAccordion) => {
        if (product.brandId && product.brandId.length === 1) {
            const brandIdOfProduct = product.brandId[0];
            const brand = brands.find(br => br.id === brandIdOfProduct);
            return brand;
        }
        return undefined;
    }

    useEffect(() => {
        setProductsToDisplay(products);
    }, [products]);

    useEffect(() => {
        setActiveAccordions(activeItems);
    }, [activeItems]);

    useEffect(() => {
        setFinishLoadingAccordion(finishLoading);
    }, [finishLoading]);

    return (<Accordion activeKey={activeAccordions} id="accordion" className="custom-accordion" alwaysOpen={true} >
                  {productsToDisplay.map((item: AccordionItem, index: number) => {
                        const offlineProducts: number = item.products.filter(p => !p.status).length;
                        const hasItemsToDisplay: boolean = item.products.length > 0
                        return (                                                  
                          <Card key={index.toString()} className="mb-0">
                            <Card.Header onClick={() => handleClickOnAccordion(item.id, hasItemsToDisplay)}>
                                <CustomToggle
                                    eventKey={item.id}
                                    containerClass="m-0"
                                    linkClass="custom-accordion-title d-block py-1"
                                >
                                    {!hasItemsToDisplay ?
                                    (<div className={classNames('text-muted')}>
                                    {item.title}
                                    </div>) : 
                                    item.title
                                    }
                                    {
                                    (!activeAccordions.includes(item.id) && hasItemsToDisplay) ?
                                    (<div style={{'float': 'right', 'verticalAlign': 'center'}}>
                                    <i style={{'fontSize': '18px'}} className="mdi mdi-chevron-down"></i>
                                    </div>) : null
                                    }
                                    { offlineProducts > 0 ?
                                        (
                                        <div style={{'float': 'right', 'paddingRight': '1.5em'}}>
                                        <Badge
                                            className={classNames('me-1','bg-danger')}
                                                key={item.id}> 
                                            {t('Offline products') + ': ' + offlineProducts}
                                        </Badge>
                                        </div>) : null
                                    }

                                    <i className="mdi mdi-chevron-up accordion-arrow"></i>
                                </CustomToggle>
                            </Card.Header>
                            {hasItemsToDisplay ? 
                            (<Accordion.Collapse eventKey={item.id}>
                                
                                <div>
                                    <Card.Body>
                                        <Table className="mb-0" size='sm' striped style={{'tableLayout': 'fixed'}}>
                                            <thead></thead>
                                            <tbody>
                                            {item.products.sort( function (p1, p2): number {
                                                return p1.productName < p2.productName ? -1: 1;
                                            }).map( (product: ProductForAccordion, index: number) => {
                                                return (                                                
                                                <tr key={index.toString()}>
                                                    <ProductAccordionRow 
                                                    key={index} 
                                                    product={product} 
                                                    handleProductRowStatusChange={handleProductRowStatusChange}
                                                    finishLoading={finishLoadingAccordion}
                                                    brand={findBrand(product)}/>
                                                </tr>
)   
                                            })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </div>
                            </Accordion.Collapse>) : null }
                          </Card>               
                          );
                  })}
        </Accordion>     
  );
}


export default ProductAccordion;