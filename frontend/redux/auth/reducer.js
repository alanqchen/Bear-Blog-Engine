import * as authTypes from "./types";

const initalAuthState = {
  userData: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initalAuthState, action) {
  switch (action.type) {
    case authTypes.LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.payload.response.data.user,
        error: null,
      };

    case authTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        userData: null,
        error: action.payload.error,
      };

    case authTypes.REFRESH_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authTypes.REFRESH_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.payload.response.data.user,
        error: null,
      };

    case authTypes.REFRESH_FAILURE:
      return {
        ...state,
        loading: false,
        accessToken: "",
        refreshToken: "",
        error: action.payload.error,
      };

    default:
      return state;
  }
}
