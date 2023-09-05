export type PrintOrderCommand = {
	id: string;
	displayId: string;
	platform: string;
	brand: string;
	autoAccepted: boolean;
	printerId: string;
	date: Date;
	pickUpDate: Date;
	items: Item[];
	comment?: string;
};

export type Item = {
	name: string;
	qty: number;
	comment?: string;
	subItems?: SubItem[];
};

export type SubItem = {
	name: string;
	qty: number;
};
