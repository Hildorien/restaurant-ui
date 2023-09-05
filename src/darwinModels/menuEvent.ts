export interface MenuApproved {
	id: string;
	createdAt: Date;
	idPlatform: string;
	store: {
		id: string;
		name?: string;
	};
}

export interface MenuRejected {
	id: string;
	createdAt: Date;
	idPlatform: string;
	reason: string;
	store: {
		id: string;
		name?: string;
	};
}
