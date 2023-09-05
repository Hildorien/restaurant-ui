import { useRedux } from "hooks";
import { useCallback } from "react";
import { getBranchInfo, getBranchMetadata } from "redux/actions";
import { BranchInfo, BranchMetadata } from "redux/branch/types";


export default function useBranch() {
    const { dispatch, appSelector } = useRedux();

    const { loading, branchInfo, error, branchMetadata } = appSelector((state) => ({
        loading: state.Branch.loading,
        error: state.Branch.error,
        branchInfo: state.Branch.branchInfo as BranchInfo, 
        branchMetadata: state.Branch.branchMetadata as BranchMetadata[]
    }));

    const onRequestBranchInfo = useCallback((branchId: number) => {
        dispatch(getBranchInfo(branchId))
    }, [dispatch]);

    const onRequestBranchMetadata = useCallback(() => {
        dispatch(getBranchMetadata());
    }, [dispatch]);


    return {
        loading,
        branchInfo,
        error,
        onRequest: onRequestBranchInfo,
        onRequestBranchMetadata,
        branchMetadata
    }
}