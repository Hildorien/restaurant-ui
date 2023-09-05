import { OrderStore } from './order';
import { Schedule } from './schedule';

export interface Menu {
	id?: string;
	name?: string;
	storeId: string;
	items: MenuItem[];
	schedules?: Schedule[];
}

export interface MenuItem {
	name: string;
	category: MenuCategory;
	description: string;
	sku: string;
	stock: ItemStock;
	type: ItemType;
	price: number;
	imageUrl?: string;
	availability?: MenuItemAvailability;
	sortingPosition?: number;
	maxLimit?: number;
	subItems?: MenuItem[];
	shouldUpdate?: boolean;
}

export interface MenuItemAvailability {
	availableFrom?: Date;
	availableTo?: Date;
}

export interface MenuCategory {
	id: string;
	name: string;
	description?: string;
	minQty?: number;
	maxQty?: number;
	sortingPosition?: number;
}

export enum ItemStock {
	AVAILABLE = 'AVAILABLE',
	UNAVAILABLE = 'UNAVAILABLE',
}

export enum ItemType {
	TOPPING = 'TOPPING',
	PRODUCT = 'PRODUCT',
}

export enum MenuStatus {
	FAILED = -1,
	NOT_PUBLISHED = 0,
	PENDING = 1,
	APPROVED = 2,
	REJECTED = 3,
}

export interface MenuTrackingEvent {
	externalId: string;
	platform: string;
	store: OrderStore;
	status: MenuStatus;
}
