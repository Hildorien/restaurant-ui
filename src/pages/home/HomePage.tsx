import React, { useState, useEffect, useContext } from 'react'
import { Row, Col } from 'react-bootstrap';
import CardSummary from './CardSummary';
import CarouselNews from './CarouselNews';
import useBrandOfflineQty from 'pages/connectivity/hooks/useBrandOfflineQty';
import useProductsOfflineQty from 'pages/products/hooks/useProductOfflineQty';
import useSalesReport from 'pages/dashboard/SalesReport/hooks/useSalesReport';
import { SalesReportAccumulatedOrdersQty } from 'redux/salesReport/types';
import { CardSummaryData } from './types';
import { useUser } from 'hooks';
import { Role, User } from 'config/types';
import { createCardData } from './utils';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
/*
Remainder modal logic is commented out because it is not used anymore.
import { useLocation } from 'react-router-dom';
import RemainderModal from 'components/DarwinComponents/ReminderModal';
type LocationState = {
    comesFromLogin: boolean;
};
*/
const HomePage = () => {

    const [offlineProducts, setOfflineProducts] = useState(0);
    const [offlineBrands, setOfflineBrands] = useState(0);
    const [ordersInMonth, setOrdersInMonth] = useState<SalesReportAccumulatedOrdersQty | undefined>(undefined);

    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;

    const { offlineProductQty, error: errorProductsOfflineQty, loading: loadingProductsOfflineQty, onRequest: onRequestProductsOfflineQty } = useProductsOfflineQty();
    const { offlineBrandQty, error: errorBrandOfflineQty, loading: loadingOfflineBrandQty, onRequest: onRequestBrandOfflineQty  } = useBrandOfflineQty();
    const { totalOrdersQtyInfo, error: errorSalesInMonth,  loading: loadingSalesInMonth, onRequestTotalOrdersQty  } = useSalesReport();

    const [loggedInUser] = useUser();
    const canViewSales: boolean = (loggedInUser as User).role !== Role.STAFF;
    
    const cards: CardSummaryData[] = createCardData(
        { ordersInMonth, loadingSalesInMonth }, 
        { offlineBrands, loadingOfflineBrandQty, errorBrandOfflineQty } ,
        { offlineProducts, loadingProductsOfflineQty, errorProductsOfflineQty }, 
        canViewSales);
    
    useEffect(() => {
        if (totalOrdersQtyInfo !== null && !errorSalesInMonth) {
            setOrdersInMonth(totalOrdersQtyInfo);
        }
    }, [totalOrdersQtyInfo, errorSalesInMonth]);

    useEffect(() => {
        if (offlineProductQty !== null && !errorProductsOfflineQty && 
            offlineProductQty !== offlineProducts) {
            setOfflineProducts(offlineProductQty);
        }
    }, [offlineProductQty, offlineProducts, errorProductsOfflineQty]);

    useEffect(() => {
        if (offlineBrandQty !== null && !errorBrandOfflineQty && 
            offlineBrandQty !== offlineBrands) {
            setOfflineBrands(offlineBrandQty);
        }
    }, [offlineBrandQty, offlineBrands, errorBrandOfflineQty]);

    useEffect(() => {
        if (canViewSales) {
            onRequestTotalOrdersQty(activeBranchInfo);
        }
        onRequestProductsOfflineQty();
        onRequestBrandOfflineQty();
    }, [activeBranchInfo, canViewSales, onRequestTotalOrdersQty, onRequestProductsOfflineQty, onRequestBrandOfflineQty]);

    return (
        <>
            <Row>
                <Col lg={3}>
                </Col>
                <Col lg={6}>
                    <CarouselNews/>
                </Col>
                <Col lg={3}>
                </Col>
            </Row>
            <br></br>
            <br></br>
            <br></br>
            <Row>
                {
                    cards.map(c => {
                        if(c.visible) {
                            return (
                                <Col lg={4} key={c.key}>
                                <CardSummary
                                    icon={c.data.icon}
                                    title={c.data.title}
                                    subtitle={c.data.subtitle}
                                    redirectText={c.data.redirectText}
                                    redirectLink={c.data.redirectLink}
                                    colorCard={c.data.colorCard}
                                    loading={c.data.loading}
                                />
                                </Col>);
                        }
                        return null;
                    })
                }
            </Row>
        </>
    )
}

export default HomePage;

