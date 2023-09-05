import { t } from 'i18next'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { DarwinBrandSelectProps } from './types'

export const DarwinBrandSelect = ({ brandsSearchText, activeBrand, brandsInSelect,  handleSelectBrand, refreshBrands, dropDownToggleProps}: DarwinBrandSelectProps) => {
    return (
    <Dropdown onSelect={handleSelectBrand}>
        <Dropdown.Toggle  size={dropDownToggleProps?.size || undefined} variant={dropDownToggleProps?.variant || "light"} style={{'width': '169px'}} >
            { (activeBrand === "" ? t('Brands') : t(activeBrand))}
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <div className="app-search">
                <div className="form-group position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={t('Search for brands')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => refreshBrands(e.target.value)}
                        value={brandsSearchText}
                    />
                    <span className="mdi mdi-magnify search-icon"></span>
                </div>
            </div>
            {brandsInSelect.map( (brand, index) => {
                    return (<Dropdown.Item key={index}
                 href="#" eventKey={brand} active={brand===activeBrand} >{t(brand)}</Dropdown.Item>)
            })}
        </Dropdown.Menu>
    </Dropdown>
  )
}
