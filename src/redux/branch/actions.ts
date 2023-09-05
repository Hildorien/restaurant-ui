import { BranchActionTypes } from "./constants";
import { BranchInfo } from "./types";

export type BranchActionType = {
    type: 
    BranchActionTypes.API_RESPONSE_SUCCESS |
    BranchActionTypes.API_RESPONSE_ERROR |
    BranchActionTypes.BRANCH_INFO |
    BranchActionTypes.BRANCH_METADATA
    payload: {} | string;
};

// common success
export const branchApiResponseSuccess = (actionType: string, data: BranchInfo[] | {}): BranchActionType => ({
    type: BranchActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const branchApiResponseError = (actionType: string, error: string): BranchActionType => ({
    type: BranchActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getBranchInfo = (branchId: number): BranchActionType => ({
    type: BranchActionTypes.BRANCH_INFO,
    payload: { branchId },
});

export const getBranchMetadata = (): BranchActionType => ({
    type: BranchActionTypes.BRANCH_METADATA,
    payload: {},
});