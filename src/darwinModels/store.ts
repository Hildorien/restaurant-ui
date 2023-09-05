export interface Store {
	id: string;
	clientId: string;
	name: string;
	location?: StoreLocation;
	contact?: StoreContact;
	status?: string;
	webUrl?: string;
	logoUrl?: string;
}

export interface Store2FA {
	code: string;
	expiration: Date;
}

export interface StoreStatus {
	status: boolean;
	reason?: StoreStatusReason;
}

export enum StoreStatusReason {
	OUT_OF_HOURS = 'OUT_OF_HOURS',
	CLOSED = 'CLOSED',
	SUSPENDED = 'SUSPENDED',
}

export enum StoreClosedReason {
	HIGH_DEMAND = 'HIGH_DEMAND',
	NO_STOCK = 'NO_STOCK',
	KITCHEN_ISSUE = 'KITCHEN_ISSUE',
	OTHER = 'OTHER',
}

export interface StoreLocation {
	address: string;
	addressExtra?: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	latitude?: number;
	longitude?: number;
}

export interface StoreContact {
	emails?: string[];
	phones?: string[];
}
