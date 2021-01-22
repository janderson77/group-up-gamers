import axios from 'axios';
import {LOAD_GROUP, LOAD_ALL_GROUPS, RESET_GROUPS, JOIN_GROUP} from './types';

const getGroupFromApi = (group_id) => {
    return async function(dispatch) {
        const res = await axios.get(`http://localhost:3001/groups/${group_id}`);
        let{
            id,
            group_name,
            group_slug,
            group_owner_id,
            group_discord_url,
            group_logo_url,
            members
        } = res.data.group;

        const group = {
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
        const res = await axios.get(`http://localhost:3001/groups`, {limit: limit, offset: offset});

        let groupsList = res.data;

        dispatch(gotGroups(groupsList));
    }
};

const joinGroup = (user_id, group_id) => {
    return async function(dispatch) {
        const res = await axios.post(`http://localhost:3001/groups/${group_id}`,{user: user_id});

        if(res.status === 200){
            const groups = await axios.get(`http://localhost:3001/groups/members/${user_id}`)
            dispatch(doJoinGroup(groups))
        }
    }
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

export {getGroupFromApi, getAllGroupsFromApi, resetGroupsState, joinGroup}