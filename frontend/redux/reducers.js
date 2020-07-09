import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper'
import fetchPosts from './fetchPosts/reducer';

const combinedReducers = combineReducers({
    fetchPosts: fetchPosts
});

const reducer = (state, action) => {
    console.log("IN ROOT REDUCER");
    console.log(action.type);
    switch (action.type) {
        case HYDRATE:
            console.log("action payload");
            console.log(action.payload);
            if (action.payload.app === 'init') delete action.payload.app;
            if (action.payload.page === 'init') delete action.payload.page;
            return {
                ...state,
                ...action.payload
            };
        case 'APP':
            return {...state, app: action.payload};
        case 'PAGE':
            return {...state, page: action.payload};
        default:
            console.log("COMBINE REDUCERS");
            return combinedReducers(state, action);
    }
}

export default reducer;
