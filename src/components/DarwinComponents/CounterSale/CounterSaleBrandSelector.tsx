import config from "config/config";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Brand } from "redux/brands/types";
import SimpleBar from 'simplebar-react';

interface CounterSaleBrandSelectorProps {
    brands: Brand[];
    handleBrandSelect: (brand?: Brand) => void;
}
export const CounterSaleBrandSelector = ({ brands, handleBrandSelect }: CounterSaleBrandSelectorProps) => {

    const [activeBrand, setActiveBrand] = useState<Brand | undefined>(undefined);

    const handleSelect = (key: any, event: Object) => {
        setActiveBrand(brands.find(brand => brand.name === key));
        handleBrandSelect(brands.find(brand => brand.name === key))
    }

    //Side effect to set an active brand if there is only one
    useEffect(() => {
        if (brands.length === 1) {
            setActiveBrand(brands[0]);
            handleBrandSelect(brands[0]);
        }
    },[brands, handleBrandSelect]);
    
    return (
        <DropdownButton variant="light" 
            size='lg'
            title={activeBrand === undefined ? t('Select a brand') :  
            (<>
            {   activeBrand.logoSmall &&
                <img src={config.imageUrl + activeBrand.logoSmall} 
                        title={activeBrand.name}
                        alt="brandLogo"
                        style={{borderRadius: '50%', marginRight: '20px'}}
                        height="28" width="28" />
            }      
            {activeBrand.name}
            </>)} onSelect={handleSelect}>
        <SimpleBar autoHide={false} style={{maxHeight: '200px', 'width': '240px'}}>
        {brands.map( (brand, index) => {
           return (<Dropdown.Item
                    key={index}
                    href="#" eventKey={brand.name} active={brand.id===activeBrand?.id} >
                        {   brand.logoSmall &&
                            <img src={config.imageUrl + brand.logoSmall} 
                            title={brand.name}
                            alt="brandLogo"
                            style={{borderRadius: '50%', marginRight: '20px'}}
                            height="24" width="24" />
                        }
                        {brand.name}
                </Dropdown.Item>)
          })}
        </SimpleBar>
      </DropdownButton>
    )
}