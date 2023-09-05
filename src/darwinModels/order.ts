import { Invoice } from './accountant';

export enum DeliveryMethod {
	SELF_DELIVERY = 'SELF_DELIVERY',
	DELIVERY_BY_PLATFORM = 'DELIVERY_BY_PLATFORM',
	DINE_IN = 'DINE_IN',
	PICKUP = 'PICKUP',
	UNKNOWN = 'UNKNOWN',
}

export enum PaymentMethod {
	CASH = 'CASH',
	CREDIT_CARD = 'CC',
	DEBIT_CARD = 'DC',
	VIRTUAL_WALLET = 'VW',
	UNKNOWN = 'UNKNOWN',
}

export enum OrderItemType {
	EXTRA = 'EXTRA',
	PRODUCT = 'PRODUCT',
	UNKNOWN = 'UNKNOWN',
}

export enum OrderStatus {
	NEW = 'NEW',
	TAKEN = 'TAKEN',
	COOKING = 'COOKING',
	REJECTED = 'REJECTED',
	CANCELLED = 'CANCELLED',
	COURIER_IN_STORE = 'COURIER_IN_STORE',
	READY_FOR_PICKUP = 'READY_FOR_PICKUP',
	ON_DELIVERY = 'ON_DELIVERY',
	ARRIVED_TO_DOMICILIARY = 'ARRIVED_TO_DOMICILIARY',
	DELIVERED = 'DELIVERED',
	UNKNOWN = 'UNKNOWN',
}

export enum OrderCancelledReason {
	CANCELLED_BY_USER = 'CANCELLED_BY_USER',
	CANCELLED_WITH_CHARGE = 'CANCELLED_WITH_CHARGE',
	CANCELLED_WITHOUT_CHARGES = 'CANCELLED_WITHOUT_CHARGES',
	CANCELLED_BY_SUPPORT = 'CANCELLED_BY_SUPPORT',
	CANCELLED_BY_SUPPORT_WITH_CHARGES = 'CANCELLED_BY_SUPPORT_WITH_CHARGES',
	CANCELLED_BY_APPLICATION_USER = 'CANCELLED_BY_APPLICATION_USER',
	CANCELLED_FROM_CMS = 'CANCELLED_FROM_CMS',
	CANCELLED_BY_FRAUD_AUTOMATION = 'CANCELLED_BY_FRAUD_AUTOMATION',
	CANCELLED_STORE_CLOSED = 'CANCELLED_STORE_CLOSED',
	CANCELLED_BY_SK_WITH_CHARGE = 'CANCELLED_BY_SK_WITH_CHARGE',
	UNKNOWN = 'UNKNOWN',
}

export enum DiscountType {
	PRODUCT_DISCOUNT = 'PRODUCT_DISCOUNT',
	TOTAL_DISCOUNT = 'TOTAL_DISCOUNT',
	SHIPPING_DISCOUNT = 'SHIPPING_DISCOUNT',
	SERVICE_FEE_DISCOUNT = 'SERVICE_FEE_DISCOUNT',
	COUPON = 'COUPON',
	OTHER = 'OTHER',
	UNKNOWN = 'UNKNOWN',
}

export interface Order {
	id: string;
	externalId: string;
	displayId: string;
	companyId?: number;
	cookingTime: number;
	country?: string;
	platform: string;
	createdAt: Date;
	takenAt?: Date;
	cookingAt?: Date;
	courierReadyAt?: Date;
	readyAt?: Date;
	deliveredAt?: Date;
	rejectedAt?: Date;
	cancelledAt?: Date;
	onDeliveryAt?: Date;
	arrivedDomiciliaryAt?: Date;
	cancelReason?: OrderCancelledReason;
	rejectReason?: string;
	paymentMethod: PaymentMethod;
	rawPaymentMethod: string;
	deliveryMethod: DeliveryMethod;
	pricing: OrderPricing;
	delivery?: OrderDelivery;
	billing?: OrderBilling;
	products: OrderProduct[];
	discounts: OrderDiscount[];
	productIngredients?: ProductIngredient[];
	customer?: OrderCustomer;
	store: OrderStore;
	branch?: OrderBranch;
	brand?: OrderBrand;
	trunk?: OrderTrunk;
	tz?: string;
	observations?: string;
	isMarketing?: boolean;
	integrator?: Integrator;
	accountant?: Accountant;
	retries?: number;
	invoice?: Invoice;
}

export interface Integrator {
	id: number;
	type: string;
	sync: boolean;
}

export interface Accountant {
	id: number;
	type: string;
	sync: boolean;
}

export interface OrderDelivery {
	address?: string;
	streetName?: string;
	streetNumber?: string;
	city?: string;
	zip?: string;
	neighborhood?: string;
	additionalDetails?: string;
	lat?: number;
	lon?: number;
}

export interface OrderBilling {
	name: string;
	documentNumber: string;
	documentType: string;
	email?: string;
	phone?: string;
	billingType: string;
	address?: string;
}

export interface ProductIngredient {
	sku: string;
	name: string;
	qty?: number;
	unitCost: number;
	totalCost: number;
	unit: string;
	eficiency?: number;
	isKitchenPrep: boolean;
	ingredients?: ProductIngredient[];
}

export interface OrderProduct {
	externalId: string;
	type: OrderItemType;
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
	isCombo?: boolean;
	comment?: string;
	subItems?: OrderProduct[];
}

export interface OrderDiscount {
	type: DiscountType;
	description: string;
	amount: number;
	percentage?: number;
	subsidizedAmountByApp?: number;
	sku?: string;
	productQuantity?: number;
	includesSubitems?: boolean;
}

export interface OrderCustomer {
	externalId?: string;
	externalType?: string;
	firstName?: string;
	lastName?: string;
	completeName: string;
	phone?: string;
	nid?: string;
	email?: string;
}

export interface OrderStore {
	id?: string;
	externalId: string;
}

export interface OrderBrand {
	id?: number;
	name?: string;
}

export interface OrderBranch {
	id?: number;
	name?: string;
	lat?: number;
	lon?: number;
	cityId?: string;
}

export interface OrderTrunk {
	id?: string;
	name?: string;
}

export interface OrderCharges {
	shipping?: number;
	service?: number;
	tip?: number;
}

export interface OrderPricing {
	currency?: string;
	charges?: OrderCharges;
	totalOrder: number;
	totalProducts: number;
	totalDiscounts?: number;
	totalChargesDiscount?: number;
	totalSubsidizedByApp?: number;
}
