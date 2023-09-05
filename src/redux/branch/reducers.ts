import { BranchActionTypes } from "./constants";
import { BranchInfo, BranchMetadata } from "./types";

const INIT_STATE = {
    branchInfo:  null,
    loading: false,
    branchMetadata: null,
};

type BranchActionType = {
    type: 
    BranchActionTypes.API_RESPONSE_SUCCESS |
    BranchActionTypes.API_RESPONSE_ERROR |
    BranchActionTypes.BRANCH_INFO |
    BranchActionTypes.BRANCH_METADATA
    payload: {
        actionType?: string;
        data?: BranchInfo[] | {} | BranchInfo | BranchMetadata;
        error?: string;
    };
};


const Branch = (state = INIT_STATE, action: BranchActionType) => {
    switch (action.type) {
        case BranchActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case BranchActionTypes.BRANCH_INFO:
                    return {
                        ...state,
                        branchInfo: action.payload.data,
                        loading: false,
                        error: ''
                    };
                case BranchActionTypes.BRANCH_METADATA:
                    return {
                        ...state,
                        branchMetadata: action.payload.data,
                        loading: false,
                        error: ''
                    }
                    default:
                        return { ...state };

            }
        case BranchActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case BranchActionTypes.BRANCH_INFO:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                case BranchActionTypes.BRANCH_METADATA:
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false
                    }
                    default:
                        return { ...state };

            }
        case BranchActionTypes.BRANCH_INFO:
            return { ...state, loading: true};
        case BranchActionTypes.BRANCH_METADATA:
                return { ...state, loading: true }
        default:
            return { ...state };
    }
}

export default Branch;