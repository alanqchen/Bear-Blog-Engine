import * as fetchCategoryTypes from "./types";

const initialFetchCategoryState = {
  posts: [],
  loading: false,
  error: null,
  minID: "-1",
  hasMore: true,
  lastCategory: "",
};

export default function fetchCategoryReducer(
  state = initialFetchCategoryState,
  action
) {
  switch (action.type) {
    case fetchCategoryTypes.FETCH_CATEGORY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case fetchCategoryTypes.FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload.response.data],
        minID: action.payload.response.pagination.minID.toString(),
        error: null,
        hasMore: action.hasMore,
      };

    case fetchCategoryTypes.FETCH_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        minID: state.minID,
      };

    case fetchCategoryTypes.FETCH_CATEGORY_NO_MORE:
      return {
        ...state,
        loading: false,
        hasMore: false,
      };

    case fetchCategoryTypes.FETCH_CATEGORY_NEW:
      return {
        ...state,
        hasMore: true,
        lastCategory: action.category,
      };

    case fetchCategoryTypes.FETCH_CATEGORY_SET_MINID:
      return {
        ...state,
        minID: action.minID,
        hasMore: action.hasMore,
      };

    default:
      return state;
  }
}
