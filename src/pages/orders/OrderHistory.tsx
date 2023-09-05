import { BranchContext, BranchContextType } from 'context/BranchProvider';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { HyperDatepicker, Spinner } from 'components';
import { OrderDocument } from "darwinModels";
import useOrders from 'hooks/useOrders';
import { OrderHistoryTable } from './OrderHistoryTable';
import LoggerService from 'services/LoggerService';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { t } from 'i18next';
import { calculateOrderDiscount, splitDate } from './utils';
import config from 'config/config';
import { parseDeliveryMethod, parseOrderStatusToTableColumn } from 'pages/kitchen/utils';
import { OrderStatus } from "darwinModels";
import { useSearchParams } from 'react-router-dom';
import { getOrderHistory } from 'helpers';

type DateFilter = {
    from: Date,
    to: Date
}

const OrderHistory = () => {

  //Import hooks
  const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;
  const { loading, error, orderHistory, onRequestOrderHistory , orderHistoryTotalDocs, orderHistoryTotalPages } = useOrders();
  const { branches } = useContext(BranchContext) as BranchContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  
  //Initialize state variables from this section
  const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
  const [ordersToDisplay, setOrdersToDisplay] = useState<OrderDocument[]>([]);
  const [errorOrders, setErrorOrders] = useState("");
  const [totalPages, setTotalPages] = useState(orderHistoryTotalPages || 0);
  const [loadingExport, setLoadingExport] = useState(false);


  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const [dateFilter, setDateFilter] = useState<DateFilter>({from: sixMonthsAgo, to: new Date()});
  const formatDate = 'dd/MM/yyyy';
  
  //Query Parameters Filters
  const pageInRange = useCallback((currentPage: number) => {
    return currentPage >= 1 && currentPage <= orderHistoryTotalPages;
  }, [orderHistoryTotalPages]);

  const getPageIndex = useCallback(() => {
    const page = searchParams.get("page");
    const pageNumber = parseInt(page || "1");
    return pageInRange(pageNumber) ? pageNumber : 1;
  }, [searchParams, pageInRange]);

  const pageFromQuery = getPageIndex();
  const [currentPage, setCurrentPage] = useState(pageFromQuery);

  const getSearchQuery = useCallback(() => {
    return searchParams.get("s") || "";
  }, [searchParams]);

  const searchFromQuery = getSearchQuery();
  const [searchText, setSearchText] = useState(searchFromQuery);

  const queryFilters = useMemo(() => {
    return {
      "page": currentPage.toString(),
      "s": searchText,
      "from": splitDate(dateFilter.from, "-"),
      "to": splitDate(dateFilter.to, "-")
    }
  }, [currentPage, searchText, dateFilter]);
  
  // When user changes page index, it triggers a re-render of the component. 
  // Only render with new data when page index changes and is in valid range
  if (currentPage !== pageFromQuery && activeBranchInfo && pageInRange(pageFromQuery) ) {
    setCurrentPage(pageFromQuery);
    getOrderHistory({ 
      branchId: activeBranchInfo?.toString(), 
      page: pageFromQuery, 
      search: searchFromQuery,
      from: dateFilter.from,
      to: dateFilter.to
    }) 
    .then((response) => {
      let orderDocuments = response.data.docs as OrderDocument[];
      const totalPages = parseInt(response.data.totalPages);
      setTotalPages(totalPages);
      setOrdersToDisplay(orderDocuments
        .sort(function (r1: OrderDocument, r2: OrderDocument) {
          return new Date(r2.createdAt).getTime() - new Date(r1.createdAt).getTime()
      }));
    })
  }


  //Button Handlers
  const handleExport = async () => { 
    const appNames = config.appNames;
    const activeBranchName = branches?.find(b => b.id === activeBranchInfo)?.name || "";
    const options = { 
      filename: "pedidos--" + splitDate(dateFilter.from, "-") + "--" + splitDate(dateFilter.to, "-") + (activeBranchName !== "" ? ("_" + activeBranchName) : ""),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: t('Order history'),
      useTextFile: false,
      useBom: true,
      headers: ['DisplayId', t('Date'), t('Platform'), t('Delivery method'), t('Status'), t('Total products'), t('Discounts'), t('Total')]
    };

    const csvExporter = new ExportToCsv(options);

    // Fetch data from api
    let response = await getOrderHistory({ 
      branchId: activeBranchInfo?.toString(), 
      page: 1, 
      search: searchText, 
      from: dateFilter.from, 
      to: dateFilter.to  });
    let orderDocuments: OrderDocument[] = [];
    let firstPageOrders = response.data.docs as OrderDocument[];
    orderDocuments = firstPageOrders;
    while (response.data.hasNextPage && !isNaN(response.data.nextPage) ) {
        response = await getOrderHistory({ 
          branchId: activeBranchInfo?.toString(), 
          page: response.data.nextPage, 
          search: searchText, 
          from: dateFilter.from, 
          to: dateFilter.to  });
        orderDocuments = orderDocuments.concat(response.data.docs);
    }
    let csv = [];
    for(const order of orderDocuments) {
      csv.push({
        displayId: order.displayId,
        date: order.createdAt,
        platform: appNames[order.platform] || order.platform,
        deliveryMethod: parseDeliveryMethod(order.deliveryMethod),
        status: parseOrderStatusToTableColumn(order.status as OrderStatus),
        totalProducts: order.pricing.totalProducts,
        discounts: calculateOrderDiscount(order.pricing),
        total: order.pricing.totalOrder
      });

    }
    setLoadingExport(false);
    csvExporter.generateCsv(csv);
  }

  const handleFilters = () => {
    setCurrentPage(1);
    setSearchParams({
      "page": "1",
      "s": searchText,
      "from": splitDate(dateFilter.from, "-"),
      "to": splitDate(dateFilter.to, "-")
    });
    getOrderHistory({ 
      branchId: activeBranchInfo?.toString(), 
      page: 1, 
      search: searchText, 
      from: dateFilter.from, 
      to: dateFilter.to  })
    .then((response) => {
      let orderDocuments = response.data.docs as OrderDocument[];
      const totalPages = parseInt(response.data.totalPages);
      setTotalPages(totalPages);
      setOrdersToDisplay(orderDocuments
        .sort(function (r1: OrderDocument, r2: OrderDocument) {
          return new Date(r2.createdAt).getTime() - new Date(r1.createdAt).getTime()
      }));
    })
    .catch((error) => {
      setErrorOrders(JSON.stringify(error));
    });
  }

  // Effects for re-renders
  useEffect(() => {
    if (orderHistory) {
        setOrdersToDisplay(orderHistory
          .sort(function (r1: OrderDocument, r2: OrderDocument) {
            return new Date(r2.createdAt).getTime() - new Date(r1.createdAt).getTime()
        }));
    }
  }, [orderHistory]);

  useEffect(() => {
    setTotalPages(orderHistoryTotalPages);
  }, [orderHistoryTotalPages]);

  useEffect(() => {
      if (error) {
          setErrorOrders(error);
      }
  }, [error])

  //Fetch new data based on activeBranch
  useEffect(() => {
      if (activeBranch !== activeBranchInfo) {
          setActiveBranch(activeBranchInfo);
          const pageIndex = getPageIndex();
          setSearchParams(queryFilters);
          onRequestOrderHistory(activeBranchInfo, pageIndex, dateFilter.from, dateFilter.to, searchText);
      }
  }, [activeBranch, activeBranchInfo, dateFilter, searchText, queryFilters, onRequestOrderHistory, getPageIndex, pageInRange, setSearchParams]);

  //Log any error from fetching orders
  if (errorOrders) {
    LoggerService.getInstance().error(errorOrders);
  }

  return (
    <>
      {
          !loading &&
          <>
          <Row className='mt-4' lg={4}>
            <Col lg={5}>
            <label className='mx-2 my-1'><b>{t('Search')}:</b></label>
            <input
                type="text"
                className="form-control"
                placeholder={t('Search by') + " Display Id, " +  t("Platform")  + ", " + t("Delivery method")  + ", " + t("Status") + "..."}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilters();
                  }
                }}
              />
            </Col>
            <Col>
            <label className='mx-2 my-1'><b>{t('From')}:</b></label>
            <HyperDatepicker
                value={dateFilter.from}
                dateFormat={formatDate}
                inputClass="form-control-light"
                onChange={(date) => {
                    setDateFilter({...dateFilter, from: date});
                }}
            />
            </Col>
            <Col>
            <label className='mx-2 my-1'><b>{t('To')}:</b></label>
            <HyperDatepicker
                value={dateFilter.to}
                dateFormat={formatDate}
                inputClass="form-control-light"
                onChange={(date) => {
                  setDateFilter({...dateFilter, to: date});
                }}
            />
            </Col>
          </Row>
          <Button className='mt-3 mx-2' variant="primary" onClick={handleFilters}>
              {t('Apply')}
          </Button>
          <Button className='mt-3 mx-2' variant="light"  onClick={() => { setLoadingExport(true); handleExport(); }}>
              {t('Export')}
          </Button>
          { loadingExport && 
            <Spinner className="spinner-border-sm m-2 align-bottom" />
          }
          <div className='mt-3'>
              <OrderHistoryTable 
                data={ordersToDisplay} 
                totalDocs={orderHistoryTotalDocs}
                totalPages={totalPages}
                currentPage={pageInRange(pageFromQuery) ? pageFromQuery : 1}
                queryParameters={{
                  "s": searchText,
                  "from": splitDate(dateFilter.from, "-"),
                  "to": splitDate(dateFilter.to, "-")}}
              />
          </div>
          </>
      }
      {
          loading && 
          <div className='text-center'>
            <Spinner className="text-primary my-5" color="primary" size='lg' />
          </div> 
      }
    </>
  )
}

export default OrderHistory;