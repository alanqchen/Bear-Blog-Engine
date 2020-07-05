import * as fetchPostsTypes from './types';

const initialFetchPostsState = {
    posts: [],
    loading: false,
    error: null
};

export default function fetchPostsReducer( state = initialFetchPostsState, { type, payload }) {
    switch(type) {
        case fetchPostsTypes.FETCH_POSTS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case fetchPostsTypes.FETCH_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: payload.posts
            };

        case fetchPostsTypes.FETCH_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload.error,
            };

        default:
            return state;
    }
};