import { OrderDocument, PrintOrderCommand } from "darwinModels";
import { useCallback } from "react";
import { getOrders, getOrderById, getPrintOrderCommandById, getOrderHistory } from "redux/actions";
import useRedux from "./useRedux";

export default function useOrders() {
    const { dispatch, appSelector } = useRedux();
    const { loading, error, printOrderCommand, order, orders, orderHistory, orderHistoryTotalDocs, orderHistoryTotalPages } = appSelector((state) => ({
        loading: state.Orders.loading,
        error: state.Orders.error,
        printOrderCommand: state.Orders.printOrderCommand as PrintOrderCommand,
        order: state.Orders.order as OrderDocument,
        orders: state.Orders.orders as OrderDocument[],
        orderHistory: state.Orders.orderHistory as OrderDocument[],
        orderHistoryTotalDocs: state.Orders.orderHistoryTotalDocs,
        orderHistoryTotalPages: state.Orders.orderHistoryTotalPages,
    }));

    const onRequestPrintOrderCommand = useCallback((orderId: string) =>{
        dispatch(getPrintOrderCommandById(orderId));
    },[dispatch]);
    
    const onRequestOrderById = useCallback((orderId: string) =>{
        dispatch(getOrderById(orderId));
    },[dispatch]);
    
    const onRequestOrders = useCallback((branchId: number) =>{
        dispatch(getOrders(branchId.toString()));
    },[dispatch])

    const onRequestOrderHistory = useCallback((branchId: number, page: number, from?: Date, to?: Date, search?: string) =>{
        dispatch(getOrderHistory(branchId.toString(), page,  from, to, search));
    },[dispatch])

    return {
        loading,
        error,
        printOrderCommand,
        order,
        orders,
        orderHistory,
        orderHistoryTotalDocs,
        orderHistoryTotalPages,
        onRequestPrintOrderCommand,
        onRequestOrderById,
        onRequestOrders,
        onRequestOrderHistory
    }
}