import * as fetchPostsTypes from './types';

const initialFetchPostsState = {
    posts: [],
    loading: false,
    error: null,
    minID: "-1"
};

export default function fetchPostsReducer( state = initialFetchPostsState, { type, payload }) {
    console.log("IN FETCH POSTS REDUCER");
    switch(type) {
        case fetchPostsTypes.FETCH_POSTS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case fetchPostsTypes.FETCH_POSTS_SUCCESS:
            console.log("SUCCESS TYPE");
            return {
                ...state,
                loading: false,
                posts: payload.response.data,
                minID: payload.response.minID
            };

        case fetchPostsTypes.FETCH_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload.error,
                minID: state.minID
            };

        default:
            return state;
    }
};