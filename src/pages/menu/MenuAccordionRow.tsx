import classNames from "classnames";
import { CustomToggleProps } from "pages/products/types";
import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionContext, Button, Card, Col, Container, Row, useAccordionButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MenuAccordionRowProps, MenuApp } from "./types";
import config from 'config/config';


const CustomToggle = ({ children, eventKey, containerClass, linkClass, callback }: CustomToggleProps) => {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = activeEventKey === eventKey;

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

export const MenuAccordionRow = ({ item, eventKey, content, 
    isActive, canImport, canDuplicate, canDelete,
    handleClickOnAccordion, handleImport, handleDuplicate, handleDeleteMenu  }: MenuAccordionRowProps) => {

    const [apps, setApps] = useState<MenuApp[]>([]);

    //Re-render accordion header if activeApps changes
    useEffect(() => {
        setApps(item.apps.slice());
    }, [item.apps]);

    return (
        <Card className="w-100 m-2">
            <Card.Header 
            className="ps-0 pe-0 pt-1 pb-1">
                <CustomToggle
                    eventKey={eventKey}
                    containerClass="m-0"
                    linkClass="custom-accordion-title d-block"
                >
                    <Container fluid>
                        <Row>
                            { (canImport || canDuplicate) &&
                            <Col xs={2}>
                            <div className="d-flex justify-content-row align-items-center">
                            {
                                canImport &&
                                <Button className="mt-1" variant="light" onClick={() => handleImport(item)} size="sm">
                                    <i className="uil uil-download-alt"></i><small className="ms-1">Importar</small>
                                </Button>
                            }
                            {
                                canDuplicate &&
                                <Button className="mt-1" variant="light" onClick={() => handleDuplicate(item)} size="sm">
                                    <i className="uil uil-copy-landscape"></i><small className="ms-1">Duplicar</small>
                                </Button>
                            }
                            {
                                canDelete &&
                                <Button className="mt-1" variant="light" onClick={() => handleDeleteMenu(item)} size="sm" >
                                    <i className="mdi mdi-trash-can"></i><small className="ms-1">Eliminar</small>
                                </Button>
                            }
                            </div>
                            </Col>
                            }
                            <Col xs={5} onClick={() => handleClickOnAccordion(String(item.brand.id))}>                     
                                <div style={{float: 'right'}} className="d-flex justify-content-row me-4">
                                    <h5>
                                    {
                                        item.brandLogo && config.imageUrl !== "" ? 
                                        (<span>
                                            <img 
                                            src={config.imageUrl + item.brandLogo} 
                                            title={item.brand.name || ''}
                                            className="me-2"
                                            alt="brandLogo" style={{borderRadius: '50%' }} height="24" width="24"/>
                                        </span>)                         
                                        : null
                                    }
                                    {item.brand.name}
                                    </h5>
                                </div>
                            </Col>
                            <Col xs={4} onClick={() => handleClickOnAccordion(String(item.brand.id))}>
                            {
                                apps.length > 0 &&
                                (apps.filter(app => app.active).map((app) => {
                                    return (
                                        app.logo ?
                                        (<img src={app.logo}
                                        key={"menuApps-" + item.brand.id + "-" + app.app}
                                        title={app.name}
                                        className="mx-1 mt-1"
                                        alt="AppLogo" style={{borderRadius: '50%', float: 'right' }} 
                                        height="32" width="32"></img>) :
                                        <label key={"menuApps-" + item.brand.id + "-" + app.app} 
                                        style={{'float': 'right'}} className="mx-2">{app.name}</label>
                                    )
                                }))
                                }
                            </Col>
                            <Col className="mt-2" xs={1} onClick={() => handleClickOnAccordion(String(item.brand.id))}                                        >
                            {  !isActive &&
                                <div style={{'float': 'right'}}>
                                    <i style={{'fontSize': '24px'}} className="mdi mdi-chevron-down"></i>
                                </div>}
                            {  isActive &&
                                <div style={{'float': 'right'}}>
                                    <i style={{'fontSize': '24px'}} className="mdi mdi-chevron-up"></i>
                                </div>}
                            </Col>
                        </Row>
                    </Container>
                </CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey={eventKey}>
                <div>
                    {content}
                </div>
            </Accordion.Collapse>
        </Card>
    );
}
