import { t } from "i18next";
import { OrderStatus } from "darwinModels";
import peyaLogo from 'assets/images/Darwin/deliveryApps/peya.png';
import mpLogo from 'assets/images/Darwin/deliveryApps/mp.png';
import rappiLogo from 'assets/images/Darwin/deliveryApps/rappi.png';
import uberLogo from 'assets/images/Darwin/deliveryApps/uber.png';
import didiLogo from 'assets/images/Darwin/deliveryApps/didi.png'
import { DeliveryMethod, KitchenOrderItem, KitchenOrderRecord, RefreshRate } from "./types";
import { OrderDocument, OrderProductDocument } from "darwinModels";

export function parseOrderStatusToTableColumn(status: OrderStatus) {
    switch(status) {
        case OrderStatus.NEW: 
            return t('New');
        case OrderStatus.TAKEN:
            return t('Taken');
        case OrderStatus.DELIVERED:
            return t('Delivered to rider');
        case OrderStatus.READY_FOR_PICKUP:
            return t('Ready for pick up');
        case OrderStatus.CANCELLED:
            return t('Cancelled');
        case OrderStatus.REJECTED:
            return t('Rejected');
        default:
            return t('Unknown');
    }
}

export function parseOrderStatusTranslationToOrderStatus(status: string): OrderStatus | undefined {
    switch (status.toLowerCase()) {
        case t('New').toLowerCase():
            return OrderStatus.NEW;
        case t('Taken').toLowerCase():
            return OrderStatus.TAKEN;
        case t('Delivered to rider').toLowerCase():
            return OrderStatus.DELIVERED;
        case t('Ready for pick up').toLowerCase():
            return OrderStatus.READY_FOR_PICKUP;
        case t('Cancelled').toLowerCase():
            return OrderStatus.CANCELLED;
        case t('Rejected').toLowerCase():
            return OrderStatus.REJECTED;
        default:
            return undefined;
    }
}

export function getLogo(platform: string) {
    switch(platform) {
        case "PY":
        case "Pedidos Ya":
            return peyaLogo;
        case "MP":
        case "Mercado pago":
            return mpLogo;
        case "RP": 
        case "Rappi":
            return rappiLogo;
        case "UE": 
        case "Uber eats":
            return uberLogo;
        case "DD": 
        case "Didi":
            return didiLogo;
        default:
            return ''
    }
}

export function parseRefreshRate(rate: RefreshRate) {
    switch(rate) {
        case RefreshRate.ON_DEMAND: 
            return t('Update');
        case RefreshRate.TEN_SECONDS: 
            return t('10s to update');
        case RefreshRate.TWENTY_SECONDS:
            return t('20s to update');
        default: 
            return ''
    }
}

export function parseDeliveryMethod(deliveryMethod: string) {
    switch(deliveryMethod) {
        case DeliveryMethod.DELIVERY_BY_PLATFORM:
            return t('Delivery by platform');
        case DeliveryMethod.PICKUP: 
            return t('Pickup');
        case DeliveryMethod.SELF_DELIVERY:
            return t('Self Delivery');
        case DeliveryMethod.UNKNOWN:
            return t('Unknown');
        default:
            return t('Unknown');
    }
}

export function parseDeliveryTranslationToDeliveryMethod(deliveryMethod: string): DeliveryMethod | undefined {
    switch(deliveryMethod) {
        case t('Delivery by platform').toLowerCase():
            return DeliveryMethod.DELIVERY_BY_PLATFORM;
        case t('Pickup'): 
            return DeliveryMethod.PICKUP;
        case  t('Self Delivery').toLowerCase():  
            return DeliveryMethod.SELF_DELIVERY;
        case t('Unknown').toLowerCase():
            return DeliveryMethod.UNKNOWN;
        default:
            return undefined;
    }
}

export function parseOrderSubItemToKitchenOrderSubItem(orderItem: OrderProductDocument): KitchenOrderItem {
    let itemRecord: KitchenOrderItem = {
      type: orderItem.type,
      sku: orderItem.sku,
      name: orderItem.name,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      comment: orderItem.comment,
      subItems: [] //Items only have 2 levels
    }
    return itemRecord;
}

export function parseOrderItemsToKitchenOrderItems(orderItems: OrderProductDocument[]): KitchenOrderItem[] {
    let itemRecords = [];
    for(const orderItem of orderItems) {
      let itemRecord: KitchenOrderItem = {
          type: orderItem.type,
          sku: orderItem.sku,
          name: orderItem.name,
          quantity: orderItem.quantity,
          unitPrice: orderItem.unitPrice,
          comment: orderItem.comment,
          subItems: orderItem.subItems?.map( (i: any) => {
            return parseOrderSubItemToKitchenOrderSubItem(i)
          }) || [],
      }
      itemRecords.push(itemRecord);
    }
    return itemRecords;
}

export function parseOrderToTableRecord(order: OrderDocument, appNames: Record<string, string>): KitchenOrderRecord{
    let record: KitchenOrderRecord = {
            id: order._id || order.id,
            displayId: order.displayId,
            createdAt: new Date(order.createdAt),
            brandId: order.brand.id,
            brandName: order.brand.name,
            platform:  appNames[order.platform] || order.platform ,
            status: parseOrderStatus(order.status, order.autoAccepted),
            deliveryMethod: parseDeliveryMethod(order.deliveryMethod),
            autoAccepted: order.autoAccepted,
            items: parseOrderItemsToKitchenOrderItems(order.products || []),
            observations: order.observations,
            customer: order.customer
    }
    return record;
}

export function parseOrderStatus(status: string, autoAccepted: boolean) {
    if (autoAccepted && status === OrderStatus.NEW) {
        return OrderStatus.TAKEN;
    }
    return status as OrderStatus || OrderStatus.UNKNOWN;
}

export function parseOrdersToTable(orders: OrderDocument[], appNames: Record<string, string>): KitchenOrderRecord[] {
    let tableData: KitchenOrderRecord[] = [];
    for(const order of orders) {
      tableData.push(parseOrderToTableRecord(order, appNames));
    }
    tableData = sortTable(tableData);
    return tableData;
}

export function sortTable(table: KitchenOrderRecord[]) {
    return table.sort(function (r1: KitchenOrderRecord, r2: KitchenOrderRecord): number {
      return (r1.createdAt > r2.createdAt) ? -1: 1; 
    });
}