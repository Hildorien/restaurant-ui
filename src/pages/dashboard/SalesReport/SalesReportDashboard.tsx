import { Row, Col } from 'react-bootstrap';
import Statistics from './Statistics';
import PerformanceChart from './PerformanceChart';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState,  } from 'react';
import useSalesReport from './hooks/useSalesReport';
import { AccumulatedSalesData, SalesReportData, SeriesData } from 'redux/salesReport/types';
import ErrorCard from 'components/DarwinComponents/ErrorCard';
import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import useBrands from 'pages/products/hooks/useBrands';
import { DarwinBrandSelect } from 'components/DarwinComponents/DarwinBrandSelect';
import { BranchContext, BranchContextType } from 'context/BranchProvider';


const SalesReportDashboard = () => {
    const { t } = useTranslation();
    const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
    const { loading, salesReportInfo, onRequest: onRequestSalesData, error } = useSalesReport();

    const [statisticsCardInfo, setStatisticsCardInfo] = useState<AccumulatedSalesData | undefined>(undefined);
    const [performanceChartInfo, setPerformanceChartInfo] = useState<SeriesData[]>([]);

    //Brand Search
    const allBrands = t('All brands');
    const { brandInfo, onRequest: onRequestBrands } = useBrands();
    const [activeBrand, setActiveBrand] = useState(allBrands);
    const [brandsSearchText, setBrandSearchText] = useState("");
    const [brandsInSelect, setBrandsInSelect] = useState([allBrands]); 

    const findBrand = (name: string) => {
        return brandInfo.find( (br: any) => br.name === name);
    }

    const getAndSortBrandsFromDB = () => {
        return addAllBrandsToSelect(sortBrandsInSelect(brandInfo.map((brand: any) => brand.name)))
    }
    
    const sortBrandsInSelect = (brands: string[]) => {
        return brands.sort(function (b1: string, b2: string) {
            return b1 < b2 ?- 1 : 1;
        });
    } 
    
    const addAllBrandsToSelect = (brands: string[]) => {
        return [allBrands].concat(brands);
    }
    
    const handleSelectBrand = (key: any, event: Object) => {
        setActiveBrand(key);
        setBrandSearchText("");
        setBrandsInSelect(getAndSortBrandsFromDB());
        onRequestSalesData(currentBranchId, findBrand(key)?.id);
    }
    
    const refreshBrands = (text: string) => {
        setBrandSearchText(text);
        if (text !== "") {
            const brandsThatMatch = brandsInSelect.filter((br: any) => br.toLowerCase().includes(text.toLowerCase()));
            setBrandsInSelect(sortBrandsInSelect(brandsThatMatch))
        } else {
            setBrandsInSelect(getAndSortBrandsFromDB());
        }
    }

    useEffect(() => { 
        if (salesReportInfo) {
            const data = { ...salesReportInfo } as SalesReportData;
            setStatisticsCardInfo(data.accumulatedSalesData);
            let lastSixMonths: SeriesData[] = [];
            if (data.series.length > 6){
                lastSixMonths = data.series.slice(-6);
            } else {
                lastSixMonths = data.series.slice();
            }
            setPerformanceChartInfo(lastSixMonths);
        }
        
    }, [salesReportInfo]); //This only happens when branch is changed

    useEffect(() => {
        if (activeBranch !== currentBranchId) {
            onRequestBrands(currentBranchId);
            onRequestSalesData(currentBranchId);
            setActiveBranch(currentBranchId);
            setActiveBrand(allBrands);

        }
      }, [activeBranch, currentBranchId, onRequestSalesData, onRequestBrands, allBrands ]);

    /**Effect for brand info */
    useEffect(() => {
        if (brandInfo) {
            setBrandsInSelect([allBrands].concat(sortBrandsInSelect(brandInfo.map((brand: any) => brand.name))))        
        }
      }, [brandInfo, allBrands]);

    return (
        <>            
            <Row>
                <DarwinSectionTitle title={t("Sales report")} />
            </Row>
            <Row className='mb-3'> 
                <div style={{ 'display': 'flex', 'alignItems': 'stretch'}}>
                    <h5 className="me-3">{t('Brand')}:</h5>

                    <DarwinBrandSelect 
                        brandsSearchText={brandsSearchText}
                        activeBrand={activeBrand}
                        brandsInSelect={brandsInSelect}
                        handleSelectBrand={handleSelectBrand}
                        refreshBrands={refreshBrands}/>      
                </div>               
                            
            </Row>
            { !error &&
            (
            <>
            <Row>
                <Col xs={12}>
                    <Statistics data={statisticsCardInfo} loading={loading}/>
                </Col>
            </Row>
            

            <Row>
                <Col xs={12}>
                    <PerformanceChart data={performanceChartInfo} loading={loading} />
                </Col>    
            </Row>
            </>)
            }

        { error && 
            (<Row>
              <Col lg={4} sm={6}></Col> 
              <Col lg={4} sm={6}>
                <ErrorCard 
                  errorMessage={
                    error === 'USER_NOT_ALLOWED' ? 
                    t("You don't have permission to view this information"):
                    t('Sales report is not available right now, try refreshing the webpage')}
                  />
              </Col>
              <Col lg={4} sm={6}></Col> 
            </Row>)
        }
            
        </>
    
    );
}

export { SalesReportDashboard }

