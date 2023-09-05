export interface StoreStatusUpdated {
	createdAt: Date;
	platform: string;
	externalStoreId: string;
	storeId: string;
	reason: string;
	enabled: boolean;
}
