import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { IntegrationInfo, ConnectivityCardInfo } from './types';
import { useTranslation } from 'react-i18next';
import ConnectivityCard from './ConnectivityCard';
import useBranch from '../../hooks/useBranch';
import config from 'config/config';
import { BranchInfo, Status } from 'redux/branch/types';
import ErrorCard from 'components/DarwinComponents/ErrorCard';
import LoggerService from 'services/LoggerService';
import useBrandOfflineQty from './hooks/useBrandOfflineQty';
import { Spinner } from 'components';
import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
//import { addFakeConnectivityInfo } from './fake-backend-data';

const AppsConnectivity = () => {
  
  const { t } = useTranslation();
  const appNames = config.appNames;  
  const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
  const { loading: loadingBranchInfo, branchInfo, error: errorBranch, onRequest : onRequestBranch } = useBranch();
  const {  onRequest: onRequestOfflineBrandQty } = useBrandOfflineQty();
  const [branchStores, setBranchStores] = useState<BranchInfo | undefined>(undefined);
  const [brands, setBrands] = useState<ConnectivityCardInfo[]>([]);
  const [allBrandsState, setAllBrandsState] = useState(false);
  const [maxRows, setMaxRows] = useState(0);
  const [openingOrClosing, setOpeningOrClosing] = useState(false);
  const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
  const [firstRender, setFirstRender ] = useState(true);


  if (errorBranch) {
    LoggerService.getInstance().error(errorBranch);
  }

  useEffect(() => {
    if (firstRender) {
      onRequestBranch(currentBranchId);
      setActiveBranch(currentBranchId);
      setFirstRender(false);
    }
  }, [firstRender, currentBranchId, onRequestBranch]); //This only happens on the first render

  useEffect(() => {
    if (activeBranch && activeBranch !== currentBranchId) {
      onRequestBranch(currentBranchId);
      setActiveBranch(currentBranchId);
    }
  }, [activeBranch, currentBranchId, onRequestBranch]);

  const interval = useMemo(() => {
    return setInterval(() => {
      onRequestBranch(currentBranchId);
    }, 900000);
  }, [onRequestBranch, currentBranchId]); //Memoize interval to store it for useEffect

  useEffect(() => {
    return () => clearInterval(interval);
  }, [interval]); //When interval changes, we clear it for next render

  /** Effect for branches info */
  useEffect(() => {
    if (branchInfo) {
      const branches = branchInfo;
      setBranchStores(branches);
    }
  }, [branchInfo]);

  useEffect(() => {
    if (branchStores?.branchId === currentBranchId) {
      
      let newBrands: ConnectivityCardInfo[] = [];
      for (const store of branchStores?.stores || []) {
        let newApps: IntegrationInfo[] = [];
        for (const integration of store.integrations) {
          newApps.push({     
            id: integration.id,
            app: integration.app,
            appStoreId: integration.appStoreId,
            name: appNames[integration.app] || integration.app,
            state: integration.status });
        }
        newBrands.push({
          id: store.id,
          title: store.name,
          state: store.status,
          integrations: newApps });
        
      }
      
      /*let fakeBrands = addFakeConnectivityInfo();
      for(const fakeBrand of fakeBrands) {
        newBrands.push(fakeBrand);
      }*/

      //The max amount of apps a branch has will determine the max rows a card can have
      let maxRows = 0;
      newBrands.forEach(branch => {
        if(branch.integrations.length > maxRows) {
          maxRows = branch.integrations.length;
        }
      });
      setMaxRows(maxRows);
      setBrands(newBrands); 
      setAllBrandsState(newBrands.slice().map(b => b.state).some(Boolean));
    }
  }, [currentBranchId, appNames, branchStores]);

  const handleConnectivityChange = (turnedOn: boolean, brandName: string) => {
    setOpeningOrClosing(false);
    onRequestBranch(currentBranchId);
    onRequestOfflineBrandQty();
  }

  const handleConnectivityLoading = (status: Status, brandName: string) => {
      setOpeningOrClosing(true);
      if (branchStores?.branchId === currentBranchId) {
        let newBrands: ConnectivityCardInfo[] = [];
        for (const store of branchStores?.stores || []) {
          let newApps: IntegrationInfo[] = [];
          for (const integration of store.integrations) {
            newApps.push({     
              id: integration.id,
              app: integration.app,
              appStoreId: integration.appStoreId,
              name: appNames[integration.app] || integration.app,
              state: (brandName === store.name || brandName === 'All brands') ? status : integration.status});
          }
          newBrands.push({
            id: store.id,
            title: store.name,
            state: store.status,
            integrations:  newApps });
        }
        //The max amount of apps a branch has will determine the max rows a card can have
        let maxRows = 0;
        newBrands.forEach(branch => {
          if(branch.integrations.length > maxRows) {
            maxRows = branch.integrations.length;
          }
        });
        setMaxRows(maxRows);
        setBrands(newBrands); 
        setAllBrandsState(newBrands.slice().map(b => b.state).some(Boolean));
      }
  }

  return (
    <>
      <Row>
            <DarwinSectionTitle 
            title={t("Connectivity")} 
            subtitle={t('In this section you can manage the connectivity of the delivery apps for the brands of which you operate with.')} />
      </Row>

      { loadingBranchInfo  &&
      <div className='text-center'>
        <Spinner className="m-2" color='secondary' />
      </div> 
      }

      {!errorBranch  && currentBranchId && brands.length > 0 && !loadingBranchInfo &&
      <Row>
        <Col lg={4} sm={6}></Col> 
        <Col lg={4} sm={6}>         
            {<ConnectivityCard 
                    title={t('All brands')}
                    integrations={[]}
                    maxRows={maxRows}
                    state={allBrandsState}     
                    finishLoading={!loadingBranchInfo} 
                    disableSwitch={openingOrClosing || 
                      brands.every(brand => brand.integrations.some(inte => inte.state === Status.OUT_OF_HOURS))}
                    connectivityInfo={{ branchId: currentBranchId }}
                    handleConnectivityChange={handleConnectivityChange}
                    handleConnectivityLoading={(state: Status, brandName: string) => handleConnectivityLoading(state, "All brands")}
                  />}
        </Col> 
        <Col lg={4} sm={6}></Col> 
      </Row>
      }

      {!errorBranch && currentBranchId && !loadingBranchInfo &&
      <Row>
        {brands.sort(function (b1: ConnectivityCardInfo, b2: ConnectivityCardInfo): number {
                        return b1.title < b2.title ? -1: 1;
                      }).map( (brand: ConnectivityCardInfo, index: number) => {
                            return (
                              <Col lg={4} sm={6} key={brand.title + '-' + index.toString()}>
                                  <ConnectivityCard 
                                    title={brand.title}
                                    integrations={brand.integrations}
                                    maxRows={maxRows}
                                    state={brand.state}
                                    finishLoading={!loadingBranchInfo}
                                    disableSwitch={openingOrClosing}
                                    connectivityInfo={{ brandId: brand.id, branchId: currentBranchId }}
                                    handleConnectivityChange={handleConnectivityChange}
                                    handleConnectivityLoading={(state: Status, brandName: string) => handleConnectivityLoading(state, brand.title)}
                                  />
                              </Col> 
                      )}     
      )}
      </Row>
      }

      {/* on error show card error message */}
      { errorBranch &&
        <Row>
          <Col lg={4} sm={6}></Col> 
          <Col lg={4} sm={6}>
            <ErrorCard 
            errorMessage={t('App connectivity is not available right now, try refreshing the webpage')}
            />
          </Col>
          <Col lg={4} sm={6}></Col> 
        </Row>
      }
      {
        branchInfo !== null && brands.length === 0 && !loadingBranchInfo &&
        (<>
          <br></br><br></br><br></br>
          <Row>
            <Col lg={3} sm={6}></Col> 
            <Col lg={6} sm={6}>
              <Card>
                <h4 className='text-center'>
                    {t("You don't have active brands")}
                </h4>
                <p className='text-center'>
                  {t('Contact our support staff from Whatsapp')}
                </p>
              </Card>
            </Col>
            <Col lg={3} sm={6}></Col> 
          </Row>
        </>)
      }

    </>
  );
}

export default AppsConnectivity
