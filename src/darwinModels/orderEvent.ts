import { OrderBranch, OrderBrand, OrderCancelledReason, OrderStatus, OrderStore } from './order';

export interface OrderEvent {
	id?: string;
	externalId?: string;
	createdAt: Date;
	platform: string;
	store: OrderStore;
	brand?: OrderBrand;
	branch?: OrderBranch;
}

export interface NewOrder extends OrderEvent {}

export interface OrderCancelled extends OrderEvent {
	reason: OrderCancelledReason;
	unknownReason?: string;
}

export interface OrderStatusChange extends OrderEvent {
	from: OrderStatus;
	to: OrderStatus;
	extra?: any;
}

export interface OrderOtherEvent extends OrderEvent {
	event: string;
	data: any;
}

export interface RejectOrder {
	reason: string;
}

export interface CancelOrder {
	reason: string;
}

export interface OrderTracking extends OrderEvent {
	status: OrderStatus;
}
