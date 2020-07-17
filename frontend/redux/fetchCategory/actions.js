import * as types from './types';
import config from '../../config';

export const fetchCategoryBegin = () => ({
    type: types.FETCH_CATEGORY_BEGIN,
});

export const fetchCategorySuccess = (response) => ({
    type: types.FETCH_CATEGORY_SUCCESS,
    payload: { response },
    hasMore: response.data.length > 0
});

export const fetchCategoryFailure = (error) => ({
    type: types.FETCH_CATEGORY_FAILURE,
    payload: { error }
});

export const fetchCategoryNoMore = () => ({
    type: types.FETCH_CATEGORY_NO_MORE
});

export const fetchCategoryNew = (category) => ({
    type: types.FETCH_CATEGORY_NEW,
    category: category
})

export function fetchCategory(category) {
    return (dispatch, getState) => {
        
        const { fetchCategory } = getState();

        if(fetchCategory.lastCategory !== category) {
            dispatch(fetchCategoryNew(category));
        }

        const jsonBody = {
            maxID: getState().fetchCategory.minID,
            tags: [category]
        };
        dispatch(fetchCategoryBegin());
        return fetch(config.apiURL+'/api/v1/posts/get', {
            method: 'post',
            body: JSON.stringify(jsonBody)
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(json => {
            if(json.success && json.data.length === 0) {
                dispatch(fetchCategoryNoMore());
            } else {
                dispatch(fetchCategorySuccess(json));
            }
            return json;
          })
          .catch(error => dispatch(fetchCategoryFailure(error)));
    };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
