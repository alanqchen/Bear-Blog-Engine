import * as fetchPostsTypes from './types';

const initialFetchPostsState = {
    posts: [],
    loading: false,
    error: null,
    minID: "-1",
    hasMore: true
};

export default function fetchPostsReducer( state = initialFetchPostsState, action) {
    switch(action.type) {
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
                posts: [...state.posts, ...action.payload.response.data],
                minID: action.payload.response.pagination.minID.toString(),
                error: null,
                hasMore: action.hasMore
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

        case fetchPostsTypes.FETCH_POSTS_SET_MINID:
            return {
                ...state,
                minID: action.minID
            }

        default:
            return state;
    }
};
