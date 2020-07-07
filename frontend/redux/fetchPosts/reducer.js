import * as fetchPostsTypes from './types';

const initialFetchPostsState = {
    posts: [],
    loading: false,
    error: null,
    minID: "-1",
    hasMore: true
};

export default function fetchPostsReducer( state = initialFetchPostsState, action) {
    console.log("IN FETCH POSTS REDUCER");
    switch(action.type) {
        case fetchPostsTypes.FETCH_POSTS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case fetchPostsTypes.FETCH_POSTS_SUCCESS:
            console.log("SUCCESS TYPE");
            console.log(state.posts.concat(action.payload.response.data));
            return {
                ...state,
                loading: false,
                posts: state.posts.concat(action.payload.response.data),
                minID: action.payload.response.minID,
                hadMore: action.hasMore
            };

        case fetchPostsTypes.FETCH_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                minID: state.minID
            };
        
        case fetchPostsTypes.FETCH_POSTS_NO_MORE:
            return {
                ...state,
                loading: false,
                hasMore: false
            };

        default:
            return state;
    }
};