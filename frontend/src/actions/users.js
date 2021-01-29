import axios from 'axios';
import {LOGIN, LOGOUT, REGISTER, ADD_GAME_TO_PLAYING, GET_USER, REMOVE_GAME_FROM_PLAYING, EDIT_PROFILE, DELETE_PROFILE} from './types';

const base_url = "http://localhost:3001/users"

const register = (data) => {
    return async function(dispatch) {
        const res = await axios.post(`${base_url}/register`, {
            username: data.username, 
            password: data.password, 
            first_name: data.first_name, 
            last_name: data.last_name,
            dicord_url: data.dicord_url,
            profile_img_url: data.profile_img_url,
            email: data.email
        });

        dispatch(doRegister(res.data));
    };
};

const login = (data) => {
    return async function(dispatch) {
        const res = await axios.post(`${base_url}/login`, {username: data.username, password: data.password});
        let user = res.data;
        dispatch(doLogin(user));
    };
};

const addGameToList = (user_id, game_id, _token, inGameName) => {
    return async function(dispatch) {
        let body = {
            game_id,
            user_id,
            _token,
            in_game_name: inGameName || undefined
        };

        const res = await axios.post(`${base_url}/${user_id}/games_playing`,body);          

        dispatch(addGameToPlaying(res.data[0]))
    }
};

const removeGameFromList = (user, game_id, token) => {
    return async function(dispatch) {
        const user_id = user.id;
        const res = axios.delete(`${base_url}/${user_id}/games_playing/${game_id}`,{data: {_token: token}});

        dispatch(doRemoveGameFromList(user))
    };
};

const getUser = (user_id) => {
    return async function(dispatch) {
        const res = await axios.get(`${base_url}/${user_id}`)

        dispatch(doGetUser(res.data))
    }
};

const editProfile = (data) => {
    return async function(dispatch) {
        dispatch(doEditProfile(data))
    }
};

const deleteProfile = () => {
    return{type: DELETE_PROFILE}
}

const doEditProfile = (data) => {
    return {type: EDIT_PROFILE, payload: data}
}

const doRemoveGameFromList = (data) => {
    return {type: REMOVE_GAME_FROM_PLAYING, payload: data};
};

const doGetUser = (data) => {
    return {type: GET_USER, payload: data}
};

const addGameToPlaying = (data) => {
    return {type: ADD_GAME_TO_PLAYING, payload: data}
};

const logout = () => {
    return async function(dispatch) {
        dispatch(doLogout());
    };
};

const doRegister = (user) => {
    return {type: REGISTER, payload: user}
}

function doLogin(user) {
    return {type: LOGIN, payload: user};
};

function doLogout() {
    return {type: LOGOUT}
};

export {login, logout, register, addGameToList, getUser, removeGameFromList, editProfile, deleteProfile};