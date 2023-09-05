import classNames from 'classnames';
import { CustomToggleProps } from 'pages/products/types';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Accordion, AccordionContext, Badge, Button, Card, Col, Container, Row, useAccordionButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MenuSectionAccordionRowProps } from './types';
import './sortableStyle.css';

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


export const MenuSectionAccordionRow = (
    {   item, 
        eventKey,
        content,
        isEmpty,
        itemsWithoutPrice,
        otherSectionNames,
        handleClickOnAccordion, 
        handleDeleteOnAccordion,
        handleEditOnAccordion,
        isActive }: MenuSectionAccordionRowProps) => {
    
    
    const inputRef = useRef<HTMLInputElement | null>(null);


    const [inputValue, setInputValue] = useState<string>(item.name);
    const [inputReadOnly, setInputReadOnly] = useState(item.name.length > 0);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        setInputValue(item.name);
    }, [item.name]);
    
    useEffect(() => {
        if (!inputReadOnly) {
            inputRef.current?.focus();
        }
    }, [inputReadOnly, inputRef]);

    const handleConfirmName = () => {

        if (inputValue.trim().length === 0) {
            setErrorMessage('Las secciones deben tener un nombre.');
            setInputValue(item.name);
            return;
        }

        if (otherSectionNames.map(name => name.toLowerCase()).includes(inputValue.toLowerCase())) {
            setErrorMessage('Ya existe una sección con ese nombre.');
            setInputValue(item.name);
            return;
        }
        setInputReadOnly(true);
        setErrorMessage('');
        handleEditOnAccordion(String(item.id), inputValue);
    }

    const handleEnterToConfirmName = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirmName();
        }
    }
    
    return (
        <Card className="w-100 mb-1">
            <Card.Header className='ps-1 pe-1'>
                <CustomToggle
                    eventKey={eventKey}
                    containerClass="m-0"
                    linkClass="custom-accordion-title d-block py-1"
                >
                    <Container className='ps-0 pe-0'>
                        <Row>
                            <Col className='handle pt-1 pe-0' xs={1}>
                                <i style={{'fontSize': '20px'}} className="mdi mdi-drag-vertical ps-1"></i>
                            </Col>
                            <Col xs={8}>
                            <input type="text" 
                                className='form-control float-start w-100'
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleEnterToConfirmName}
                                value={inputValue}
                                readOnly={inputReadOnly} 
                                onClick={() => {  
                                    if (inputReadOnly) {
                                        handleClickOnAccordion(String(item.id)) 
                                    }
                                }}
                                ref={inputRef}
                                placeholder={ 'Escriba el nombre de la sección...'}></input>
                            </Col>
                            <Col xs={3}>
                                <div  className='d-flex align-items-row justify-content-row float-end'>
                                    {
                                        !inputReadOnly &&
                                        <Button size='sm' variant="primary" className='mx-1' onClick={handleConfirmName}>Confirmar</Button>
                                    }
                                    <div onClick={() => handleClickOnAccordion(String(item.id))}>
                                    {
                                        errorMessage &&
                                        <small className='text-danger mx-1 mt-1'>{errorMessage}</small>
                                    }
                                    {
                                        isEmpty &&
                                        <div className='mx-2 mt-1'>
                                            <Badge className={classNames('bg-warning')}>{'VACIA'}</Badge>
                                        </div>
                                    }
                                    {
                                        itemsWithoutPrice > 0 &&
                                        <div className='mx-2 mt-1'>
                                            <Badge className={classNames('bg-danger')}>{'Productos sin precio: ' + itemsWithoutPrice}</Badge>                   
                                        </div>
                                    }
                                    </div>
                                    <Button className='mx-2' type="button" variant="outline-danger" onClick={() => handleDeleteOnAccordion(String(item.id))}>
                                        <i className="mdi mdi-trash-can"></i>
                                    </Button>
                                    <Button className='mx-2' type="button" variant="outline-primary" onClick={() => setInputReadOnly(false)}>
                                        <i className="mdi mdi-pencil"></i>
                                    </Button>
                                    {  !isActive &&
                                    <div className='mx-1 mt-1' onClick={() => handleClickOnAccordion(String(item.id))}>
                                        <i style={{'fontSize': '20px'}} className="mdi mdi-chevron-down"></i>
                                    </div>}
                                    {  isActive &&
                                    <div className='mx-1 mt-1' onClick={() => handleClickOnAccordion(String(item.id))}>
                                        <i style={{'fontSize': '20px'}} className="mdi mdi-chevron-up"></i>
                                    </div>
                                    }
                                </div>
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
