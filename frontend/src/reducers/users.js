import {JOIN_GROUP, LOGIN, LOGOUT, REGISTER, GET_USER, ADD_GAME_TO_PLAYING, LEAVE_GROUP, CREATE_GROUP, REMOVE_GAME_FROM_PLAYING, EDIT_PROFILE, DELETE_PROFILE, UPDATE_JOINED_GROUPS, DELETE_GROUP, UPDATE_GROUP_FOR_USER, RESET_VISITING_STATE} from '../actions/types'

const INITIAL_STATE = {};

const users = (state = INITIAL_STATE, action) => {
    let user;
    let group;
    switch(action.type){
        case JOIN_GROUP:
            user = {...state.user}
            group = action.payload
            user.groups ? user.groups = {...user.groups, [group.id]: group} : user.groups = {[group.id]: group};
            return {user: user,
                visiting: {}};
        case LEAVE_GROUP:
            user = {...state.user}
            group = action.payload
            delete user.groups[group.group_id]
            return{user: user,
                visiting: {}}
        case CREATE_GROUP:
            user = {...state.user}
            let owned_group = action.payload.newGroup.group
            user.owned_groups = {...user.owned_groups, [owned_group.id]: owned_group};
            return {user: user,
                visiting: {}}
        case UPDATE_JOINED_GROUPS:
            user = {...state.user}
            user.groups = {...user.groups, [action.payload.id]: action.payload}
            return{user: user,
                visiting: {}};
        case DELETE_GROUP:
            user = {...state.user}
            delete user.groups[action.payload.group_id]
            delete user.owned_groups[action.payload.group_id]
            return{user: user,
                visiting: {}};
        case UPDATE_GROUP_FOR_USER:
            console.log(state)
            console.log(action.payload.group)
            return {
                ...state,
                "user": {
                    ...state.user,
                    "groups": {
                        ...state.user.groups,
                        [action.payload.group.id]: {...action.payload.group}
                    },
                    "owned_groups": {
                        ...state.user.owned_groups,
                        [action.payload.group.id]: {...action.payload.group}
                    }
                },
                visiting: {}
                
            }
        case ADD_GAME_TO_PLAYING:
            user = {...state.user}
            user.games_playing = {...user.games_playing, [action.payload.id]: action.payload}
            return {user: user,
                visiting: {}};
        case REMOVE_GAME_FROM_PLAYING:
            user = {...state.user};
            delete user.games_playing[user.toRemove];
            delete user.toRemove;
            return {user: user,
                visiting: {}}
        case RESET_VISITING_STATE:
            return{
                ...state,
                visiting: {}
            }
        case GET_USER:
            let visiting = INITIAL_STATE;
            visiting = {...action.payload}
            return {...state, "visiting": {[action.payload.user.id]: {...action.payload.user}}}
        case REGISTER:
            return {...state, user: {...action.payload}};
        case LOGIN:
            return {...state, 
                user: {...action.payload},
                visiting: {}
            }
        case LOGOUT:
            return{...INITIAL_STATE};
        case EDIT_PROFILE:     
            return{
                ...state, 
                user: {...state.user, ...action.payload},
                visiting: {}
            }
        case DELETE_PROFILE:
            return{...INITIAL_STATE}
        default:
            return state;
    }
}

export default users;