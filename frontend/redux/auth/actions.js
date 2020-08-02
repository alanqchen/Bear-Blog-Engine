import * as types from './types';

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
