import { getPrinterConfig, syncPrinter } from 'helpers';
import { Printer, PrinterConfig, PrintTestCommand } from 'pages/settings/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import LoggerService from 'services/LoggerService';
import { GlobalVariablesContext, GlobalVariablesContextType } from './GlobalVariablesProvider';

export type PrinterCheckpointContextType = {
    checkpointError: string;
    setCheckpointError: React.Dispatch<React.SetStateAction<string>>;
}

export const PrinterCheckpointContext = createContext<PrinterCheckpointContextType | null>(null);

const  PrinterCheckpointProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [checkpointError, setCheckpointError] = useState<string>("");
    const { isDarwinElectron } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;


    //Poll printer-server to print a status check every 1 hour
    useEffect(() => {
        if (isDarwinElectron) {
            LoggerService.getInstance().log('Initialized Printer checkpoint...' + new Date().toLocaleString());
            const interval = setInterval(async () => {
                LoggerService.getInstance().log('Printer checkpoint...' + new Date().toLocaleString());
                await getPrinterConfig()
                .then((response) => {
                    const printerConfig = response.data as PrinterConfig;
                    if (printerConfig && printerConfig.printers.length > 0) {
                        const printer: Printer = printerConfig.printers[0];
                        if (printer.printIds.length > 0) {
                            const printTestCommand: PrintTestCommand = { 
                                printerName: printer.name || '', 
                                printerId: printer.printIds[0]
                            }
                            syncPrinter(printTestCommand);
                        } else {
                            throw new Error('There are no printIds configured');
                        }
                        setCheckpointError("");
                    } else {
                        throw new Error('Printer configuration not found');
                    }
                })
                .catch((error) => {
                    LoggerService.getInstance().error(error);
                    setCheckpointError(error);
                });
              }, 3600000);
            return () => clearInterval(interval);
        }
    }, [isDarwinElectron]);

    return (
        <PrinterCheckpointContext.Provider value={{checkpointError, setCheckpointError}}>
            {children}
        </PrinterCheckpointContext.Provider>
    )
}

export default PrinterCheckpointProvider;
