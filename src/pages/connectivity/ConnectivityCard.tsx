import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { ConnectivityCardInfoProps } from './types';
import Switch from "react-switch";
import ConnectivityCardTable from './ConnectivityCardTable';
import StatusCloseModal from '../../components/DarwinComponents/StatusCloseModal';
import { useTranslation } from 'react-i18next';
import { turnOffAllBrand, turnOffBrand, turnOnBrand, turnOnAllBrands } from 'helpers';
import { Status } from "redux/branch/types";
import StatusOpenModal from 'components/DarwinComponents/StatusOpenModal';
import { StoreClosedReason } from 'config/types';
import DarwinTooltip from 'components/DarwinComponents/DarwinTooltip';


const ConnectivityCard = ( { title, integrations: apps, maxRows, state, finishLoading, disableSwitch,
    connectivityInfo, handleConnectivityChange, handleConnectivityLoading }: ConnectivityCardInfoProps) => {
    const { t } = useTranslation();
    const closeReasonAllBrands = Object.values(StoreClosedReason);
    const isForIndividualBrand: boolean = apps.length > 0;

    const [switchState, setSwitchState] = useState(state);
    
    const [displayCloseModal, setDisplayCloseModal] = useState(false);
    const [displayOpenModal, setDisplayOpenModal] = useState(false);

    const [appsInfo, setAppsInfo] = useState(apps);
    const [finishLoadingCard, setFinishLoadingCard ] = useState(finishLoading);
    const [switchBusinessLogicState, setSwitchBusinessLogicState] = useState(false);

    const [disableSwitchState, setDisableSwitchState] = useState(disableSwitch);

    /**Clean up effect after rendering  */
    useEffect(() => {
        return () => {
            setDisplayCloseModal(false);
            setDisplayOpenModal(false);
        }
    }, []);


    useEffect(() => {
        setSwitchState(state);
    }, [state]);

    useEffect(() => {
        setFinishLoadingCard(finishLoading);
    }, [finishLoading]);

    useEffect(() => {
        setDisableSwitchState(disableSwitch);
    }, [disableSwitch]);

    useEffect(() => {
        if (isForIndividualBrand) {
            setSwitchBusinessLogicState(apps.some(app => app.state === Status.OUT_OF_HOURS));
        }
        setAppsInfo(apps);
    }, [apps, isForIndividualBrand]);

    const handleChange = (state: boolean) => { 
        const prevState = switchState;
        if (prevState === false && state === true) { //Turning card ON
            setDisplayOpenModal(true);
        } else if ( prevState === true && state === false ) { //Turning card OFF
            setDisplayCloseModal(true);
        }
    }

    const handleConfirmCloseModal = async (reason: string, otherReasonDescription?: string) => {
        handleConnectivityLoading(Status.CLOSING, title);
        try {
            if (isForIndividualBrand) {
                if (connectivityInfo.brandId) {
                    await turnOffBrand({ brandId: connectivityInfo.brandId, 
                        reason: t(reason), branchId: connectivityInfo.branchId, 
                        otherReasonDescription: otherReasonDescription });
                }
            } else {
                await turnOffAllBrand({ reason: t(reason), 
                    branchId: connectivityInfo.branchId,
                    otherReasonDescription: otherReasonDescription });
            }
        } catch(error) {
            //Still throw error to show on modal but state of apps should be the same before turning off
            handleConnectivityChange(false, title);
            throw error;
        }
        let newAppsInfo = appsInfo.slice().map(appInfo => {
            return  { ...appInfo , state: Status.CLOSING }
        });
        setAppsInfo(newAppsInfo);
        handleConnectivityChange(false, title);
        setDisplayCloseModal(false);
    }

    const handleConfirmOpenModal = async () => {
        handleConnectivityLoading(Status.OPENING, title);

        try {
            if (isForIndividualBrand) {
                if (connectivityInfo.brandId) {
                    await turnOnBrand({ brandId: connectivityInfo.brandId, branchId: connectivityInfo.branchId});
                }
            } else {
                await turnOnAllBrands({ branchId: connectivityInfo.branchId });
            }
        } catch(error) {
            //Still throw error to show on modal but state of apps should be the same before turning off
            handleConnectivityChange(true, title);
            throw error;
        }
        let newAppsInfo = appsInfo.slice().map(appInfo => {
            return  { ...appInfo , state: Status.OPENING }
        });
        setAppsInfo(newAppsInfo);
        handleConnectivityChange(true, title);
        setDisplayOpenModal(false);
    }

    const handleCancelOpenModal = () => {
        setDisplayOpenModal(false);
    }

    const handleCancelCloseModal = () => {
        setDisplayCloseModal(false);
    }

    return (
        <Card>
            <Card.Body>  
                    {
                         switchBusinessLogicState &&
                        <div style={{'float': 'right'}}>                                     
                            <DarwinTooltip 
                            id={title}
                            text={t("The brand cannot be modified when it's out business of hours")}/>
                        </div>
                    }
                
                <Card.Title as="h4">
                <p className="text-center">
                    {title}
                </p>
                </Card.Title>   
                 
                <Card.Subtitle>
                <div className='text-center'>
                    <Switch 
                            className="react-switch"
                            checked={switchState}
                            onChange={handleChange}
                            disabled={disableSwitchState || !finishLoadingCard || switchBusinessLogicState}
                    />
                </div>
                </Card.Subtitle>

                { isForIndividualBrand  && <ConnectivityCardTable integrations={appsInfo} maxRows={maxRows} finishLoading={finishLoadingCard} /> }
            </Card.Body>

            <StatusCloseModal 
                open={displayCloseModal}
                title={
                    isForIndividualBrand ? 
                    (t('The brand') +  ' ' + title + ' ' + t('will no longer be')  + ' ' +
                    t('visible in all the the application you operate with') + '. ') : 
                    
                    (t('All brands will no longer be') + ' ' + t('visibles') + ' ' +
                    t('in all the the application you operate with') + '. ')}
                text={
                    isForIndividualBrand ? 
                    (t('You can can turn it back on in this section') + '.') : 
                    
                    (t('You can can turn them back on in this section') + '.')
                }
                closeReasons={closeReasonAllBrands}
                handleConfirmCloseModal={handleConfirmCloseModal}
                handleCancelCloseModal={handleCancelCloseModal}
                closeErrorMessage={t('Could not close stores')}
                cssClass="info"
            />     
            <StatusOpenModal 
                open={displayOpenModal}
                title={isForIndividualBrand ? 
                    (t('The brand') +  ' ' + title + ' ' + t('will be back to')  + ' ' +
                    t('visible in all the the application you operate with') + '. ') 
                    :                
                    (t('All brands will be back to') + ' ' +
                    t('visible in all the the application you operate with') + '. ')}
                text={
                    isForIndividualBrand ? 
                    (t('You can can turn it back off in this section') + '.') :                   
                    (t('You can can turn them back off in this section') + '.')
                }
                handleConfirmOpenModal={handleConfirmOpenModal}
                handleCancelOpenModal={handleCancelOpenModal}
                openErrorMessage={t('Could not open stores')}
                cssClass="warning"
            />
            
        </Card>
  )
}


export default ConnectivityCard;