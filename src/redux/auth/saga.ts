import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import {
    login as loginApi,
    signup as signupApi,
    logout as logoutApi,
    forgotPassword as forgotPasswordApi,
    fetchUserData as fetchUserDataApi,
    forgotPasswordConfirm as forgotPasswordConfirmApi,
    signupConfirm as signupConfirmApi,
    passwordChange as passwordChangeApi
    //getHealthStatus as getHealthStatusApi
} from 'helpers';
import { authApiResponseSuccess, authApiResponseError } from './actions';
import { AuthActionTypes } from './constants';
import DarwinApi from 'services/api/DarwinApi';
import { SessionStorageKeys, SessionStorageService } from 'services/SessionStorageService';
import { IToken } from 'config/types';

type UserData = {
    payload: {
        name: string;
        lastName: string;
        email: string;
        password: string;
        code: string;
        token: string;
        newPassword: string;
        oldPassword: string;
    };
    type: string;
};

//const api = new APICore();
//const api = DarwinApi.getInstance();
/**
 * Login the user
 * @param {*} payload - email and password
 */
function* login({ payload: { email, password }, type }: UserData): SagaIterator {
    try {
        
        const response = yield call(loginApi, { email, password });
        const data = response.data;
        const accessToken = data.accessToken as IToken;
        const refreshToken = data.refreshToken as IToken;
        DarwinApi.getInstance().setAuthorization(accessToken.value);
        const responseUser = yield call(fetchUserDataApi);
        let user = responseUser.data;
        user.token = accessToken;
        user.refreshToken = refreshToken;
                
        //Store user in local storage 
        DarwinApi.getInstance().storeLoggedInUser(user);
        //Set active branch as first branchId of user and store it in session storage
        SessionStorageService.setItem(SessionStorageKeys.ACTIVE_BRANCH, user.branchIds[0]);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, user));
    } catch (error: any) {

        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
        DarwinApi.getInstance().storeLoggedInUser(null);
        DarwinApi.getInstance().setAuthorization(null);
    }
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
    try {
        yield call(logoutApi);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, true));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    } finally {
        //Either way, if it can't logout -> clear session and local storage
        DarwinApi.getInstance().storeLoggedInUser(null);
        DarwinApi.getInstance().setAuthorization(null);
    }
}

function* signup({ payload: { email, password } }: UserData): SagaIterator {
    try {
        const response = yield call(signupApi, { email , password });
        const user = response.data;
        DarwinApi.getInstance().setAuthorization(user['token']);
        DarwinApi.getInstance().storeLoggedInUser(user);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        DarwinApi.getInstance().storeLoggedInUser(null);
        DarwinApi.getInstance().setAuthorization(null);
    }
}

function* forgotPassword({ payload: { email } }: UserData): SagaIterator {
    try {
        const response = yield call(forgotPasswordApi, { email } );
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}

function* forgotPasswordConfirm({ payload: { email, code, newPassword } }: UserData): SagaIterator {
    //Confirm password
    try {
        const response = yield call(forgotPasswordConfirmApi, { email, code, newPassword } );
        const responseLogin = yield call(loginApi, { email, password: newPassword });
        const data = responseLogin.data;
        const accessToken = data.accessToken as IToken;
        const refreshToken = data.refreshToken as IToken;
        DarwinApi.getInstance().setAuthorization(accessToken.value);
        const responseUser = yield call(fetchUserDataApi);
        let user = responseUser.data;
        user.token = accessToken; 
        user.refreshToken = refreshToken;
        DarwinApi.getInstance().storeLoggedInUser(user);

        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD_CONFIRM, response));

    } catch (error: any) {
        if (error) {
            yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD_CONFIRM, error));
        } else {
            yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD_CONFIRM, 'Could not change password'));
        }
    }    
}

function* signupConfirm({ payload: { email, code } }: UserData): SagaIterator {
    try {
        const response = yield call(signupConfirmApi, { email, code } );
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER_CONFIRM, response));
    } catch (error: any) {
        if (error) {
            yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER_CONFIRM, error));
        } else {
            yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER_CONFIRM, 'Could not confirm signup'));
        }
    }
}

function* passwordChange({ payload: { email, oldPassword, newPassword } }: UserData): SagaIterator {
    try {
        const response = yield call(passwordChangeApi, { email, oldPassword, newPassword } );

        const responseLogin = yield call(loginApi, { email, password: newPassword });
        const data = responseLogin.data;
        const accessToken = data.accessToken as IToken;
        const refreshToken = data.refreshToken as IToken;
        DarwinApi.getInstance().setAuthorization(accessToken.value);
        const responseUser = yield call(fetchUserDataApi);
        let user = responseUser.data;
        user.token = accessToken;
        user.refreshToken = refreshToken;
        DarwinApi.getInstance().storeLoggedInUser(user);

        yield put(authApiResponseSuccess(AuthActionTypes.PASSWORD_CHANGE, response));
    } catch (error: any) {
        if (error) {
            yield put(authApiResponseError(AuthActionTypes.PASSWORD_CHANGE, error));
        } else {
            yield put(authApiResponseError(AuthActionTypes.PASSWORD_CHANGE, 'Could not change password'));
        }
    }
}

export function* watchLoginUser() {
    yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup() {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword() {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

export function* watchForgotPasswordConfirm() {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD_CONFIRM, forgotPasswordConfirm);
}

export function* watchSignupConfirm() {
    yield takeEvery(AuthActionTypes.SIGNUP_USER_CONFIRM, signupConfirm);
}

export function* watchPasswordChange() {
    yield takeEvery(AuthActionTypes.PASSWORD_CHANGE, passwordChange);
}

function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchLogout), fork(watchSignup), fork(watchForgotPassword), 
        fork(watchForgotPasswordConfirm), fork(watchSignupConfirm), fork(watchPasswordChange) ]);
}

export default authSaga;
