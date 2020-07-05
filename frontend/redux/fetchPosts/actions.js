import * as types from './types';

export const fetchPostsBegin = () => (dispatch) => 
dispatch({
    type: types.FETCH_POSTS_BEGIN
});

export const fetchPostsSuccess = posts => ({
    type: types.FETCH_POSTS_SUCCESS,
    payload: { posts }
});

export const fetchPostsFailure = error => ({
    type: types.FETCH_POSTS_FAILURE,
    payload: { error }
});
