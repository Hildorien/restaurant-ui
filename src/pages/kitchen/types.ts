import { OrderStatus } from "darwinModels";

export type KitchenOrderRecord = {
    id: string;
    displayId: string;
    createdAt: Date;
    brandId: number;
    brandName: string;
    platform: string;
    deliveryMethod: string;
    status: OrderStatus;
    autoAccepted: boolean;
    items: KitchenOrderItem[];
    observations?: string;
    customer?: {
        completeName: string;
        phone?: string;
    }
};

export type KitchenOrderItem = {
    type: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    comment?: string;
    subItems?: KitchenOrderItem[];
}

export type KitchenOrderPlatform = {
    displayId: string;
    platform: string;
    deliveryMethod: string;
}

export enum DeliveryMethod {
	SELF_DELIVERY = 'SELF_DELIVERY',
	DELIVERY_BY_PLATFORM = 'DELIVERY_BY_PLATFORM',
	PICKUP = 'PICKUP',
	UNKNOWN = 'UNKNOWN',
}

export enum RefreshRate {
    ON_DEMAND = 'ON_DEMAND',
    TEN_SECONDS = 'TEN_SECONDS',
    TWENTY_SECONDS = 'TWENTY_SECONDS'
}

export interface KitchenOrderDetailsProps {
    order: KitchenOrderRecord;
}