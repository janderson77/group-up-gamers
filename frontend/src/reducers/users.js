import {JOIN_GROUP, LOGIN, LOGOUT, REGISTER, GET_USER} from '../actions/types'

const INITIAL_STATE = {};

const users = (state = INITIAL_STATE, action) => {
    let user;
    switch(action.type){
        case JOIN_GROUP:
            user = {};
            user = {...state}
            user.groups = {...action.payload}
            return user;
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