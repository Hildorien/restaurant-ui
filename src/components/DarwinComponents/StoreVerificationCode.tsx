import React, { useCallback, useContext, useState } from 'react'
import { useToggle } from 'hooks';
import { Card, Offcanvas, Row, Col } from 'react-bootstrap';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
import LoggerService from 'services/LoggerService';
import { t } from 'i18next';
import { getStores } from 'helpers';
import { Integration, Store } from 'redux/branch/types';
import { Spinner } from 'components';
import { getLogo } from 'pages/kitchen/utils';
import { Brand } from 'redux/brands/types';
import config from 'config/config';
import { BrandContext, BrandContextType } from 'context/BrandProvider';
import { Link } from 'react-router-dom';
import classNames from 'classnames';


const StoreCardCheckIn = ({ store, brand }: { store: Store, brand: Brand }) => {

    const storeHasNoVerificationCodes = store.integrations.every(int => !int.verificationCode);

    return (
    <Card className='mx-4'>
        <Card.Header>
            <div>
            { brand?.logoSmall &&
            <img 
            src={config.imageUrl + brand.logoSmall} 
            title={brand.name}
            alt="brandLogo" style={{borderRadius: '50%' }} height="48" width="48"/>
            }
            <b className='mx-2'>{store.name}</b>
            </div>
        </Card.Header>
        <Card.Body>
            {
                store.integrations.map( (integration: Integration) => {
                    if (integration.verificationCode) {
                        const appLogo = getLogo(integration.app);
                        return(
                            <>
                            <Row className='my-2'>
                                <Col>
                                <img src={appLogo}
                                title={integration.app}
                                alt="AppLogo" style={{borderRadius: '50%' }} height="40" width="40"></img>
                                </Col>
                                <Col>
                                    {
                                        integration?.verificationCode.code ?        
                                        <h4>{integration.verificationCode.code}</h4> :
                                        <p className='text-danger'>{t('Check in code not available')}</p>
                                    }
                                    </Col>
                            </Row>
                            <hr></hr>
                            </>
                        )
                    } return undefined;
                })
            }
            {
                storeHasNoVerificationCodes &&
                <p>{t('The brand has no check-in codes integrated')}.</p>
            }
        </Card.Body>
    </Card>)
}

const StoreVerificationCodes = () => {
    
    const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
    const { brands } = useContext(BrandContext) as BrandContextType;
    const [isOpen, toggle] = useToggle();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = useCallback(async () => {
        setLoading(true);
        toggle();
        getStores({ branchId: currentBranchId })
        .then(async (response) => {
            let stores = response.data as Store[];
            setStores(stores);
        })
        .catch((error) => {
            LoggerService.getInstance().error(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [currentBranchId, toggle]);

    return (
        <>
        <Link to={'#'} onClick={() => handleClick()} className="dropdown-item notify-item" key={'rappicheckin-profile-menu'}>
            <i className={classNames('mdi mdi-storefront-outline', 'me-1')}></i>
            <span>{t('Rappi Check-in')}</span>
        </Link>
        <Offcanvas show={isOpen}
                onHide={toggle} 
                key={"StoreCheckIn"}
                backdrop={true}
                scroll={true}
                keyboard={true}
                className={'w-50'}
                placement='end'>
                <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <h2>{t('Store check in codes')}</h2>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {   loading && 
                            <div className='text-center'>
                                <Spinner className="spinner-border-lg" />
                            </div>
                        }
                        {   !loading &&
                            stores.map( (store: Store) => {
                                return <StoreCardCheckIn store={store} key={store.id} brand={brands.find( (brand: Brand) => brand.name === store.name) as Brand} />; 
                            })
                        }

                    </Offcanvas.Body>
        </Offcanvas>
        </>
      )
}

export default StoreVerificationCodes;