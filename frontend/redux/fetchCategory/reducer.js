import * as fetchCategoryTypes from './types';

const initialFetchCategoryState = {
    posts: [],
    loading: false,
    error: null,
    minID: "-1",
    hasMore: true,
    lastCategory: ""
};

export default function fetchCategoryReducer( state = initialFetchCategoryState, action) {
    switch(action.type) {
        case fetchCategoryTypes.FETCH_CATEGORY_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
                lastCategory: action.category
            };

        case fetchCategoryTypes.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: [...state.posts, ...action.payload.response.data],
                minID: action.payload.response.pagination.minID.toString(),
                error: null,
                hasMore: action.hasMore,
                lastCategory: action.category
            };

        case fetchCategoryTypes.FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                minID: state.minID,
                lastCategory: action.category
            };
        
        case fetchCategoryTypes.FETCH_CATEGORY_NO_MORE:
            return {
                ...state,
                loading: false,
                hasMore: false
            };

        default:
            return state;
    }
};
