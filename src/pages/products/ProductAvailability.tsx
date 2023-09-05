import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Toast, ToastContainer, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import ProductsSearch from './ProductsSearch';
import { parseProductsToAccordions, searchProductsForAccordion } from './utils';
import ProductAccordion from './ProductAccordion';
import useProducts from './hooks/useProducts';
import { AccordionItem } from './types';
import ErrorCard from 'components/DarwinComponents/ErrorCard';
import LoggerService from 'services/LoggerService';
import useBrands from './hooks/useBrands';
//import useMenuBadges from 'hooks/useMenuBadges';
import useProductsOfflineQty from './hooks/useProductOfflineQty';
import { Spinner } from 'components';
import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import { BranchContext, BranchContextType } from 'context/BranchProvider';

type Notification = {
  state: boolean;
  class: string;
}

const ProductAvailability = () => {
    
    const { t } = useTranslation();
    const { loading: loadingProductInfo, productInfo, error: errorProducts, onRequest: onRequestProducts } = useProducts();
    const { brandInfo, onRequest: onRequestBrands } = useBrands();
    const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
    const [productsToDisplay, setProductsToDisplay] = useState<AccordionItem[]>([]);
    const [firstRender, setFirstRender ] = useState(true);
    const [searchBrands, setSearchBrands] = useState<string[]>([]);

    const [popNotification, setPopNotification] = useState<Notification | undefined>(undefined);

    const {  onRequest: onRequestOfflineProductQty } = useProductsOfflineQty();
    const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);

    //For saving the search after product state changes
    const [activeBrand, setActiveBrand] = useState("");
    const [activeStateProduct, setActiveStateProduct] = useState("");
    const [searchText, setSearchText] = useState("");
    const [forceSearch, setForceSearch] = useState(false);


    if (errorProducts) {
      LoggerService.getInstance().error(errorProducts);
    }

    const handleSearch = (textSearch: string, brandSearch: string, productStateSearch?: boolean) => {
      const newProductsToDisplay = searchProductsForAccordion(parseProductsToAccordions(productInfo.slice()), textSearch, brandSearch, brandInfo, productStateSearch);

      //Get categories of the products to show
      if (textSearch === "" && brandSearch === "" && productStateSearch === undefined) {
        setActiveAccordions([]);
      } else if (textSearch !== "" || brandSearch !== "" || productStateSearch !== undefined) {
        setActiveAccordions(newProductsToDisplay.filter(c => c.products.length > 0).map(p => p.id));
      }
      setProductsToDisplay(newProductsToDisplay);
      setActiveBrand(brandSearch);
      setActiveStateProduct(productStateSearch === undefined ? '' : (productStateSearch ? 'Prendido': 'Apagado'));
      setSearchText(textSearch);
      setForceSearch(false);
    }

    const handleStatusChange = async (turnOn: boolean, sku: string) => {
      await onRequestProducts(currentBranchId);
      await onRequestOfflineProductQty();
      setPopNotification({ state: turnOn, class: 'success'});
    } 

    const onCloseNotification = () => {
      setPopNotification(undefined);
    }
    
    
    useEffect(() => {
      if (firstRender) {
        onRequestBrands(currentBranchId);
        onRequestProducts(currentBranchId);
        setActiveBranch(currentBranchId);
        setFirstRender(false);
      }
    }, [firstRender, currentBranchId, onRequestProducts, onRequestBrands ]); //This only happens on the first render

    /**Effect for brand info */
    useEffect(() => {
      if (brandInfo) {
        setSearchBrands(brandInfo.map( (brand: any) => brand.name));
      }
    }, [brandInfo]);

    /** Effect for product info */
    useEffect(() => {
      if (productInfo) {
        const productsAccordion = parseProductsToAccordions(productInfo.slice());
        setProductsToDisplay(productsAccordion);
        setForceSearch(true);
        //Repopulate Brand selector with only brands that are in productInfo
        if (brandInfo) {
          const brandsInBranch = brandInfo.slice();
          let brandsInProducts: Set<string> = new Set<string>();
          for(const product of productInfo) {
            const brand = brandsInBranch.filter((br: any) => br.id === product.brandId);
            if (brand !== undefined && brand.length > 0) {
              brandsInProducts.add(brand[0].name)
            }
          }
          setSearchBrands(Array.from(brandsInProducts));
        }
      }

    }, [productInfo, brandInfo]);

    useEffect(() => {
      if (activeBranch && activeBranch !== currentBranchId) {
        onRequestProducts(currentBranchId);
        onRequestBrands(currentBranchId);
        setActiveBranch(currentBranchId);
      }
    }, [activeBranch, currentBranchId, onRequestProducts, onRequestBrands]);

    return (
        <>                 
          <Row>
              <DarwinSectionTitle 
                title={t("Products")} 
                subtitle={t('In this section you can manage the products of all brands')} />
          </Row>
          {
            loadingProductInfo &&
            <div className='text-center'>
            <Spinner className="m-2" color='secondary' />
            </div> 
          }

          { productsToDisplay.length > 0 && !loadingProductInfo &&
            <Row>
              <Col xs={12}>
                  <ProductsSearch 
                  brands={searchBrands.sort()}
                  handleSearch={handleSearch}
                  textSearch={searchText}
                  brandSearch={activeBrand}
                  productStateSearch={activeStateProduct}
                  forceSearch={forceSearch}
                  />
              </Col>
            </Row>
          }

          { !errorProducts && !loadingProductInfo &&
          (<Row>
            <Col xs={12}>
              <ProductAccordion  
              activeItems={activeAccordions} 
              products={productsToDisplay} 
              handleStatusChange={handleStatusChange}
              finishLoading={!loadingProductInfo}
              brands={brandInfo ? brandInfo : []}  />
            </Col>
          </Row>
          )
          }

        { (popNotification !== undefined) &&
            <ToastContainer className="p-3 bg-light" position={'top-end'}>
              <div style={{'zIndex': 99, 'position': 'fixed', 'top': 75, 'right': 0}}>
              <Toast bg={popNotification.class} 
              onClose={onCloseNotification} 
              show={popNotification !== undefined} 
              delay={3000} 
              onClick={onCloseNotification}
              animation={true}
              autohide>
                  <Toast.Body>
                    <div style={{'color': 'white'}}>
                      {
                      popNotification.state ? 
                      t('The product is now available in your menu') + '.': 
                      t('The product was turned off. You can turn it back on in this section') + '.'
                      }
                    </div>
                  </Toast.Body>
              </Toast>
              </div>
            </ToastContainer>
        }
        {/* on error show card error message */}
        { errorProducts && 
        (<Row>
          <Col lg={4} sm={6}></Col> 
          <Col lg={4} sm={6}>
            <ErrorCard 
              errorMessage={t('Products is not available right now, try refreshing the webpage')}
              />
          </Col>
          <Col lg={4} sm={6}></Col> 
        </Row>)
        }
        {
          productInfo !== null && productsToDisplay.length === 0 && !loadingProductInfo &&
          (<>
            <br></br><br></br><br></br>
            <Row>
              <Col lg={3} sm={6}></Col> 
              <Col lg={6} sm={6}>
                <Card>
                  <h4 className='text-center'>
                      {t("You don't have active products")}
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
  )
}

export default ProductAvailability
