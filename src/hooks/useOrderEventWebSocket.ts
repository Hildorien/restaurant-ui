import config from 'config/config';
import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import useUser from './useUser';
import { User } from 'config/types';
import { Topic, OrderStatusChange, NewOrder, PrintOrderCommand, OrderCancelled, OrderCancelledReason } from "darwinModels";
import LoggerService from 'services/LoggerService';
import { getOrdersCommands } from 'helpers';
import { newOrdersDefaultError, OrderEventPrinterNotificationError } from 'context/OrderEventProvider';
import uuid from 'react-uuid';

export default function useOrderEventWebSocket(topics: Topic[]) {
  
  //States for context
  const [firstRender, setFirstRender] = useState(true);
  const [loggedInUser] = useUser();
  
  //States for websocket
  const [ordersSocket, setOrdersSocket] = useState<Socket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [newOrderEvent, setNewOrderEvent] = useState<NewOrder | undefined>(undefined);
  const [orderStatusChangeEvent, setOrderStatusChangeEvent] = useState<OrderStatusChange | undefined>(undefined);
  const [orderCancelledEvent, setOrderCancelledEvent]  = useState<OrderCancelled | undefined>(undefined);

  //States for polling new orders
  const [newOrdersPrinterCommandFromPolling, setNewOrdersPrinterCommandFromPolling] = useState<PrintOrderCommand[]>([]);
  const [newOrdersPrintCommandFromPollingError, setNewOrdersPrintCommandFromPollingError] = useState<OrderEventPrinterNotificationError>(newOrdersDefaultError);

  const testNewOrder = useCallback(() => {
    setNewOrderEvent(prevOrder => {
      //This is a test order from 23/03/2023 stored in mongodb. Persistance only last one year.
      return {
        id: "PY-141153406", 
        externalId: "PY-141153406",
        createdAt: new Date(),
        platform: "PY",
        store: {
          id: "999999999",
          externalId: "999999999"
        },
        branch: {
          id: 1
        }
    }});
  }, []);

  const testWebSocket = useCallback((state: boolean) => {
    LoggerService.getInstance().log(`Turning WebSocket  ${state ? 'ON' : 'OFF'}`);
    setIsConnected(state);
  }, []);

  const testPollingNewOrders = useCallback(() => {
    setNewOrdersPrinterCommandFromPolling(prevPrinters =>{
      return [{
        //This is a test order from 23/03/2023 stored in mongodb. Persistance only last one year.
        id: "PY-141153406",
        displayId: "Pedidos Ya 141153406",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
      }]
    });
  },[]);

  const testOrderCancelledEvent = useCallback(() => {
    setOrderCancelledEvent({
        id: "PY-141153406", 
        externalId: "PY-141153406",
        createdAt: new Date(),
        platform: "PY",
        store: {
          id: "999999999",
          externalId: "999999999"
        },
        branch: {
          id: 1
        },
        reason: OrderCancelledReason.CANCELLED_BY_USER,
    });
  }, []);

  const pollNewOrders = useCallback(async () => {
    return await getOrdersCommands()
                .then((response: any) => {
                    const ordersPrinterCommands: PrintOrderCommand[] = response.data as PrintOrderCommand[];
                    setNewOrdersPrinterCommandFromPolling(ordersPrinterCommands);
                    setNewOrdersPrintCommandFromPollingError(newOrdersDefaultError);
                })
                .catch((error: any) => {
                    LoggerService.getInstance().error(error);
                    setNewOrdersPrintCommandFromPollingError({
                      id: uuid(),
                      message: error.message ? error.message : JSON.stringify(error)
                    });
                });
  }, []);

  //Initialize connection event
  useEffect(() => {
    if (firstRender) {
      const websocket = io(config.api.url + 'order', 
      {
        auth: { 
          token: (loggedInUser as User).token.value
        },
        secure: true,
        transports: ['websocket'],
      });
      setOrdersSocket(websocket);
      setFirstRender(false);
    }
  }, [firstRender, loggedInUser]);

  //Poll new orders every 15 secs if websocket connection fails
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(async () => {
          pollNewOrders()
          .catch((error: any) => {
            LoggerService.getInstance().error(error);
            setNewOrdersPrintCommandFromPollingError({
              id: uuid(),
              message: error.message ? error.message : JSON.stringify(error)
            });
          });
        }, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected, pollNewOrders]);

  //Connect to channels events
  useEffect(() => {
    if (ordersSocket) {

      ordersSocket.on("connect_error", (err) => {
        LoggerService.getInstance().error(err);
      });

      ordersSocket.on("connect", () => {
        LoggerService.getInstance().log('WebSocket connection started at ' + (new Date().toString()));
        setIsConnected(true);
      });
  
      ordersSocket.on("disconnect", (reason) => {
        LoggerService.getInstance().error('Websocket disconnected ' + reason + ' at ' + (new Date().toString()));
        setIsConnected(false);
      });

      for(const topic of topics) {
        ordersSocket.on(topic, (message) => {
          if (topic === Topic.NEW_ORDER) {
            setNewOrderEvent(message);
          }
          if (topic === Topic.ORDER_STATUS_CHANGE) {
            setOrderStatusChangeEvent(message);
          }
          if (topic === Topic.ORDER_CANCELLED) {
            setOrderCancelledEvent(message);
          }
        });
      }

      return () => {
        ordersSocket.off("connect_error");
        ordersSocket.off("connect");
        ordersSocket.off("disconnect");
        for(const topic of topics){
          ordersSocket.off(topic);
        }
      };

    }    
  }, [ordersSocket, topics]);

  //healthcheck
  useEffect(() => {
    if (ordersSocket) {
      const interval = setInterval(() => {
        ordersSocket.send('ping');
      }, 30000); // ping every 30 seconds
      return () => {
        clearInterval(interval);
      };
    }
  }, [ordersSocket]);

  return {
      isConnected,
      newOrderEvent,
      orderStatusChangeEvent,
      newOrdersPrinterCommandFromPolling,
      newOrdersPrintCommandFromPollingError,
      orderCancelledEvent,
      testNewOrder,
      testWebSocket,
      testPollingNewOrders,
      testOrderCancelledEvent
  }
}