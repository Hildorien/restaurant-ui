import useBranch from 'hooks/useBranch';
import React, { createContext, useEffect, useState } from 'react'
import { BranchMetadata } from 'redux/branch/types';
import { SessionStorageKeys, SessionStorageService } from 'services/SessionStorageService';

export type BranchContextType = {
  activeBranchId: number;
  setActiveBranchId: React.Dispatch<React.SetStateAction<number>>;
  branches: BranchMetadata[];
};

export const BranchContext = createContext<BranchContextType | null>(null);

const  BranchProvider: React.FC<React.ReactNode> = ({ children }) => {

    //Import hooks  
    const { branchMetadata, onRequestBranchMetadata } = useBranch();
    
    //Local variables
    const activeBranch = SessionStorageService.getItem(SessionStorageKeys.ACTIVE_BRANCH);
    const initialBranchId: number = Number.isNaN(activeBranch) ? -1 : activeBranch;
    const [activeBranchId, setActiveBranchId] = useState(initialBranchId);
    const [branches, setBranches] = useState<BranchMetadata[]>([]);

    //When branch changes, store it in Session Storage
    useEffect(() => {
      SessionStorageService.setItem(SessionStorageKeys.ACTIVE_BRANCH, activeBranchId);
      onRequestBranchMetadata();
    }, [activeBranchId,onRequestBranchMetadata]);

    useEffect(() => {
      if (branchMetadata) {
        setBranches(branchMetadata as BranchMetadata[]);
      }
    }, [branchMetadata])

    return (
        <BranchContext.Provider value={{activeBranchId, setActiveBranchId, branches}}>
          {children}
        </BranchContext.Provider>
    )
}

export default BranchProvider;