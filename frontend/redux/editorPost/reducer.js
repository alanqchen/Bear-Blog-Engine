import * as editorPostTypes from './types';

const initialFetchCategoryState = {
    id: -1,
    title: "",
    subtitle: "",
    slug: "",
    featureImgUrl: "",
    body: "",
    tags: [],
    hidden: true,
    authorID: "",
    createdAt: "",
    updatedAt: null,
};

export default function fetchCategoryReducer( state = initialFetchCategoryState, action) {
    switch(action.type) {
        case editorPostTypes.SAVE_POST_BEGIN:
            return {
                ...state,
            };

        case editorPostTypes.SAVE_POST_SUCCESS:
            return {
                ...state,
            };

        case editorPostTypes.SAVE_POST_FAILURE:
            return {
                ...state,
            };
        
        case editorPostTypes.UPLOAD_IMAGE_BEGIN:
            return {
                ...state,
            };

        case editorPostTypes.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
            };

        case editorPostTypes.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
            };

        default:
            return state;
    }
};
