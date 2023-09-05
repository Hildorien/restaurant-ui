import React, { createContext, useContext, useState, useCallback } from 'react'
import { NewOrder, OrderCancelled, PrintOrderCommand, Topic } from 'darwinModels';
import useOrderEventWebSocket from 'hooks/useOrderEventWebSocket';
import { GlobalVariablesContext, GlobalVariablesContextType } from './GlobalVariablesProvider';
import { acceptOrder, focusWindow, getPrintOrderCommand, printKitchenCommand, printCancelReceipt, takeOrder, sendOrderPrintError, getOrderById, printInvoice } from 'helpers';
import { ElectronApiError, OrderApiError, PrinterApiError, PrintOrderCommandApiError } from 'helpers/api/apiError';
import LoggerService from 'services/LoggerService';
import { playSound } from 'helpers/sounds';
import { arrayEquals } from 'utils';
import uuid from 'react-uuid';
import { OrderDocument } from 'darwinModels';


//This context will provide new order events to the application
export type OrderEventPrinterNotificationError = {
    message: string;
    id: string;
}

export const newOrdersDefaultError: OrderEventPrinterNotificationError = {
    id: "",
    message: ""
}

export type OrderEventContextType = {
    //Arrival via websocket
    newOrderNotification: NewOrder | undefined; 

    //Arrival via polling to order api
    newOrdersPrinterCommand: PrintOrderCommand[]; 

    //Provides more info to the user when a new order fails in the process of fetching->printing->accept or take 
    newOrdersPrinterNotificationErrorMessage: OrderEventPrinterNotificationError;

    //Arrival via websocket
    orderCancelledNotification: OrderCancelled | undefined; 

    //Informs the state of the web socket connection
    webSocketConnected: boolean;
    
    //Simulates a new order notification arrival via websocket
    testNewOrder: () => void; 
    
    //Simulates turning on or off the websocket channel
    testWebSocket: (state: boolean) => void; 
    
    //Simulates a cycle of polling that fetches print order commands
    testPollingNewOrders: () => void;

    //Simulates a cancelled order notification arrival via websocket
    testOrderCancelledEvent: () => void;
    
};

export const OrderEventContext = createContext<OrderEventContextType | null>(null);

