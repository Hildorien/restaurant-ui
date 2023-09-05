import DarwinApi from 'services/api/DarwinApi';

function login(params: { email: string; password: string }) {
    const baseUrl = '/auth';
    return DarwinApi.getInstance().create(`${baseUrl}`, params); 
}

function logout() {
    const baseUrl = '/user/logout/';
    return DarwinApi.getInstance().create(`${baseUrl}`, {});

}

function signup(params: { email: string; password: string }) {
    const baseUrl = '/register/';
    return DarwinApi.getInstance().create(`${baseUrl}`, params);
}

function forgotPassword(params: { email: string }) {
    const baseUrl = '/account/password/reset';
    return DarwinApi.getInstance().create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params: { email: string, code: string, newPassword: string }) {
    const baseUrl = 'account/password/confirm';
    return DarwinApi.getInstance().create(`${baseUrl}`, params);
}

function signupConfirm(params: {email: string, code: string }) {
    const baseUrl = '/account/confirm';
    return DarwinApi.getInstance().create(`${baseUrl}`, params); 
}

function passwordChange(params: { email: string, oldPassword: string, newPassword: string }) {
    const baseUrl = '/account/password/change';
    return DarwinApi.getInstance().create(`${baseUrl}`, params); 
}

function refreshToken(params: { email: string, refreshToken: string }) {
    const baseUrl = '/auth/refresh';
    return DarwinApi.getInstance().create(`${baseUrl}`, params); 
}


export { login, logout, signup, forgotPassword, forgotPasswordConfirm, signupConfirm, passwordChange, refreshToken };
