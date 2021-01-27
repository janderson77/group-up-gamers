import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import {getGameFromAPI, resetGameState} from '../actions/games'
import {addGameToList} from '../actions/users'
import "./css/Game.css"

const Game = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(st => st.users.user)

    const initialize = useCallback(
        () => {
            dispatch(resetGameState())
        },
        [resetGameState],
    )

    useEffect(() => {initialize(); }, [initialize])

    const {slug} = useParams();
    const game = useSelector(st => st.games[slug]);

    const missing = !game;

    useEffect(function() {
        if(missing) {
            dispatch(getGameFromAPI(slug));
        }
    }, [missing, slug, dispatch]);


    if(missing) return <h1 className="mt-5">Loading...</h1>;

    let gameModes = game.game_modes;
    let gamePlatforms = game.platforms;

    const AddGame = () => {
        dispatch(addGameToList(user.id, game.id))
    }

    const tryAddGame = () => {
        try{
            AddGame();
        }catch(e){
            console.log(e)
            return
        }
        // history.push("/profile")
    }

    let button;
    let notAddedButton = <button onClick={tryAddGame} className="btn btn-small btn-success">Add Game</button>

    if(user.games_playing){
        if(user.games_playing[game.id]){
            button = <button className="btn btn-small btn-info" disabled>Added</button>
        }else{
            button = notAddedButton
        }
    }else{
        button = notAddedButton
    };
    
    

    return(
        <div className="d-flex flex-column align-items-center">
           <h1>{game.game_name}</h1>

            <div className="card w-50">
                <img className="card-img-top" src={game.cover_art} alt={game.game_name}></img>
                <div className="card-body">
                    <p className="card-text">{game.summary}</p><br/>
                    {button}
                    <ul class="list-group list-group-flush text-left">
                        <li key="game-modes" class="list-group-item">Game Modes
                            <ul>
                                {gameModes.map(e => <li key={e.id}>{e}</li>)}
                            </ul>
                        </li>
                        
                        <li class="list-group-item">Platforms
                            <ul>
                                {gamePlatforms.map(e => <li key={e.id}>{e}</li>)}
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Game;