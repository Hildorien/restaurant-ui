import { PrinterConfig } from "pages/settings/types";
import { PrinterActionTypes } from "./constants";

const INIT_STATE = {
  loading: false,
  printerConfig: null,
  updatePrinterConfigSuccess: false,
  updatePrinterConfigError: false,
  deleteSuccess: false,
  deleteError: false,
  printTestOrderSuccess: false,
  printSuccess: false,
  syncSuccess: false,
  nodePrinterList: null,
  error: '',
  updatePrinterSuccess: true
};

type PrinterActionType = {
  type:
    | PrinterActionTypes.PRINTER_LIST
    | PrinterActionTypes.PRINTER_CONFIG_GET
    | PrinterActionTypes.API_RESPONSE_SUCCESS
    | PrinterActionTypes.API_RESPONSE_ERROR
    | PrinterActionTypes.PRINTER_CONFIG_GET
    | PrinterActionTypes.PRINTER_CONFIG_POST
    | PrinterActionTypes.PRINTER_CONFIG_PUT
    | PrinterActionTypes.PRINTER_CONFIG_DELETE
    | PrinterActionTypes.PRINTER_PRINT
    | PrinterActionTypes.PRINTER_TEST_PRINT
    | PrinterActionTypes.PRINTER_SYNC 
    | PrinterActionTypes.PRINTER_UPDATE
  payload: {
    actionType?: string;
    data?: PrinterConfig | boolean;
    error?: string;
  };
};

const Printer = (state = INIT_STATE, action: PrinterActionType) => {
  switch (action.type) {
    case PrinterActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case PrinterActionTypes.PRINTER_LIST:
          return {
            ...state,
            nodePrinterList: action.payload.data,
            loading: false,
          };
        case PrinterActionTypes.PRINTER_CONFIG_GET:
          return {
            ...state,
            printerConfig: action.payload.data,
            loading: false,
          };
        case PrinterActionTypes.PRINTER_CONFIG_POST:
        case PrinterActionTypes.PRINTER_CONFIG_PUT:
          return {
            ...state,
            loading: false,
            updatePrinterConfigSuccess: true,

          };
        case PrinterActionTypes.PRINTER_PRINT:
          return {
            ...state,
            loading: false,
            printSuccess: true,
          };
        case PrinterActionTypes.PRINTER_TEST_PRINT:
          return {
            ...state,
            loading: false,
            printTestOrderSuccess: true,
          };
        case PrinterActionTypes.PRINTER_CONFIG_DELETE:
          return {
            ...state,
            loading: false,
            deleteSuccess: true,
          };
        case PrinterActionTypes.PRINTER_SYNC:
          return {
            ...state,
            loading: false,
            syncSuccess: true,
          };
        case PrinterActionTypes.PRINTER_UPDATE:
          return {
            ...state,
            loading: false,
            updatePrinterSuccess: true,
          }
        default:
          return { ...state };
      }
    case PrinterActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case PrinterActionTypes.PRINTER_LIST:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        case PrinterActionTypes.PRINTER_CONFIG_GET:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        case PrinterActionTypes.PRINTER_CONFIG_PUT:
        case PrinterActionTypes.PRINTER_CONFIG_POST:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            updatePrinterConfigSuccess: false,
            updatePrinterConfigError: true,
          };
        case PrinterActionTypes.PRINTER_PRINT:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            printSuccess: false,
          };
        case PrinterActionTypes.PRINTER_TEST_PRINT:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            printTestOrderSuccess: false,
          };
        case PrinterActionTypes.PRINTER_CONFIG_DELETE:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            deleteSuccess: false,
            deleteError: true
          };
        case PrinterActionTypes.PRINTER_SYNC:
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            syncSuccess: false,
          };
          case PrinterActionTypes.PRINTER_UPDATE:
            return {
              ...state,
              error: action.payload.error,
              loading: false,
              updatePrinterSuccess: false,
            }
        default:
          return { ...state };
      }
    case PrinterActionTypes.PRINTER_LIST:
      return {
        ...state,
        loading: true,
      };
    case PrinterActionTypes.PRINTER_CONFIG_GET:
      return { ...state, loading: true, error: '' };
    case PrinterActionTypes.PRINTER_CONFIG_PUT:
    case PrinterActionTypes.PRINTER_CONFIG_POST:
      return { ...state, loading: true, updatePrinterConfigSuccess: false, updatePrinterConfigError: false, error: '' };
    case PrinterActionTypes.PRINTER_PRINT:
      return { ...state, loading: true, printSuccess: false, error: '' };
    case PrinterActionTypes.PRINTER_TEST_PRINT:
      return { ...state, loading: true, printTestOrderSuccess: false, error: '' };
    case PrinterActionTypes.PRINTER_CONFIG_DELETE:
      return { ...state, loading: true, deleteSuccess: false, deleteError: false, error: '' };
    case PrinterActionTypes.PRINTER_SYNC:
      return { ...state, loading: true, syncSuccess: false, error: '' };
    case PrinterActionTypes.PRINTER_UPDATE:
      return { ...state, updatePrinterSuccess: false, error: '', loading: true}
    default:
      return { ...state };
  }
};

export default Printer;
