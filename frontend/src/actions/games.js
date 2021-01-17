import axios from 'axios';
import {LOAD_GAME, LOAD_ALL_GAMES, RESET_GAME} from './types'
import {platformsWithId} from '../dataSets/platforms'
import {game_modesWithId} from '../dataSets/game_modes'

const getGameFromAPI = (game_slug) => {
    return async function (dispatch) {
        const res = await axios.get(`http://localhost:3001/games/${game_slug}`);
        let{
            id,
            game_name,
            slug,
            cover_art,
            summary,
            platforms,
            game_modes
        } = res.data.game;

        if(game_modes){
            const gameModes = [...game_modes]
            let mappedGameModes = gameModes.map(e => game_modesWithId[e].name)
            game_modes = mappedGameModes
        }else{
            game_modes = ["Unknown"]
        }
        

        if(platforms){
            const platformsMap = [...platforms];
            let mappedPlatforms = platformsMap.map(e => platformsWithId[e].name)
            platforms = mappedPlatforms
        }else{
            platforms = ["Unknown"]
        }
        

        const game = {
            id,
            game_name,
            slug,
            cover_art,
            summary,
            platforms,
            game_modes
        };

        dispatch(gotGame(game))
    };
}

const getAllGamesFromAPI = (limit, offset) => {
    return async function(dispatch) {
        const res = await axios.get(`http://localhost:3001/games`, {limit: limit, offset: offset});

        let gamesList = res.data.games

        dispatch(gotGames(gamesList))
    }
}

function gotGame(game) {
    return{type: LOAD_GAME, payload: game}
};

function gotGames(games){
    return {type: LOAD_ALL_GAMES, payload: games}
};

function resetGameState() {
    return {type: RESET_GAME}
};

export {getGameFromAPI, getAllGamesFromAPI, resetGameState};