import {JOIN_GROUP, LOGIN, LOGOUT, REGISTER, GET_USER, ADD_GAME_TO_PLAYING, LEAVE_GROUP, CREATE_GROUP, REMOVE_GAME_FROM_PLAYING} from '../actions/types'

const INITIAL_STATE = {};

const users = (state = INITIAL_STATE, action) => {
    let user;
    let group;
    switch(action.type){
        case JOIN_GROUP:
            user = {};
            user = {...state.user}
            group = action.payload.data[0]
            user.groups = {...user.groups, [group.group_id]: group}
            return {user: user};
        case LEAVE_GROUP:
            user = {};
            user = {...state.user}
            group = action.payload
            delete user.groups[group.group_id]
            return{user: user}
        case CREATE_GROUP:
            user = {}
            user = {...state.user}
            let owned_group = action.payload.newGroup
            user.owned_groups = {[owned_group.id]: owned_group};
            return {user: user}
        case ADD_GAME_TO_PLAYING:
            user = {...state.user}
            user.games_playing = {...user.games_playing, [action.payload.id]: action.payload}
            return {user: user};
        case REMOVE_GAME_FROM_PLAYING:
            user = {};
            user = {...state.user};
            delete user.games_playing[user.toRemove];
            delete user.toRemove;
            return {user: user}
        case GET_USER:
            let visiting = INITIAL_STATE;
            visiting = {...action.payload}
            return {...state, visiting: visiting};
        case REGISTER:
            user = {};
            user = {...action.payload};
            return {...state, user: user};
        case LOGIN:
            user = {};
            user = {...action.payload}
            return {...state, user: user};
        case LOGOUT:
            return{...INITIAL_STATE}
        default:
            return state;
    }
}

export default users;