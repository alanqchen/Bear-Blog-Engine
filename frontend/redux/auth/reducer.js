import * as authTypes from './types';

const initalAuthState = {
    accessToken: "",
    refreshToken: "",
    userData: null,
    loading: false,
    error: null
}

export default function authReducer( state = initalAuthState, action) {
    switch(action.type) {
        case authTypes.LOGIN_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case authTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                accessToken: action.payload.response.data.tokens.accessToken,
                refreshToken: action.payload.response.data.tokens.refreshToken,
                userData: action.payload.response.data.user
            };

        case authTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                accessToken: "",
                refreshToken: "",
                userData: null,
                error: action.payload.error
            };

        case authTypes.LOGOUT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case authTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                accessToken: "",
                refreshToken: "",
                userData: null
            };

        case authTypes.LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case authTypes.REFRESH_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case authTypes.REFRESH_SUCCESS:
            return {
                ...state,
                loading: false,
                accessToken: action.payload.response.data.accessToken,
                refreshToken: action.payload.response.data.refreshToken
            };

        case authTypes.REFRESH_FAILURE:
            return {
                ...state,
                loading: false,
                accessToken: "",
                refreshToken: "",
                error: action.payload.error
            };

        case authTypes.SET_TOKENS:
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken
            };

        default:
            return state;
    }
}
