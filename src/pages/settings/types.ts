export enum PrinterModule {
	NODEPRINTER = 'NODE_PRINTER',
	ESCPOS = 'ESCPOS',
}

export enum PrinterType {
	USB = 'USB',
	NETWORK = 'NETWORK',
}

export enum PrinterFont {
    A = 'A',
    B = 'B',
    C = 'C'
}

export type Printer = {
	id: string;
	name?: string;
    nodePrinterName?: string;
	printIds: string[];
	module: PrinterModule;
	type: PrinterType;
	width?: number;
	encoding?: string;
	font?: PrinterFont;
	networkConfig?: {
		address: string;
		port: number;
	};
	bluetoothConfig?: {
		address: string;
	};
	canPrintInvoice?: boolean;
};

export type PrinterFormData = {
    id: string;
	name?: string;
    nodePrinterName?: string;
	printIds: any[];
    module: PrinterModule;
    type: PrinterType;
    encoding?: string;
    width?: number;
    font?: PrinterFont;
    networkAddress?: string;
    networkPort?: number;
	canPrintInvoice?: boolean
};

export type PrinterConfig = {
	printers: Printer[];
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

export interface PrinterFormProps {
	printerFormDataValues?: PrinterFormData;
	printers: Printer[];
	handleCancelForm: () => void;
	handleDeletePrinterForm: () => void;
	handlePrintTestOrderForm: () => void;
	handleSubmitForm:() => void;
	handleNewPrinterForm:() => void;
}

export interface PrinterListProps {
	printers: Printer[];
	handlePrinterClick: (printer?: PrinterFormData) => void;
	loading: boolean;
	error: any;
}

export interface PrinterSettingsProps {
	accordionId: string;
	isActive: boolean;
	handleClickOnAccordion: (id: string) => void;
}

export type PrintTestCommand = {
	printerId: string;
	printerName: string;
};