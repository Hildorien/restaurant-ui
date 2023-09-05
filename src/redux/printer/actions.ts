import { Printer, PrinterConfig, PrintTestCommand } from "pages/settings/types";
import { PrintOrderCommand } from "darwinModels";
import { PrinterActionTypes } from "./constants";

export type PrinterActionType = {
    type:
    PrinterActionTypes.API_RESPONSE_SUCCESS |
    PrinterActionTypes.API_RESPONSE_ERROR |
    PrinterActionTypes.PRINTER_CONFIG_GET |
    PrinterActionTypes.PRINTER_CONFIG_POST |
    PrinterActionTypes.PRINTER_CONFIG_PUT |
    PrinterActionTypes.PRINTER_CONFIG_DELETE |
    PrinterActionTypes.PRINTER_LIST |
    PrinterActionTypes.PRINTER_PRINT |
    PrinterActionTypes.PRINTER_TEST_PRINT |
    PrinterActionTypes.PRINTER_SYNC | 
    PrinterActionTypes.PRINTER_UPDATE
    payload: {} | string | PrintOrderCommand | PrinterConfig | Printer | PrintTestCommand;
};

// common success
export const printerApiResponseSuccess = (actionType: string, data: PrinterConfig | PrintOrderCommand | Printer | {}): PrinterActionType => ({
    type: PrinterActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const printerApiResponseError = (actionType: string, error: string): PrinterActionType => ({
    type: PrinterActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getPrinters = (): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_LIST,
    payload: {},
});

export const getPrinterConfig = (): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_CONFIG_GET,
    payload: {},
});

export const postPrinterConfig = (printerConfig: PrinterConfig): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_CONFIG_POST,
    payload: { printerConfig },
});

export const putPrinterConfig = (printer: Printer): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_CONFIG_PUT,
    payload: { printer }
});

export const deletePrinterConfig = (printerId: string): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_CONFIG_DELETE,
    payload: { printerId }
})

export const print = (printCommand: PrintOrderCommand): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_PRINT,
    payload: { printCommand },
});

export const testPrint = (printerId: string): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_TEST_PRINT,
    payload: { printerId }
});

export const syncPrint = (printTestCommand: PrintTestCommand): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_SYNC,
    payload: { printTestCommand }
});

export const updatePrinter = (printer: Printer): PrinterActionType => ({
    type: PrinterActionTypes.PRINTER_UPDATE,
    payload: { printer }
});