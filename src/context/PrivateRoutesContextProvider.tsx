import React from 'react';
import PrinterCheckpointContext from 'context/PrinterCheckpointProvider';
import NewOrdersContext from 'context/OrderEventProvider';
import BranchProvider from 'context/BranchProvider';
import BrandProvider from './BrandProvider';
/**
 * This component is a wrapper of all contexts that are needed within a private route component
 * 
 */
const PrivateRoutesContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  return (
        <BranchProvider>
            <PrinterCheckpointContext>
                <NewOrdersContext>
                        <BrandProvider>
                            {children}
                        </BrandProvider>
                </NewOrdersContext>
            </PrinterCheckpointContext>
        </BranchProvider>
  )
}

export default PrivateRoutesContextProvider;