import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { MenuModifierOption, MenuItemModifierOptionTableRowProps } from './types'

export const MenuItemModifierOptionTableRow = ({ option, onReportChange }: MenuItemModifierOptionTableRowProps) => {
  
    //Local state variables
    const [extraPrice, setExtraPrice] = useState<number>(option.price);
    const [active, setActive] = useState<boolean>(option.active);

    //Handlers
    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(e.target.value) || 0;
      setExtraPrice(value);
      const newOption: MenuModifierOption = { 
        id: option.id, 
        optionId: option.optionId,
        name: option.name,
        position: option.position,
        product: option.product,
        price: value,
        active: option.active 
    }
      onReportChange(newOption);
    }

    const handleOnCheckChanged = (active: boolean) => {
        setActive(active);
        const newOption: MenuModifierOption = { 
            id: option.id, 
            optionId: option.optionId,
            name: option.name, 
            price: extraPrice,
            position: option.position,
            product: option.product,
            active: active }
        onReportChange(newOption);
    }
  
    return (
        <Row className='bg-light border-bottom'>
            <Col xs={6}>
                <div className='pe-2 pt-1' style={{'float': 'left'}}>
                    <i style={{'fontSize': '18px'}} className="mdi mdi-drag-vertical my-1"></i>
                </div>
                <div  className='my-1'>
                <b>{option.name}</b>
                </div>
            </Col>
            <Col xs={4}>
                <div className='align-items-center d-flex'>
                <label>$</label>
                <input  type="number" min="0"
                        style={{textAlign: 'right'}}
                        className="form-control mx-1"
                        value={Number(extraPrice).toString()} //This will remove leading zeros
                        onChange={(e) => { handleOnChangeInput(e) }}
                />
                </div>
            </Col>
            <Col xs={2}>
                <div className="form-check">
                    <input          
                    onChange={(e) => handleOnCheckChanged(e.target.checked)}
                    checked={active}
                    type="checkbox" className="form-check-input mt-2" id={`${option.optionId}-checkbox`} />
                </div>
            </Col>
        </Row>
    )
}
