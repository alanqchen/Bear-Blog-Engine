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
            console.log("root reducer state");
            console.log(state);
            if (action.payload.app === 'init') {
                console.log("DELETE APP");
                console.log(action.payload.app);
                delete action.payload.app;
            }
            if (action.payload.page === 'init') {
                console.log("DELETE PAGE");
                console.log(action.payload.page);
                delete action.payload.page;
            }
            if(state.fetchPosts.posts === []) {
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
            console.log("COMBINE REDUCERS");
            console.log("action payload");
            console.log(action.payload);
            console.log("root reducer state");
            console.log(state);
            return combinedReducers(state, action);
    }
}

export default reducer;
