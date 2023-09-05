import { t } from "i18next";
import { Printer, PrinterConfig, PrinterFormData, PrinterModule, PrinterType } from "../types";
import { Brand } from "redux/brands/types";
import uuid from "react-uuid";

/**
 * Adds new printer config based on formData. If printer already exists it updates its values.
 * Returns a new printer config
 * @param formData
 * @param currentPrinters
 * @returns
 */
export function createNewPrinterConfig(printer: Printer, currentPrinters: Printer[]): PrinterConfig {
    let newPrinterConfig: Printer[] = [];
    if (currentPrinters.length === 0) {
        newPrinterConfig.push(printer);
    }
    for (const printerConfig of currentPrinters) {
        if (printerConfig.id === printer.id) {
            newPrinterConfig.push(printer);
        } else {
            newPrinterConfig.push(printerConfig);
        }
    }
    return { printers: newPrinterConfig };
}

export function parsePrinter(formData: PrinterFormData){
    const printIds = formData.printIds.map(pIds => pIds.value);
    let newPrinter: Printer = {
        id: formData.id || uuid(), //If it is new, assign a uuid
        name: formData.name,
        nodePrinterName: formData.nodePrinterName,
        printIds: printIds,
        module: formData.module,
        //Although NODEPRINTER doesn't use PrinterType, if we pass type as NETWORK without ip address, printer-server will return an error 
        type: formData.module === PrinterModule.NODEPRINTER ? PrinterType.USB : formData.type,
        width: formData.width,
        encoding: formData.encoding,
        font: formData.font,
        canPrintInvoice: formData.canPrintInvoice
    };
    if (formData.networkAddress && formData.networkPort) {
        newPrinter.networkConfig = {
            address: formData.networkAddress,
            port: formData.networkPort
        };
    }
    return newPrinter;
}

export function parseErrorMessage(apiError: any, printerName: string, printerModule: PrinterModule) {
    let reason;
    if (apiError.message) {
        const message: string = apiError.message;
        if (message.includes('Encoding')) {
            reason = t('Encoding parameter is not recognized, please change it')
        }
        if (message.includes('No printer found') || message.includes('Can not find printer'))
        {
            reason = t('Could not find the printer with the parameters configured')
        }
        if (message.includes('timeout')) {
            reason = t('Printer took too long to respond, check the configuration parameters are correct')
        }
        if (message.includes('EHOSTUNREACH') || message.includes('ECONNREFUSED')) {
            reason = t('Ip address was not found')
        }
        if (printerModule === PrinterModule.NODEPRINTER && (
            message.includes('The printer name is invalid') || message.includes('No such file or directory'))) {
            reason = t('The name of the printer must match the name of the brand for NODE_PRINTER module');
        }
        if (message.includes('Network Error')) {
            reason = t('There is a connection error with the printer server, please restart the application');
        }
    }
    if (apiError.error) {
        const errorMessage: string = apiError.error;
        if (errorMessage.includes('There is already a printer setup')) {
            reason = t('One of the selected brands is already configured in another printer')
        }
    }

    return `${t('Printer service could not handle the request for the printer')} ${printerName || ''}.
                ${reason ? reason :  t('Please check the configuration parameters are correct')}.
                ${t('If problem persists contact support')}.`;

}

export function toBrandOptions(brands: Brand[], branchId: number) {
    return brands.map( (value:Brand) => {
        return { label: value.name, value: `${branchId}-${value.id}`}
    });
}

export function getPrintersFromBranchId(printers: Printer[], branchId: number) {
    return printers.filter(pr => pr.printIds.every(pIds => pIds.split('-')[0] === branchId.toString()));
}

export function fromPrintIdsToBrands(printIds: string[], allBrands: Brand[]): Brand[] {
    return allBrands.filter(br => printIds.map(pId => pId.split('-')[1]).includes(br.id.toString()));
}