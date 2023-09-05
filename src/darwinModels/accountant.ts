export interface AccountantConfig {
    id: number;
    type: string;
    config: any;
}
  
export type Invoice = {
    externalId?: string;
    number: string;
    type: string;
    seller: InvoiceSeller;
    salesPoint: string;
    paymentMethod: string;
    date: Date;
    client: InvoiceClient;
    items: InvoiceItem[];
    verifier: InvoiceVerifier;
    discount: number;
    total: number;
};
  
export type InvoiceSeller = {
    id: string;
    name: string;
    taxType: string;
};
  
export type InvoiceClient = {
    id: string;
    name: string;
    taxType: string;
};
  
export type InvoiceItem = {
    qty: number;
    name: string;
    unitPrice: number;
};
  
export type InvoiceVerifier = {
    id: string;
    url: string;
    date: Date;
};