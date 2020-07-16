import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper'
import fetchPosts from './fetchPosts/reducer';
import fetchCategory from './fetchCategory/reducer';

const combinedReducers = combineReducers({
    fetchPosts: fetchPosts,
    fetchCategory: fetchCategory
});

const reducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            if (action.payload.app === 'init') {
                delete action.payload.app;
            }
            if (action.payload.page === 'init') {
                delete action.payload.page;
            }
            if(state.fetchPosts.posts.length === 0) {
                return {
                    ...action.payload, // HYDRATION DATA
                };
            } else {
                return {
                    ...state, // INITIALLY [], PREV CLIENT STATE
                }
            }
        case 'APP':
            return {...state, app: action.payload};
        case 'PAGE':
            return {...state, page: action.payload};
        default:
            return combinedReducers(state, action);
    }
}

export default reducer;
