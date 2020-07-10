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
            console.log("SUCCESS TYPE v1");
            console.log([...state.posts, ...action.payload.response.data]);
            let temp = [];
            temp.concat(state.posts);
            temp.concat(action.payload.response.data);
            console.log("TEMP");
            console.log(temp);
            return {
                ...state,
                loading: false,
                posts: temp,
                minID: action.payload.response.pagination.minID.toString(),
                error: null,
                hasMore: action.hasMore
            };

        case fetchPostsTypes.FETCH_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: null,
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