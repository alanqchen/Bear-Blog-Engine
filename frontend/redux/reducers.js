import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper'
import fetchPosts from './fetchPosts/reducer';

const combinedReducers = combineReducers({
    fetchPosts
});

const reducer = (state, action) => {
    console.log(action.type);
    if (action.type === HYDRATE) {
        const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
        };
        if (state.fetchPosts.posts) nextState.fetchPosts.posts = state.fetchPosts.posts;
        return nextState;
    } else {
        return combinedReducers(state, action);
    }
}

export default reducer;
