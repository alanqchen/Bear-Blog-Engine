import { combineReducers } from 'redux';
import * as fetchPostsTypes from './fetchPosts/types';

const initialFetchPostsState = {
    items: [],
    loading: false,
    error: null
};

const fetchPostsReducer = ( state = initialFetchPostsState, { type, payload }) => {
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
                items: payload.posts
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

const reducers = {
    fetchPosts: fetchPostsReducer
};

export default combineReducers(reducers);
