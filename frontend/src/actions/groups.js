import axios from 'axios';
import {LOAD_GROUP, LOAD_ALL_GROUPS, RESET_GROUPS, JOIN_GROUP, LEAVE_GROUP, CREATE_GROUP, SET_GROUP_GAME} from './types';

const BASE_URL = 'http://localhost:3001/groups'

const getGroupFromApi = (group_id) => {
    return async function(dispatch) {
        const res = await axios.get(`${BASE_URL}/${group_id}`);
        let{
            id,
            group_name,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members
        } = res.data.group;

        const group =  {
            id,
            group_name,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members
        };

        dispatch(gotGroup(group))
    };
};

const getAllGroupsFromApi = (limit, offset) => {
    return async function(dispatch) {
        const res = await axios.get(`${BASE_URL}`, {limit: limit, offset: offset});

        let groupsList = res.data;

        dispatch(gotGroups(groupsList));
    }
};

const joinGroup = (user_id, group_id) => {
    return async function(dispatch) {
        const res = await axios.post(`${BASE_URL}/${group_id}/join`,{user: user_id});

        if(res.status === 200){
            const groups = await axios.get(`${BASE_URL}/members/${user_id}`)
            dispatch(doJoinGroup(groups))
        }
    }
};

const leaveGroup = (user_id, group_id) => {
    return async function(dispatch) {
        const res = await axios.post(`${BASE_URL}/${group_id}/leave`,{
            user: user_id
        });

        if(res.status === 200){
            dispatch(doLeaveGroup(res.data))
        }
    }
};

const createGroup = (data) => {
    return async function(dispatch) {
        const res = await axios.post(`${BASE_URL}`, data);

        if(res.status === 201){
            dispatch(doCreateGroup(res.data))
        }
    }
};

const setGroupGame = (game) => {
    return async function(dispatch){
        dispatch(doSetGroupGame(game))
    }
}


const doSetGroupGame = (game) => {
    return {type: SET_GROUP_GAME, payload: game}
}

function doCreateGroup(data){
    return {type: CREATE_GROUP, payload: data}
}

function doLeaveGroup(group){
    return {type: LEAVE_GROUP, payload: group}
}

function doJoinGroup(group) {
    return {type: JOIN_GROUP, payload: group}
}

function gotGroup(group) {
    return {type: LOAD_GROUP, payload: group};
};

function gotGroups(groups) {
    return {type: LOAD_ALL_GROUPS, payload: groups};
};

function resetGroupsState() {
    return {type: RESET_GROUPS};
};

export {getGroupFromApi, getAllGroupsFromApi, resetGroupsState, joinGroup, leaveGroup, createGroup, setGroupGame}