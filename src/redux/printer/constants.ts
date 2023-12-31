export enum PrinterActionTypes {
    API_RESPONSE_SUCCESS = '@@printer/API_RESPONSE_SUCCESS',
    API_RESPONSE_ERROR = '@@printer/API_RESPONSE_ERROR',

    PRINTER_LIST = '@@printer/PRINTER_GET',
    PRINTER_CONFIG_GET = '@@printer/PRINTER_CONFIG_GET',
    PRINTER_CONFIG_POST = '@@printer/PRINTER_CONFIG_POST',
    PRINTER_CONFIG_PUT = '@@printer/PRINTER_CONFIG_PUT',
    PRINTER_CONFIG_DELETE = '@@printer/PRINTER_CONFIG_DELETE',
    PRINTER_PRINT = '@@printer/PRINTER_PRINT',
    PRINTER_TEST_PRINT = '@@printer/PRINTER_TEST_PRINT',
    PRINTER_SYNC = '@@printer/PRINTER_SYNC',
    PRINTER_UPDATE = '@@printer/PRINTER_UPDATE',

}