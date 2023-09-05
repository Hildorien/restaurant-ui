import {  Printer, PrinterConfig, PrintTestCommand } from "pages/settings/types";
import { PrintOrderCommand } from "darwinModels";
import PrinterApi from "services/api/PrinterApi";

export interface Invoice {
    externalId?: string;
        number: string;
        type: string;
        seller: {
            id: string;
            name: string;
            taxType: string;
        };
        salesPoint: string;
        paymentMethod: string;
        date: Date;
        client: {
            id: string;
            name: string;
            taxType: string;
        };
        items: {
            qty: number;
            name: string;
            unitPrice: number;
        }[];
        verifier: {
            id: string;
            url: string;
            date: Date;
        };
        discount: number;
        total: number;
}

function printerApiStatus() {
    const baseUrl = '/health';
    return PrinterApi.getInstance().get(`${baseUrl}`, {});
}

async function getPrinterConfig() {
    const baseUrl = '/printer/config';
    return PrinterApi.getInstance().get(`${baseUrl}`, {});
}

function getPrinters() {
    const baseUrl = '/printer';
    return PrinterApi.getInstance().get(`${baseUrl}`, {});
}

function createPrinterConfig(printerConfig: PrinterConfig) {
    const baseUrl = '/printer/config';
    return PrinterApi.getInstance().create(`${baseUrl}`, printerConfig);
}

function updatePrinterConfig(printer: Printer) {
    const baseUrl = '/printer/config';
    return PrinterApi.getInstance().update(`${baseUrl}`, printer);
}

function printKitchenCommand(order: PrintOrderCommand) {
    const baseUrl = '/printer/print';
    return PrinterApi.getInstance().create(`${baseUrl}`, order);
}

function testPrint(printerId: string) {
    const baseUrl = 'printer/print-test/' + printerId;
    return PrinterApi.getInstance().create(`${baseUrl}`, {});
}

function deletePrinter(printerId: string) {
    const baseUrl = 'printer/config/' + printerId;
    return PrinterApi.getInstance().delete(`${baseUrl}`, {});
}

async function syncPrinter(printCommand: PrintTestCommand) {
    const baseUrl = '/printer/sync';
    return PrinterApi.getInstance().create(`${baseUrl}`, printCommand);
}

function updatePrinter(printer: Printer) {
    const baseUrl = '/printer/config/' + printer.id;
    return PrinterApi.getInstance().update(`${baseUrl}`, printer);
}

function printInvoice(invoice: Invoice) {
    const baseUrl = '/printer/print/invoice';
    return PrinterApi.getInstance().create(`${baseUrl}`, invoice);
}

function printCancelReceipt(order: PrintOrderCommand) {
    const baseUrl = '/printer/print/cancellation';
    return PrinterApi.getInstance().create(`${baseUrl}`, order);
}

export { getPrinterConfig, getPrinters, createPrinterConfig, printKitchenCommand, testPrint, 
    updatePrinterConfig, deletePrinter, printerApiStatus, syncPrinter, updatePrinter, printInvoice, printCancelReceipt }