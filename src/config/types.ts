
export interface IToken {
	expire?: number;
	value: string;
}
export interface User  {
    name: string;
	lastName: string;
	email: string;
	branchIds: number[];
	role: Role;
	scopes: string[];
    token: IToken;
	refreshToken: IToken;
};

export interface ApiConfig {
    url: string;
}


export interface Config {
	name: string;
	version: number;
    api: ApiConfig;
	trackingId: string; // Tracking_ID for google analytics
	appNames: Record<string, string>;
	environment: string;
	imageUrl: string;
	productCategorySortingPosition: string[];
	whatsappNumber: string;
	hotjarId: number;
	hotjarSnipperVersion: number;
	printerServerUrl: string;
	electronServerUrl: string;
}

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production'
}

export enum StoreClosedReason {
    HIGH_DEMAND = 'HIGH_DEMAND',
    NO_STOCK = 'NO_STOCK',
    KITCHEN_ISSUE = 'KITCHEN_ISSUE',
    OTHER = 'OTHER'
}
export class StoreCloseReasonParser {
	public static parse(reason: StoreClosedReason) {
		switch(reason){
			case StoreClosedReason.HIGH_DEMAND:
				return 'High Demand';
			case StoreClosedReason.NO_STOCK:
				return 'Out of stock';
			case StoreClosedReason.KITCHEN_ISSUE:
				return 'Problems at the kitchen'
			case StoreClosedReason.OTHER:
				return 'Other'
			default:
				return '';
		}
	}
}

export enum Role {
	ADMIN = 'admin',
	MANAGER = 'manager',
	STAFF = 'staff',
}