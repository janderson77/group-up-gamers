import {LOAD_ALL_GROUPS, LOAD_GROUP, RESET_GROUPS, SET_GROUP_GAME} from '../actions/types';

const INITIAL_STATE = {};

const groups = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case RESET_GROUPS:
            return{...INITIAL_STATE};
        case LOAD_GROUP:
            return{
                ...state,
                [action.payload.id]: {...action.payload}
            };
        case LOAD_ALL_GROUPS:
            return{
                ...state,
                "groups": [...action.payload]
            };
        case SET_GROUP_GAME:
            return{
                ...state,
                "group_game": action.payload
            };
        default:
            return state;
    };
};

export default groups