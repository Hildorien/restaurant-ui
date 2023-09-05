import React, { useContext } from 'react';
import { Card, Accordion, useAccordionButton, AccordionContext } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { CustomToggleProps } from 'pages/products/types';
import { DarwinAccordionProps } from './types';

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

export const DarwinAccordionRow = ({ item, index, content, handleClickOnAccordion, isActive }: DarwinAccordionProps) => {
    return (
        <Card className="mb-0 w-100">
            <Card.Header onClick={() => handleClickOnAccordion(String(item.id))}>
                <CustomToggle
                    eventKey={String(index)}
                    containerClass="m-0"
                    linkClass="custom-accordion-title d-block py-1"
                >
                    {item.title}
                    {  !isActive &&
                    <div style={{'float': 'right', 'verticalAlign': 'center'}}>
                        <i style={{'fontSize': '18px'}} className="mdi mdi-chevron-down"></i>
                    </div>}
                    {  isActive &&
                    <div style={{'float': 'right', 'verticalAlign': 'center'}}>
                        <i style={{'fontSize': '18px'}} className="mdi mdi-chevron-up"></i>
                    </div>}
                </CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey={String(index)}>
                <div>
                    {content}
                </div>
            </Accordion.Collapse>
        </Card>
    );
}