const OrderEventProvider: React.FC<React.ReactNode> = ({ children }) => {

    //Internal states of context
    const [newOrderNotification, setNewOrderNotification] = useState<NewOrder | undefined>(undefined);
    const [newOrdersPrinterCommand, setNewOrdersPrinterCommand] = useState<PrintOrderCommand[]>([]);
    const [newOrdersPrintCommandError, setNewOrdersPrintCommandError] = useState<OrderEventPrinterNotificationError>(newOrdersDefaultError);
    const [newOrdersPrinterNotificationErrorMessage, setNewOrdersPrinterNotificationErrorMessage] = useState<OrderEventPrinterNotificationError>({
        message: "",
        id: "",
    });
    const [orderCancelledNotification, setOrderCancelledNotification] = useState<OrderCancelled | undefined>(undefined);

    //Import context and hooks
    const { newOrderEvent, 
        newOrdersPrinterCommandFromPolling, 
        newOrdersPrintCommandFromPollingError,
        orderCancelledEvent,
        isConnected,
        testNewOrder,
        testWebSocket, 
        testPollingNewOrders,
        testOrderCancelledEvent } = useOrderEventWebSocket([Topic.NEW_ORDER, Topic.ORDER_CANCELLED]);
    // We need to show printer error related messages only to desktop users
    const { isDarwinElectron } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
    const { autoPrint, soundNotification, soundRepeats } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
    
    // --------------------------------------------------------------------------------------------------
    // Handlers when order events arrive via websocket
    // New order event handler 
    const newOrderNotificationArriveHandler = useCallback(async (newOrderEvent: NewOrder) => {
        // Set focus to application to notify the user
        await focusWindow().catch((error) => {
            const electronApiError = new ElectronApiError(error);
            LoggerService.getInstance().error(electronApiError);
        });
        if (autoPrint) {
            // Fetch the printer command of the new order 
            await getPrintOrderCommand({ orderId: newOrderEvent.id || ''})
            .then( async (response: any) => {
                const printCommand: PrintOrderCommand = response.data as PrintOrderCommand;
                // Print the kitchenCommand
                await printKitchenCommand(printCommand)
                .then(async (response: any) => {
                    if (printCommand.autoAccepted) {
                        await takeOrder({ orderId: printCommand.id })
                        .catch((error) => {
                            const orderApiError = new OrderApiError(error);
                            LoggerService.getInstance().error(orderApiError);
                            setNewOrdersPrinterNotificationErrorMessage({
                                id: uuid(),
                                message: orderApiError.toFriendlyNotificationMessage(newOrderEvent.id || '', true)})
                            })
                    } else {
                        await acceptOrder({ orderId: printCommand.id })
                        .catch((error) => {
                            const orderApiError = new OrderApiError(error);
                            LoggerService.getInstance().error(orderApiError);
                            setNewOrdersPrinterNotificationErrorMessage({
                                id: uuid(),
                                message: orderApiError.toFriendlyNotificationMessage(newOrderEvent.id || '', false)
                            })
                         })
                    }
                    //Print invoice if exists
                    await getOrderById({ orderId: printCommand.id})
                    .then(async (response) => {
                        const order = response.data as OrderDocument;
                        if (order.invoice) {
                            await printInvoice(order.invoice)
                            .catch(async (error) => {
                                const printerError = new PrinterApiError(error);
                                //Log error in console
                                LoggerService.getInstance().error(printerError);
                                //Log error to backend
                                await sendOrderPrintError({ orderId: newOrderEvent.id || "", error: printerError })
                                .catch((error) => {
                                    LoggerService.getInstance().error(error);
                                });
                                //Send notification to frontend
                                if (isDarwinElectron) {
                                    setNewOrdersPrinterNotificationErrorMessage({
                                        id: uuid(),
                                        message: printerError.toFriendlyNotificationMessage(newOrderEvent.id || '')
                                    })
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        const orderApiError = new OrderApiError(error);
                        LoggerService.getInstance().error(orderApiError);
                        setNewOrdersPrinterNotificationErrorMessage({
                            id: uuid(),
                            message: orderApiError.toFriendlyNotificationMessage(newOrderEvent.id || '', true)})
                    });
                })
                .catch(async (error) => {
                    const printerError = new PrinterApiError(error);
                    //Log error in console
                    LoggerService.getInstance().error(printerError);
                    //Log error to backend
                    await sendOrderPrintError({ orderId: newOrderEvent.id || "", error: printerError })
                    .catch((error) => {
                        LoggerService.getInstance().error(error);
                    })
                    //Send notification to frontend
                    if (isDarwinElectron) {
                        setNewOrdersPrinterNotificationErrorMessage({
                            id: uuid(),
                            message: printerError.toFriendlyNotificationMessage(newOrderEvent.id || '')
                        })
                    }
                })
            })
            .catch((error) => {
                const printCommandError = new PrintOrderCommandApiError(error);
                LoggerService.getInstance().error(printCommandError);
                if (isDarwinElectron) {
                    setNewOrdersPrinterNotificationErrorMessage({
                        id: uuid(),
                        message: printCommandError.toFriendlyNotificationMessage(newOrderEvent.id || '')})
                }
                return;
            })
            .finally(() => {
                setNewOrderNotification(newOrderEvent);
            })
        }
        const isLocalOrder = (newOrderEvent.id || '').split('-')[0] === "DW";
        if (soundNotification && !isLocalOrder) {
            for (let i = 0; i < soundRepeats; i++) {
                await playSound();
                //Delay next play sound
                await new Promise(f => setTimeout(f, 3000));
            }
        }
    }, [soundNotification, autoPrint, soundRepeats, isDarwinElectron]);
    
    // Order cancelled event handler 
    const orderCancelEventHandler = useCallback(async (orderCancelled: OrderCancelled) => {
        setOrderCancelledNotification(orderCancelled);
        // Set focus to application to notify the user
        await focusWindow().catch((error) => {
            const electronApiError = new ElectronApiError(error);
            LoggerService.getInstance().error(electronApiError);
        });
        // Fetch the printer command of the order cancelled
        await getPrintOrderCommand({ orderId: orderCancelled.id || ''})
        .then( async (response: any) => {
            const printCommand: PrintOrderCommand = response.data as PrintOrderCommand;
            // Print the receipt
            await printCancelReceipt(printCommand)
            .catch((error) => {
                const printerError = new PrinterApiError(error);
                LoggerService.getInstance().error(printerError);
                setNewOrdersPrinterNotificationErrorMessage({
                    id: uuid(),
                    message: printerError.toFriendlyNotificationMessage(orderCancelled.id || '')
                })
            })
        })
        .catch((error) => {
            const printCommandError = new PrintOrderCommandApiError(error);
            LoggerService.getInstance().error(printCommandError);
            if (isDarwinElectron) {
                setNewOrdersPrinterNotificationErrorMessage({
                    id: uuid(),
                    message: printCommandError.toFriendlyNotificationMessage(orderCancelled.id || '')})
            }
            return;
        })
    }, [isDarwinElectron]);
    // --------------------------------------------------------------------------------------------------

    // Handlers when order events arrive via polling

    // New orders arrive via polling handler
    const newOrdersFromPollingArriveHandler = useCallback(async (printerOrdersCommand: PrintOrderCommand[]) => {
        // Set focus to application to notify the user
        await focusWindow().catch((error) => {
            const electronApiError = new ElectronApiError(error);
            LoggerService.getInstance().error(electronApiError);
        });
        if (autoPrint) {
            for(const printCommand of printerOrdersCommand) {
                // Print the kitchenCommand
                await printKitchenCommand(printCommand)
                .then(async (response: any) => {
                    if (printCommand.autoAccepted) {
                        await takeOrder({ orderId: printCommand.id })
                        .catch((error) => {
                            const orderApiError = new OrderApiError(error);
                            LoggerService.getInstance().error(orderApiError);
                            setNewOrdersPrinterNotificationErrorMessage({
                                id: uuid(),
                                message: orderApiError.toFriendlyNotificationMessage(printCommand.id || '', true)})
                         })
                        .then();
                    } else {
                        await acceptOrder({ orderId: printCommand.id })
                        .catch((error) => {
                            const orderApiError = new OrderApiError(error);
                            LoggerService.getInstance().error(orderApiError);
                            setNewOrdersPrinterNotificationErrorMessage({
                                id: uuid(),
                                message: orderApiError.toFriendlyNotificationMessage(printCommand.id || '', false)})
                         })
                    }
                    //Print invoice if exists
                    await getOrderById({ orderId: printCommand.id})
                    .then(async (response) => {
                        const order = response.data as OrderDocument;
                        if (order.invoice) {
                            await printInvoice(order.invoice)
                            .catch(async (error) => {
                                const printerError = new PrinterApiError(error);
                                //Log error in console
                                LoggerService.getInstance().error(printerError);
                                //Log error to backend
                                await sendOrderPrintError({ orderId: printCommand.id || "", error: printerError })
                                .catch((error) => {
                                    LoggerService.getInstance().error(error);
                                });
                                //Send notification to frontend
                                if (isDarwinElectron) {
                                    setNewOrdersPrinterNotificationErrorMessage({
                                        id: uuid(),
                                        message: printerError.toFriendlyNotificationMessage(printCommand.id || '')
                                    })
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        const orderApiError = new OrderApiError(error);
                        LoggerService.getInstance().error(orderApiError);
                        setNewOrdersPrinterNotificationErrorMessage({
                            id: uuid(),
                            message: orderApiError.toFriendlyNotificationMessage(printCommand.id || '', true)})
                    });
                })
                .catch( async (error) => {
                    const printerError = new PrinterApiError(error);
                    //Log error in console
                    LoggerService.getInstance().error(printerError);
                    //Log error to backend
                    await sendOrderPrintError({ orderId: printCommand.id, error: printerError })
                    .catch((error) => {
                        LoggerService.getInstance().error(error);
                    })
                    //Send notification to frontend
                    if (isDarwinElectron) {
                        setNewOrdersPrinterNotificationErrorMessage({ 
                            id: uuid(),
                            message: printerError.toFriendlyNotificationMessage(printCommand.id || '')
                        })
                    }
                })
                .finally(() => {
                    setNewOrdersPrinterCommand(printerOrdersCommand);
                })
            }
        }
        if (soundNotification && printerOrdersCommand.length > 0) {
            for (let i = 0; i < soundRepeats; i++) {
                await playSound();
                //Delay next play sound
                await new Promise(f => setTimeout(f, 3000));
            }
        }
    }, [autoPrint, soundNotification, soundRepeats, isDarwinElectron]);
    
    // Extra handler for polling method errors. This will notify to user if there was an error when polling for order events
    const newOrdersPrinterCommandErrorHandler = useCallback((printerCommandErrorMessage: OrderEventPrinterNotificationError, orderId: string) => {
        setNewOrdersPrintCommandError(printerCommandErrorMessage);
        setNewOrdersPrinterNotificationErrorMessage({
            id: printerCommandErrorMessage.id,
            message: new PrintOrderCommandApiError(printerCommandErrorMessage.message)
                                                    .toFriendlyNotificationMessage(orderId)})
    }, []);
    // --------------------------------------------------------------------------------------------------


    if (newOrderEvent && newOrderNotification !== newOrderEvent) {
        newOrderNotificationArriveHandler(newOrderEvent);
    }

    if (newOrdersPrinterCommandFromPolling && !arrayEquals(newOrdersPrinterCommandFromPolling, newOrdersPrinterCommand)) {
        newOrdersFromPollingArriveHandler(newOrdersPrinterCommandFromPolling);
    }

    if (newOrdersPrintCommandFromPollingError && newOrdersPrintCommandFromPollingError !== newOrdersPrintCommandError) {
        newOrdersPrinterCommandErrorHandler(newOrdersPrintCommandFromPollingError, newOrderEvent?.id || '');
    }

    if (orderCancelledEvent && orderCancelledNotification !== orderCancelledEvent) {
        orderCancelEventHandler(orderCancelledEvent);
    }
    
    return (
        <OrderEventContext.Provider 
            value={{newOrderNotification,
                    newOrdersPrinterCommand,
                    newOrdersPrinterNotificationErrorMessage,
                    webSocketConnected: isConnected,
                    orderCancelledNotification,
                    testNewOrder,
                    testWebSocket,
                    testPollingNewOrders,
                    testOrderCancelledEvent}}>
            {children}
        </OrderEventContext.Provider>
    )
}

export default OrderEventProvider;
