import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { ProductSearchProps } from './types';
import { DarwinBrandSelect } from 'components/DarwinComponents/DarwinBrandSelect';

const ProductsSearch = ({ handleSearch, brands, textSearch, brandSearch, productStateSearch, forceSearch }: ProductSearchProps) => {

    const { t } = useTranslation();
    const [activeBrand, setActiveBrand] = useState(brandSearch);
    const [activeStateProduct, setActiveStateProduct] = useState(productStateSearch);
    const [searchText, setSearchText] = useState(textSearch);
    const [triggerSearch, setTriggerSearch] = useState(forceSearch);
    const [brandsInSelect, setBrandsInSelect] = useState(brands); 
    const [brandsSearchText, setBrandSearchText] = useState("")

    const color = 'primary';

    const search = (text: string) =>  {
        setSearchText(text);
        handleSearch(text, activeBrand, activeStateProduct === '' ? undefined : (activeStateProduct === 'Prendido'));
    }

    const handleSelectBrand = (key: any, event: Object) => {
        setActiveBrand(key);
        setBrandsInSelect(brands);
        setBrandSearchText("");
        handleSearch(searchText, key, activeStateProduct === '' ? undefined : (activeStateProduct === 'Prendido'));
    }

    const handleSelectStateProduct = (key: any, event: Object) => {
        setActiveStateProduct(key);
        handleSearch(searchText, activeBrand, key === t('Product state') ? undefined : (key === 'Prendido'));
    }

    const handleClick = () => {
        setActiveBrand("");
        setActiveStateProduct("");
        setSearchText("");
        handleSearch("", "", undefined);
        setBrandSearchText("");
    }

    const refreshBrands = (text: string) => {
        setBrandSearchText(text);
        if (text !== "") {
            const brandsThatMatch =  brands.filter(br => br.toLowerCase().includes(text.toLowerCase()));
            setBrandsInSelect(brandsThatMatch)
        } else {
            setBrandsInSelect(brands);
        }
    }

    useEffect(() => {
        if (textSearch !== searchText){
            setSearchText(textSearch);
        }
    }, [textSearch, searchText]);

    useEffect(() => {
        if(brandSearch !== activeBrand) {
            setActiveBrand(brandSearch);
        }
    }, [brandSearch, activeBrand]);

    useEffect(() => {
        if(productStateSearch !== activeStateProduct) {
            setActiveStateProduct(productStateSearch);
        }
    }, [productStateSearch, activeStateProduct]);

    useEffect(() => {
        if(triggerSearch !== forceSearch) {
            setTriggerSearch(forceSearch);
        }
    }, [triggerSearch, forceSearch]);

    useEffect(() => {
        if (triggerSearch && 
            //And if there is something to search for
            (searchText !== "" || activeBrand !== "" || activeStateProduct !== '') ) {
            handleSearch(searchText, activeBrand,  activeStateProduct === '' ? undefined : (activeStateProduct === 'Prendido'));
        }
    }, [triggerSearch, searchText, activeBrand, activeStateProduct, handleSearch]);

    return (
        <Card className={classNames('border', [`border-${color}`])}>
            <Card.Body>
                <Row>
                    <Col lg={4} sm={6}>
                        <div className="app-search">
                            <div className="form-group position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Search for a product") + "..."}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value)}
                                    value={searchText}
                                />
                                <span className="mdi mdi-magnify search-icon"></span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} sm={6}>
                        <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center', 'alignItems': 'center'}}>
                            <label style={{'marginRight': '20px'}}>{t('Brands') + ":"}</label>
                            <DarwinBrandSelect 
                                brandsSearchText={brandsSearchText}
                                activeBrand={activeBrand}
                                brandsInSelect={brandsInSelect}
                                handleSelectBrand={handleSelectBrand}
                                refreshBrands={refreshBrands}/>
                        </div>
                    </Col>
                    <Col lg={4} sm={6}>
                        <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center', 'alignItems': 'center'}}>
                            <label style={{'marginRight': '20px'}}>{t('Product state') + ":"}</label>
                            <DropdownButton variant="light" title={activeStateProduct === "" ? t('Product state') : t(activeStateProduct)} onSelect={handleSelectStateProduct}>
                            {[t("On"), t("Off")].map( (state, index) => {
                               return (<Dropdown.Item key={index}
                                href="#" eventKey={state} active={state===activeStateProduct} >{t(state)}</Dropdown.Item>)
                              })}
                            </DropdownButton>
                        </div>
                    </Col>
                </Row>
                           
                <div style={{'float': 'right', 'paddingTop': '2em'}}>
                            <button className={classNames('btn', 'btn-sm', [`btn-${color}`])} onClick={handleClick}>{t('Delete filters')}</button>
                </div>
                
            </Card.Body>
        </Card>
    
  )
}

export default ProductsSearch;
