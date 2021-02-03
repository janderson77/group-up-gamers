import axios from 'axios';
import {LOAD_GROUP, LOAD_ALL_GROUPS, RESET_GROUPS, JOIN_GROUP, LEAVE_GROUP, CREATE_GROUP, SET_GROUP_GAME, UPDATE_JOINED_GROUPS, CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_GROUP, KICK_MEMBER, BAN_MEMBER, UNBAN_MEMBER, DELETE_GROUP, UPDATE_GROUP_FOR_USER} from './types';
import {addGameToPlaying} from './users'

const BASE_URL = 'http://localhost:3001/groups'

const getGroupFromApi = (group_id) => {
    return async function(dispatch) {
        const res = await axios.get(`${BASE_URL}/${group_id}`);
        let{
            id,
            group_name,
            game_name,
            game_id,
            game_slug,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members,
            messages
        } = res.data.group;

        members = res.data.group.members.filter(m => m.is_banned !== true)

        const group =  {
            id,
            group_name,
            game_name,
            game_slug,
            game_id,
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

const getGroupFromApiAdmin = (group_id) => {
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

        members = res.data.group.members.filter(m => m.is_banned !== true)
        const bannedMembers = res.data.group.members.filter(m => m.is_banned === true)

        const group =  {
            id,
            group_name,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members,
            bannedMembers,
            messages
        };

        dispatch(gotGroup(group))
        return group
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
            dispatch(doJoinGroup(groups.data[group_id]))
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
        delete data.in_game_name
        const res = await axios.post(`${BASE_URL}`, data);
        const groupForMyGroups = {
            ...res.data.newGroup.group,
            user_id: res.data.newGroup.member.user_id,
            group_id: res.data.newGroup.group.id
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
        await axios.delete(`${BASE_URL}/${data.group_id}/messages/${data.message_id}`)

        dispatch(doDeleteMessage(data))
        
    }
};

const updateGroup = (data) => {
    let groupData = {
        group_name: data.group_name,
        group_discord_url: data.group_discord_url,
        group_logo_url: data.group_logo_url
    };

    let group_slug = data.group_name.toLowerCase().split(" ").join("-");
    groupData.group_slug = group_slug;
    return async function(dispatch){
        const res = await axios.patch(`${BASE_URL}/${data.id}`, groupData)

        dispatch(doUpdateGroup(res.data))
        dispatch(doUpdateGroupForUsers(res.data))
    }
};

const kickMember = (group_id, userid) => {
    return async function(dispatch) {
        await axios.post(`${BASE_URL}/${group_id}/kick/${userid}`);

        let data = {
            group_id: group_id,
            user_id: userid
        }
        dispatch(doKickMember(data))
    }
};

const banMember = (group_id, user_id) => {
    return async function(dispatch){
        const res = await axios.post(`${BASE_URL}/${group_id}/ban/${user_id}`)
        dispatch(doBanMember(res.data))
    }
};

const unBanMember = (group_id, user_id) => {
    return async function(dispatch) {
        const res = await axios.post(`${BASE_URL}/${group_id}/unban/${user_id}`);
        dispatch(doUnbanMember(res.data))
    }
};

const deleteGroup = (group_id) => {
    return async function(dispatch){
        await axios.delete(`${BASE_URL}/${group_id}`)

        dispatch(doDeleteGroup(group_id))
    }
};

const joinGroupAndAddGame = (data) => {
    return async function(dispatch){
        let body = {
            game_id: Number(data.game_id),
            user_id: Number(data.user_id),
            _token: data._token,
            in_game_name: data.in_game_name || undefined,
            username: data.username
        };
        const add = await axios.post(`http://localhost:3001/users/${body.user_id}/games_playing`, body)

        dispatch(addGameToPlaying(add.data[0]))

        const res = await axios.post(`${BASE_URL}/${data.group_id}/join`,{user: data.user_id});

        if(res.status === 200){
            const groups = await axios.get(`${BASE_URL}/members/${data.user_id}`)
            dispatch(doJoinGroup(groups.data[data.group_id]))
        }
    }
}

const doDeleteGroup = (group_id) => {
    return {type: DELETE_GROUP, payload: {group_id}}
}

const doUnbanMember = (data) => {
    return {type: UNBAN_MEMBER, payload: data}
};

const doBanMember = (data) => {
    return {type: BAN_MEMBER, payload: data}
};

const doKickMember = (data) => {
    return{type: KICK_MEMBER, payload: data}
};

const doUpdateGroup = (data) => {
    return{type: UPDATE_GROUP, payload: data}
};

const doUpdateGroupForUsers = (data) => {
    return {type: UPDATE_GROUP_FOR_USER, payload: data}
};

const doDeleteMessage = (data) => {
    return {type: DELETE_MESSAGE, payload: data}
};

const doCreateMessage = (data) => {
    return {type: CREATE_MESSAGE, payload: data}
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

export {getGroupFromApi, getGroupFromApiAdmin, getAllGroupsFromApi, resetGroupsState, joinGroup, leaveGroup, createGroup, setGroupGame, createMessage, deleteMessage, updateGroup, kickMember, banMember, unBanMember, deleteGroup, joinGroupAndAddGame}