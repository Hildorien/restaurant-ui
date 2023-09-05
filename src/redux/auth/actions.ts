import { AuthActionTypes } from './constants';

export type AuthActionType = {
    type:
        | AuthActionTypes.API_RESPONSE_SUCCESS
        | AuthActionTypes.API_RESPONSE_ERROR
        | AuthActionTypes.FORGOT_PASSWORD
        | AuthActionTypes.FORGOT_PASSWORD_CONFIRM
        | AuthActionTypes.LOGIN_USER
        | AuthActionTypes.LOGOUT_USER
        | AuthActionTypes.RESET
        | AuthActionTypes.SIGNUP_USER
        | AuthActionTypes.SIGNUP_USER_CONFIRM
        | AuthActionTypes.PASSWORD_CHANGE
    payload: {} | string;
};

type User = {
    name: string;
	lastName: string;
	email: string;
	branchIds: number[];
	roles: string[];
	scopes: string[];
    token: string;
};


// common success
export const authApiResponseSuccess = (actionType: string, data: User | {}): AuthActionType => ({
    type: AuthActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const authApiResponseError = (actionType: string, error: string): AuthActionType => ({
    type: AuthActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const loginUser = (email: string, password: string): AuthActionType => ({
    type: AuthActionTypes.LOGIN_USER,
    payload: { email, password },
});

export const logoutUser = (): AuthActionType => ({
    type: AuthActionTypes.LOGOUT_USER,
    payload: {},
});

export const signupUser = (fullname: string, email: string, password: string): AuthActionType => ({
    type: AuthActionTypes.SIGNUP_USER,
    payload: { fullname, email, password },
});

export const forgotPassword = (email: string): AuthActionType => ({
    type: AuthActionTypes.FORGOT_PASSWORD,
    payload: { email },
});

export const resetAuth = (): AuthActionType => ({
    type: AuthActionTypes.RESET,
    payload: {},
});

export const forgotPasswordConfirm = (email: string, code: string, newPassword: string): AuthActionType => ({
    type: AuthActionTypes.FORGOT_PASSWORD_CONFIRM,
    payload: { email, code, newPassword },
});

export const signupConfirm = (email: string, code: string): AuthActionType => ({
    type: AuthActionTypes.SIGNUP_USER_CONFIRM,
    payload: { email, code },
});

export const passwordChange = (email: string, oldPassword: string, newPassword: string): AuthActionType => ({
    type: AuthActionTypes.PASSWORD_CHANGE,
    payload: { email, oldPassword, newPassword },
});