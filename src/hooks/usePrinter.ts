import useRedux from "./useRedux";
import { PrintOrderCommand } from "darwinModels";
import { Printer, PrinterConfig, PrintTestCommand } from "pages/settings/types";
import {  print, syncPrint, getPrinterConfig, postPrinterConfig, putPrinterConfig, deletePrinterConfig, testPrint, 
    getPrinters, updatePrinter } from "redux/actions";
import { useCallback } from "react";

export default function usePrinter() {
    const { dispatch, appSelector } = useRedux();
    const { loading, 
        error, 
        printSuccess,
        syncSuccess,
        nodePrinterList,
        printerConfig,
        updatePrinterConfigSuccess,
        deleteSuccess,
        printTestOrderSuccess,
        updatePrinterConfigError,
        deleteError,
        updatePrinterSuccess } = appSelector((state) => ({
            loading: state.Printer.loading,
            error: state.Printer.error,
            printSuccess: state.Printer.printSuccess,
            syncSuccess: state.Printer.syncSuccess,
            nodePrinterList: state.Printer.nodePrinterList,
            printerConfig: state.Printer.printerConfig as PrinterConfig,
            updatePrinterConfigSuccess: state.Printer.updatePrinterConfigSuccess,
            deleteSuccess: state.Printer.deleteSuccess,
            printTestOrderSuccess: state.Printer.printTestOrderSuccess,
            updatePrinterConfigError: state.Printer.updatePrinterConfigError,
            deleteError: state.Printer.deleteError,
            updatePrinterSuccess: state.Printer.updatePrinterSuccess
    }));

    const onRequestPrint = useCallback((printerOrderCommand: PrintOrderCommand) => {
        dispatch(print(printerOrderCommand));
    },[dispatch]);

    const onSyncPrinter = useCallback((printTestCommand: PrintTestCommand) => {
        dispatch(syncPrint(printTestCommand));
    },[dispatch]);

    const onRequestPrinters = useCallback(() => {
        dispatch(getPrinterConfig());
    }, [dispatch]);

    const onRequestNodePrinters = useCallback(() => {
        dispatch(getPrinters());
    }, [dispatch]);

    const onPrintTestOrder = useCallback((printerId: string) => {
        dispatch(testPrint(printerId));
    }, [dispatch]);

    const onDeletePrinter = useCallback((printerId: string) => {
        dispatch(deletePrinterConfig(printerId));
    },[dispatch])

    const onNewPrinterConfig = useCallback((printerConfig: PrinterConfig) => {
        dispatch(postPrinterConfig(printerConfig));
    }, [dispatch]);

    const onAddPrinterToConfig = useCallback((printer: Printer) => {
        dispatch(putPrinterConfig(printer));
    },[dispatch]);

    const onUpdatePrinter = useCallback((printer: Printer) => {
        dispatch(updatePrinter(printer));
    }, [dispatch])

    return {
        loading,
        error,
        printSuccess,
        onRequestPrint,
        syncSuccess,
        onSyncPrinter,
        nodePrinterList,
        printerConfig,
        updatePrinterConfigSuccess,
        deleteSuccess,
        printTestOrderSuccess,
        onRequestPrinters,
        onRequestNodePrinters,
        onPrintTestOrder,
        onDeletePrinter,
        onNewPrinterConfig,
        onAddPrinterToConfig,
        updatePrinterConfigError,
        deleteError,
        updatePrinterSuccess,
        onUpdatePrinter
    }

}