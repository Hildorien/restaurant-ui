export type BranchInfo = {
    branchId: number;
    stores: Store[];
}

export type Store = {
    id: number;
    name: string;
    status: boolean;
    integrations: Integration[];
}

export type Integration = {
    id: number,
    app: string,
    appStoreId: string,
    status: Status,
    verificationCode?: Store2FA;
}

export enum Status {
	OPEN = 'OPEN',
	CLOSED = 'CLOSED',
	OUT_OF_HOURS = 'OUT_OF_HOURS',
	SUSPENDED = 'SUSPENDED',
    UNKNOWN = 'UNKNOWN',
    OPENING = 'OPENING',
    CLOSING = 'CLOSING',
}

export type BranchMetadata = {
    id: number;
    name: string;
    address: string;
    lat: string;
    lon: string;
    cityId: string;
    localSaleEnabled: boolean;
}

export interface Store2FA {
    code: string;
    expiration: Date;
}