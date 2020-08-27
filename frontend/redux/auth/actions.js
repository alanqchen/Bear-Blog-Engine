import * as types from './types';
import { getDisplayName } from 'next/dist/next-server/lib/utils';

export const loginBegin = () => ({
    type: types.LOGIN_BEGIN
});

export const loginSuccess = (response) => ({
    type: types.LOGIN_SUCCESS,
    payload: { response }
});

export const loginFailure = (error) => ({
    type: types.LOGIN_FAILURE,
    payload: { error }
});

export const logoutBegin = () => ({
    type: types.LOGOUT_BEGIN
});

export const logoutSuccess = () => ({
    type: types.LOGOUT_SUCCESS
});

export const logoutFailure = (error) => ({
    type: types.LOGOUT_FAILURE,
    payload: { error }
});

export const refreshBegin = () => ({
    type: types.REFRESH_BEGIN
});

export const refreshSuccess = (response) => ({
    type: types.REFRESH_SUCCESS,
    payload: { response }
});

export const refreshFailure = (error) => ({
    type: types.REFRESH_FAILURE,
    payload: { error }
});

export const setTokens = (accessToken, refreshToken) => ({
    type: types.SET_TOKENS,
    payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
});

export function login(username, password) {
    return (dispatch) => {
        const params = {
            username: username,
            password: password
        };
        dispatch(loginBegin());
        return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            if(json.success) {
                localStorage.setItem("bearpost.JWT", json.data.tokens.accessToken);
                localStorage.setItem("bearpost.REFRESH", json.data.tokens.refreshToken);
                dispatch(loginSuccess(json));
            }
        })
        .catch(error => {
            localStorage.removeItem("bearpost.JWT");
            localStorage.removeItem("bearpost.REFRESH");
            dispatch(loginFailure(error));
        });
    }
}

export function logout() {
    return (dispatch, getState) => {
        dispatch(logoutBegin());
        return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/logout', {
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getState().auth.accessToken
            }
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                if(json.success) {
                    localStorage.removeItem("bearpost.JWT");
                    localStorage.removeItem("bearpost.REFRESH");
                    dispatch(logoutSuccess());
                }
            })
            .catch(error => dispatch(logoutFailure(error)));
    }
}

export function refresh() {
    return (dispatch, getState) => {
        dispatch(refreshBegin());
        return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/refresh', {
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getState().auth.refreshToken
            }
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                if(json.success) {
                    localStorage.setItem("bearpost.JWT", json.data.tokens.accessToken);
                    localStorage.setItem("bearpost.REFRESH", json.data.tokens.refreshToken);
                    dispatch(refreshSuccess(json));
                }
            })
            .catch(error => {
                localStorage.removeItem("bearpost.JWT");
                localStorage.removeItem("bearpost.REFRESH");
                dispatch(refreshFailure(error));
            });
    }
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
