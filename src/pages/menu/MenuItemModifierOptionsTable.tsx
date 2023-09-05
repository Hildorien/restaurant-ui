import React, { useState } from 'react'
import { ReactSortable, SortableEvent, Store } from 'react-sortablejs';
import { MenuModifierOption, MenuItemModifierOptionsTableProps, SortableMenuModifierOption } from './types';
import { Col, Container, Row } from 'react-bootstrap';
import { MenuItemModifierOptionTableRow } from './MenuItemModifierOptionRow';

export const MenuItemModifierOptionsTable = ({ options, onRequestEditedOptions }: MenuItemModifierOptionsTableProps) => {
    
    const [optionsToShow, setOptionsToShow] = useState<SortableMenuModifierOption[]>(options.map((o, index) => ({ id: index, element: o })).slice());

    const onReportChange = (option: MenuModifierOption) => {
        const oldOptions = optionsToShow;
        const newOptions = oldOptions.map( (o, index) => {
            if (o.element.optionId === option.optionId) {
                return { id: index, element: option };
            }
            return o;
        })
        setOptionsToShow(newOptions);
        onRequestEditedOptions(newOptions.map(o => o.element));
    }

    //This will trigger every time the user change the order of the options
    const onSortOptions = (evt: SortableEvent, sortable: any, store: Store) => {
        const newOptionsToShow = optionsToShow.map((opt, index) => ({ id: opt.id, element: { ...opt.element, position: index}})).slice();
        setOptionsToShow(newOptionsToShow);
        onRequestEditedOptions(newOptionsToShow.map(o => o.element));
    }

    return (  
        <Container fluid className="row ps-0 pe-0">
            <Row>
                <Col xs={6}><b>Nombre</b></Col>
                <Col xs={4}><b>Precio extra</b></Col>
                <Col xs={2} className='ps-0 pe-0'><b>Activo</b></Col>
            </Row>
            <hr></hr>
            <ReactSortable className="col" list={optionsToShow} setList={setOptionsToShow} onSort={onSortOptions}>
            {(optionsToShow || []).map((option, index) => {
                return (
                    <MenuItemModifierOptionTableRow 
                    key={String(option.id) + '-' + String(index)}
                    onReportChange={onReportChange}
                    option={option.element} />
                );
            })}
            </ReactSortable>
        </Container>
    )
}
