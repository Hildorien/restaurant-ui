import React, { useEffect, useState } from 'react'
import Switch from "react-switch";
import { ProductAccordionRowProps } from './types';
import config from 'config/config';
import { useTranslation } from 'react-i18next';
import StatusCloseModal from '../../components/DarwinComponents/StatusCloseModal';
import StatusOpenModal from 'components/DarwinComponents/StatusOpenModal';
import { turnOnProduct, turnOffProduct } from 'helpers/api/products';
import { Badge } from 'react-bootstrap';
import classNames from 'classnames';
import { StoreClosedReason } from 'config/types';


const ProductAccordionRow = ({ product, handleProductRowStatusChange, finishLoading, brand }: ProductAccordionRowProps) => {
    const [switchState, setSwitchState] = useState(product.status);
    const [displayCloseModal, setDisplayCloseModal] = useState(false);
    const [displayOpenModal, setDisplayOpenModal] = useState(false);
    const [finishLoadingAccordionRow, setFinishLoadingAccordionRow ] = useState(finishLoading);

    const { t } = useTranslation();
    const closeReasonAllBrands = Object.values(StoreClosedReason);
    const isMultiBrand = (product.brandId?.length || 0) > 1;

    const handleChange = (state: boolean) => { 
        const prevState = switchState;
        if (prevState === false && state === true) { //Turning product ON
            setDisplayOpenModal(true);
        } else if ( prevState === true && state === false ) { //Turning product OFF
            setDisplayCloseModal(true);
        }
    }

    const handleConfirmCloseModal = async (reason: string, otherReasonDescription?: string) => {
        
        await turnOffProduct({ productId: product.id, branchId: product.branchId, reason: t(reason), otherReasonDescription: otherReasonDescription });
        
        //This will fetch products with state updated
        handleProductRowStatusChange(false, product.sku);

        setDisplayCloseModal(false);
    }

    const handleConfirmOpenModal = async () => {
        
        await turnOnProduct({ productId: product.id, branchId: product.branchId });

        //This will fetch products with state updated
        handleProductRowStatusChange(true, product.sku);
        
        setDisplayOpenModal(false);
    }

    const handleCancelOpenModal = () => {
        setDisplayOpenModal(false);
    }

    const handleCancelCloseModal = () => {
        setDisplayCloseModal(false);
    }

    /**
     * Cleanup effect 
     */
    useEffect(() => {
        return () => {
            setDisplayCloseModal(false);
            setDisplayOpenModal(false);
          };
    }, []);

    useEffect(() => {
        setSwitchState(product.status);
    }, [product.status])

    useEffect(() => {
        setFinishLoadingAccordionRow(finishLoading);
    }, [finishLoading]);

    return (
            <>            
                <>
                            <td style={{'textAlign': 'left', 'verticalAlign': 'middle', 'width': '33%'}}>
                                <h5>
                                    {product.productName}
                                </h5>
                            </td>

                            <td style={{'textAlign': 'center', 'verticalAlign': 'middle', 'width': '33%'}}>
                                {
                                    isMultiBrand &&
                                    (
                                        <Badge
                                            bg=""    
                                            className={classNames('me-1','badge-outline-secondary')} key={product.id}> 
                                            {t('Is in multiple brands')}
                                        </Badge>
                                    )
                                }               
                                {
                                    brand && brand.logoSmall && config.imageUrl !== "" ? 
                                    (<span>
                                        <img 
                                        src={config.imageUrl + brand.logoSmall} 
                                        title={brand.name}
                                        alt="brandLogo" style={{borderRadius: '50%' }} height="48" width="48"/>
                                    </span>)                         
                                    : null
                                }
                            </td>
                            
                            <td style={{'textAlign': 'right', 'verticalAlign': 'middle', 'width': '33%'}}>
                                <Switch 
                                    className="react-switch"
                                    checked={switchState}
                                    onChange={handleChange}
                                    disabled={!finishLoadingAccordionRow}
                                />
                            </td>
                </>
            <>
                <StatusCloseModal 
                    open={displayCloseModal}
                    title={t('The product') +  ' ' + product.productName + ' ' + t('will no longer be')  + ' ' +
                    t('available for sale in all of the menus') + '.'}
                    text={t('You can can turn the product back on in this section')}
                    closeReasons={closeReasonAllBrands}
                    handleConfirmCloseModal={handleConfirmCloseModal}
                    handleCancelCloseModal={handleCancelCloseModal}
                    closeErrorMessage={t('Could not turn off product')}
                    cssClass="info"
                />     
                <StatusOpenModal 
                    open={displayOpenModal}
                    title={t('The product') +  ' ' + product.productName + ' ' + t('will be back to')  + ' ' + 
                    t('available for sale in all of the menus') + '.' }
                    text={''}
                    handleConfirmOpenModal={handleConfirmOpenModal}
                    handleCancelOpenModal={handleCancelOpenModal}
                    openErrorMessage={t('Could not turn on product')}
                    cssClass="warning"
                />
                </>
            </>
  )
}

export default ProductAccordionRow;
