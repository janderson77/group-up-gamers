import axios from 'axios';
import {LOAD_GROUP, LOAD_ALL_GROUPS, RESET_GROUPS, JOIN_GROUP, LEAVE_GROUP, CREATE_GROUP, SET_GROUP_GAME, UPDATE_JOINED_GROUPS, CREATE_MESSAGE, DELETE_MESSAGE} from './types';

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
            members,
            messages
        } = res.data.group;

        const group =  {
            id,
            group_name,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members,
            messages
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
        const groupForMyGroups = {
            ...res.data.newGroup.group,
            user_id: res.data.newGroup.member.user_id
        }
        

        if(res.status === 201){
            dispatch(doCreateGroup(res.data))
            dispatch(doUpdateGroups(groupForMyGroups))
        }
    }
};

const setGroupGame = (game) => {
    return async function(dispatch){
        dispatch(doSetGroupGame(game))
    }
};

const createMessage = (data) => {
    return async function(dispatch){
        const res = await axios.post(`${BASE_URL}/${data.group_id}/messages`,data)

        dispatch(doCreateMessage(res.data))
    }
};

const deleteMessage = (data) => {
    return async function(dispatch){
        const res = await axios.delete(`${BASE_URL}/${data.group_id}/messages/${data.message_id}`)

        dispatch(doDeleteMessage(data))
        
    }
}

const doDeleteMessage = (data) => {
    return {type: DELETE_MESSAGE, payload: data}
};

const doCreateMessage = (data) => {
    return {type: CREATE_MESSAGE, payload: data}
};

const doUpdateMessages = (group, message) => {
    return {}
};


// Updates the groups a user has joined in the store with the newly add/created group
const doUpdateGroups = (groups) => {
    return {type: UPDATE_JOINED_GROUPS, payload: groups}
};

// Sets the game in the store for the group the user is creating
const doSetGroupGame = (game) => {
    return {type: SET_GROUP_GAME, payload: game}
};

// Adds the created group to the store in the users owned_groups
function doCreateGroup(data){
    return {type: CREATE_GROUP, payload: data}
};

// Removes the group from the users's groups in the store
function doLeaveGroup(group){
    return {type: LEAVE_GROUP, payload: group}
};

// Adds the group to the users's groups in the store
function doJoinGroup(group) {
    return {type: JOIN_GROUP, payload: group}
};

// Sets the group you are currently viewing as the group in the store
function gotGroup(group) {
    return {type: LOAD_GROUP, payload: group};
};

// Sets the groups to the store
function gotGroups(groups) {
    return {type: LOAD_ALL_GROUPS, payload: groups};
};

// resets group state to default state
function resetGroupsState() {
    return {type: RESET_GROUPS};
};

export {getGroupFromApi, getAllGroupsFromApi, resetGroupsState, joinGroup, leaveGroup, createGroup, setGroupGame, createMessage, deleteMessage}