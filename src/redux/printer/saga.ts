import { Printer, PrinterConfig, PrintTestCommand } from "pages/settings/types";
import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import {
  getPrinters as printerApiGetPrinters,
  getPrinterConfig as printerApiGetConfig,
  createPrinterConfig as printerApiSetConfig,
  updatePrinterConfig as printerApiPutConfig,
  deletePrinter as printerApiDeleteConfig,
  testPrint as printerApiPrintTest,
  printKitchenCommand as printerApiPrint,
  syncPrinter as syncApiPrinter,
  updatePrinter as printerApiUpdatePrinter
} from "helpers/api/printer";
import { printerApiResponseSuccess, printerApiResponseError } from "./actions";
import { PrinterActionTypes } from "./constants";
import { PrintOrderCommand } from "darwinModels";

type PrinterData = {
  payload: {
    printerConfig: PrinterConfig;
    printCommand: PrintOrderCommand;
    printerId: string;
    printer: Printer;
    autoPrint: boolean;
    printTestCommand: PrintTestCommand;
  };
  type: string;
};

function* getPrinters(): SagaIterator {
  try {
    const response = yield call(printerApiGetPrinters);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_LIST, response.data)
    );
  } catch (error: any) {
    yield put(printerApiResponseError(PrinterActionTypes.PRINTER_LIST, error));
  }
}

function* getPrinterConfig(): SagaIterator {
  try {
    const response = yield call(printerApiGetConfig);
    yield put(
      printerApiResponseSuccess(
        PrinterActionTypes.PRINTER_CONFIG_GET,
        response.data
      )
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_CONFIG_GET, error)
    );
  }
}

function* postPrinterConfig({
  payload: { printerConfig },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiSetConfig, printerConfig);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_CONFIG_POST, {})
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_CONFIG_POST, error)
    );
  }
}

function* print({
  payload: { printCommand },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiPrint, printCommand);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_PRINT, {
        printerOrderCommand: printCommand,
      })
    );
  } catch (error: any) {
    yield put(printerApiResponseError(PrinterActionTypes.PRINTER_PRINT, error));
  }
}

function* testPrint({
  payload: { printerId },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiPrintTest, printerId);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_TEST_PRINT, {
        printerId: printerId,
      })
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_TEST_PRINT, error)
    );
  }
}

function* putPrinterConfig({
  payload: { printer },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiPutConfig, printer);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_CONFIG_PUT, {
        printer: printer,
      })
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_CONFIG_PUT, error)
    );
  }
}

function* deletePrinterConfig({
  payload: { printerId },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiDeleteConfig, printerId);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_CONFIG_DELETE, {
        printerId: printerId,
      })
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_CONFIG_DELETE, error)
    );
  }
}

function* syncPrint({
  payload: { printTestCommand },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(syncApiPrinter, printTestCommand);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_SYNC, {
        printTestCommand: printTestCommand,
      })
    );
  } catch (error: any) {
    yield put(printerApiResponseError(PrinterActionTypes.PRINTER_SYNC, error));
  }
}

function* updatePrinter({
  payload: { printer },
  type,
}: PrinterData): SagaIterator {
  try {
    yield call(printerApiUpdatePrinter, printer);
    yield put(
      printerApiResponseSuccess(PrinterActionTypes.PRINTER_UPDATE, {
        printer: printer,
      })
    );
  } catch (error: any) {
    yield put(
      printerApiResponseError(PrinterActionTypes.PRINTER_UPDATE, error)
    );
  }
}


export function* watchFetchPrinters() {
  yield takeEvery(PrinterActionTypes.PRINTER_LIST, getPrinters);
}

export function* watchFetchPrinterConfig() {
  yield takeEvery(PrinterActionTypes.PRINTER_CONFIG_GET, getPrinterConfig);
}

export function* watchPostPrinterConfig() {
  yield takeEvery(PrinterActionTypes.PRINTER_CONFIG_POST, postPrinterConfig);
}

export function* watchPrint() {
  yield takeEvery(PrinterActionTypes.PRINTER_PRINT, print);
}

export function* watchTestPrint() {
  yield takeEvery(PrinterActionTypes.PRINTER_TEST_PRINT, testPrint);
}

export function* watchPutPrinterConfig() {
  yield takeEvery(PrinterActionTypes.PRINTER_CONFIG_PUT, putPrinterConfig);
}

export function* watchDeletePrinterConfig() {
  yield takeEvery(
    PrinterActionTypes.PRINTER_CONFIG_DELETE,
    deletePrinterConfig
  );
}

export function* watchSyncPrint() {
  yield takeEvery(PrinterActionTypes.PRINTER_SYNC, syncPrint);
}

export function* watchUpdatePrinter() {
  yield takeEvery(PrinterActionTypes.PRINTER_UPDATE, updatePrinter);
}

function* printerSaga() {
  yield all([
    fork(watchFetchPrinterConfig),
    fork(watchPostPrinterConfig),
    fork(watchPrint),
    fork(watchTestPrint),
    fork(watchPutPrinterConfig),
    fork(watchDeletePrinterConfig),
    fork(watchSyncPrint),
    fork(watchFetchPrinters),
    fork(watchUpdatePrinter)
  ]);
}

export default printerSaga;
