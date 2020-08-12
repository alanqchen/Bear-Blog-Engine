import * as fetchDashboardPostsTypes from './types';

const initialDashboardPostsState = {
    posts: [],
    publishedPosts: [], // For future filtering
    draftPosts: [], // For future filtering
    loading: false,
    error: null,
    minID: "-1",
    hasMore: true
};

export default function fetchPostsReducer( state = initialDashboardPostsState, action) {
    switch(action.type) {
        case fetchDashboardPostsTypes.FETCH_DASHBOARD_POSTS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case fetchDashboardPostsTypes.FETCH_DASHBOARD_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: [...state.posts, ...action.payload.response.data],
                minID: action.payload.response.pagination.minID.toString(),
                error: null,
                hasMore: action.hasMore
            };

        case fetchDashboardPostsTypes.FETCH_DASHBOARD_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                minID: state.minID
            };
        
        case fetchDashboardPostsTypes.FETCH_DASHBOARD_POSTS_NO_MORE:
            return {
                ...state,
                loading: false,
                hasMore: false
            };

        case fetchDashboardPostsTypes.FETCH_DASHBOARD_POSTS_SET_MINID:
            return {
                ...state,
                minID: action.minID
            };

        default:
            return state;
    }
};
