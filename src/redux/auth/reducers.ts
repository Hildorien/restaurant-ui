import { LocalStorageKeys, LocalStorageService } from 'services/LocalStorageService';
import { AuthActionTypes } from './constants';

const AUTH_SESSION_KEY = LocalStorageKeys.USER;

const INIT_STATE = {
    user: LocalStorageService.getItem(AUTH_SESSION_KEY),
    loading: false,
};

type UserData = {
    name: string;
	lastName: string;
	email: string;
	branchIds: number[];
	roles: string[];
	scopes: string[];
    token: string;
};

type AuthActionType = {
    type:
        | AuthActionTypes.API_RESPONSE_SUCCESS
        | AuthActionTypes.API_RESPONSE_ERROR
        | AuthActionTypes.LOGIN_USER
        | AuthActionTypes.SIGNUP_USER
        | AuthActionTypes.LOGOUT_USER
        | AuthActionTypes.RESET
        | AuthActionTypes.FORGOT_PASSWORD
        | AuthActionTypes.FORGOT_PASSWORD_CONFIRM
        | AuthActionTypes.SIGNUP_USER_CONFIRM
        | AuthActionTypes.PASSWORD_CHANGE
    payload: {
        actionType?: string;
        data?: UserData | {};
        error?: string;
    };
};

type State = {
    user?: UserData | {};
    loading?: boolean;
    value?: boolean;
};

const Auth = (state: State = INIT_STATE, action: AuthActionType) => {
    switch (action.type) {
        case AuthActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        user: action.payload.data,
                        userLoggedIn: true,
                        loading: false,
                        userLogout: false
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        userSignUp: true,
                        loading: false,
                    };
                }
                case AuthActionTypes.LOGOUT_USER: {
                    return {
                        ...state,
                        user: null,
                        loading: false,
                        userLogout: true,
                        userLoggedIn: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        resetPasswordSuccess: action.payload.data,
                        loading: false,
                        passwordReset: true,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD_CONFIRM: {
                    return {
                        ...state,
                        resetPasswordConfirmSuccess: action.payload.data,
                        userLoggedIn: true,
                        userLogout: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER_CONFIRM: {
                    return {
                        ...state,
                        signupConfirmSuccess: action.payload.data,
                        userLoggedIn: true,
                        userLogout: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.PASSWORD_CHANGE: {
                    return {
                        ...state,
                        passwordChangeSuccess: action.payload.data,
                        userLoggedIn: true,
                        userLogout: false,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        error: action.payload.error,
                        userLoggedIn: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        registerError: action.payload.error,
                        userSignUp: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        passwordReset: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD_CONFIRM: {
                    return {
                        ...state,
                        error: action.payload.error,
                        userLoggedIn: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER_CONFIRM: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                case AuthActionTypes.PASSWORD_CHANGE: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.LOGIN_USER:
            return { ...state, loading: true, userLoggedIn: false };
        case AuthActionTypes.SIGNUP_USER:
            return { ...state, loading: true, userSignUp: false };
        case AuthActionTypes.LOGOUT_USER:
            return { ...state, loading: true, userLogout: false };
        case AuthActionTypes.PASSWORD_CHANGE:
            return { ...state, loading: true }
        case AuthActionTypes.FORGOT_PASSWORD:
            return { ...state, loading: true }
        case AuthActionTypes.FORGOT_PASSWORD_CONFIRM:
            return { ...state, loading: true, userLoggedIn: false }
        case AuthActionTypes.RESET:
            return {
                ...state,
                loading: false,
                error: false,
                userSignUp: false,
                userLoggedIn: false,
                userLogout: false,
                passwordReset: false,
                passwordChange: false,
                resetPasswordSuccess: null,
                resetPasswordConfirmSuccess: null,
                signUpConfirmSuccess: null,
                passwordChangeSuccess: null,
            };
        default:
            return { ...state };
    }
};

export default Auth;
