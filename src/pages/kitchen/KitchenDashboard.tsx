import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Row } from 'react-bootstrap';
import useOrders from 'hooks/useOrders';
import { KitchenTable } from './KitchenTable';
import { KitchenOrderRecord } from './types';
import config from 'config/config';
import { parseOrdersToTable, parseOrderToTableRecord, sortTable } from './utils';
import { Spinner } from 'components';
import LoggerService from 'services/LoggerService';
import { NewOrder } from "darwinModels";
import { getOrderById } from 'helpers';
import { OrderEventContext, OrderEventContextType } from 'context/OrderEventProvider';
import { arrayEquals } from 'utils';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
import { useRedux } from 'hooks';
import { changeSidebarType } from 'redux/actions';
import * as layoutConstants from 'appConstants';


const KitchenDashboard = () => {
    
    const appNames = config.appNames;
    //Import hooks
    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;
    const { newOrderNotification, newOrdersPrinterCommand, webSocketConnected } = useContext(OrderEventContext) as OrderEventContextType;

    //Initialize state variables from this section
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
    const [ordersToDisplay, setOrdersToDisplay] = useState<KitchenOrderRecord[]>([]);
    const { loading, error, orders, onRequestOrders} = useOrders();
    const [errorOrders, setErrorOrders] = useState("");
    const [lastNewOrderNotification, setLastNewOrderNotification] = useState(newOrderNotification);
    const [lastNewOrdersPrinterCommand, setLastNewOrdersPrinterCommand] = useState(newOrdersPrinterCommand);
    const [loadingNewOrder, setLoadingNewOrder] = useState(false);
    const [triggerRequestOrders, setTriggerRequestOrders] = useState(false);

    if (errorOrders) {
      LoggerService.getInstance().error(errorOrders);
    }

    //Handling collapse of left side bar menu
    const { dispatch } = useRedux();
    const closeMenu = useCallback(() => {
      dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED));
    }, [dispatch]);
    
    //Handlers  
    const newOrderArriveHandler = useCallback( async (newOrderEvent: NewOrder) => {
      setLastNewOrderNotification(newOrderEvent);
      setLoadingNewOrder(true);
      await getOrderById({ orderId: (newOrderEvent.id || '') })
      .then( (response) => {
          const order = response.data;
          setOrdersToDisplay(prevOrders => {
            const orderToDisplay = parseOrderToTableRecord(order, appNames);
            prevOrders.push(orderToDisplay);
            const newOrders = sortTable(prevOrders);
            return newOrders;
          })
        })
      .catch( (error) => {
        LoggerService.getInstance().error(error);
      })
      .finally(() => {
        setLoadingNewOrder(false);
      });
    }, [appNames]);

    const newOrdersArriveViaPollingHandler = useCallback(async () => {
      setLastNewOrdersPrinterCommand(newOrdersPrinterCommand);
      //Set a local state to trigger an effect for fetching new orders.
      //If onRequestOrders was called here instead it causes an error in redux: 
      //KitchenDashboard queues and update to KitchenTable (when calling onRequestOrders) while it's rendering itself
      //Moving the call to a useEffect makes it so the request happens after KitchenDashboard is rendered 
      setTriggerRequestOrders(true);
    }, [newOrdersPrinterCommand])

    if (newOrderNotification && newOrderNotification !== lastNewOrderNotification) {
      newOrderArriveHandler(newOrderNotification);
    }

    if (newOrdersPrinterCommand.length > 0 && 
      !arrayEquals(newOrdersPrinterCommand, lastNewOrdersPrinterCommand)) {
        newOrdersArriveViaPollingHandler();
    }

    const updateTableHandler = useCallback(() => {
      onRequestOrders(activeBranchInfo)
    }, [onRequestOrders, activeBranchInfo]);
    
    //Effects
    useEffect(() => {
      if (triggerRequestOrders) {
        onRequestOrders(activeBranchInfo);
        setTriggerRequestOrders(false); //Set state to false to prevent infinite callback loop
      }
    }, [triggerRequestOrders, onRequestOrders, activeBranchInfo]);


    useEffect(() => {
        if (orders) {
            let tableData = parseOrdersToTable(orders, appNames);
            setOrdersToDisplay(tableData);
        }
    }, [orders, appNames]);

    useEffect(() => {
        if (error) {
            setErrorOrders(error);
        }
    }, [error])
 
    //Fetch new data based on activeBranch
    useEffect(() => {
        if (activeBranch !== activeBranchInfo) {
            setActiveBranch(activeBranchInfo);
            onRequestOrders(activeBranchInfo);
            closeMenu();
        }
    }, [activeBranch, activeBranchInfo, onRequestOrders, closeMenu]);

    //Effect for polling server for displaying new orders
    useEffect(() => {
      let interval: any;
      if (!webSocketConnected) {
        interval = setInterval(() => {
          onRequestOrders(activeBranchInfo);
        }, 30000);
      }
      return () => clearInterval(interval);
    }, [webSocketConnected, onRequestOrders, activeBranchInfo]);

    return (
      <>
        <Row className='mt-2'>
            {
              !loading && !loadingNewOrder &&
                <KitchenTable data={ordersToDisplay} updateTableHandler={updateTableHandler} />
            }
            {
              (loading || loadingNewOrder) && 
              <div className='text-center'>
                <Spinner className="text-primary my-3" color="primary" size='lg' />
              </div> 
            }
        </Row>
      </>
    )
}

export default KitchenDashboard