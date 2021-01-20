import axios from 'axios';
import {LOGIN, LOGOUT, REGISTER, GET_CURR_USER} from './types';

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
        let gamesPlayingRes = await axios.get(`${base_url}/${user.id}/games_playing`);
        user.games_playing = gamesPlayingRes.data

        dispatch(doLogin(res.data));
    };
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

export {login, logout, register};