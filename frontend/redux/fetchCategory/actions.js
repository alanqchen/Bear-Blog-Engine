import * as types from './types';
import config from '../../config';

export const fetchCategoryBegin = (category) => ({
    type: types.FETCH_CATEGORY_BEGIN,
    category: category
});

export const fetchCategorySuccess = (response, category) => ({
    type: types.FETCH_CATEGORY_SUCCESS,
    payload: { response },
    hasMore: response.data.length > 0,
    category: category
});

export const fetchCategoryFailure = (error, category) => ({
    type: types.FETCH_CATEGORY_FAILURE,
    payload: { error },
    category: category
});

export const fetchCategoryNoMore = () => ({
    type: types.FETCH_CATEGORY_NO_MORE
});

export function fetchCategory(category) {
    return (dispatch, getState) => {
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
                dispatch(fetchCategoryNoMore(category));
            } else {
                console.log("Dispatching success...");
                console.log(json);
                dispatch(fetchCategorySuccess(json, category));
            }
            return json;
          })
          .catch(error => dispatch(fetchCategoryFailure(error, category)));
    };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
