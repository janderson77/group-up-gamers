import React, {useEffect, useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {getGameFromAPI, resetGameState} from '../actions/games'
import {addGameToList, removeGameFromList} from '../actions/users'
import "./css/Game.css"

const Game = () => {
    const dispatch = useDispatch();
    const user = useSelector(st => st.users.user)
    const [ignView, toggleIgnView] = useState(false);
    const INITIAL_STATE = {in_game_name: ""}
    const [formData, setFormData] = useState(INITIAL_STATE)

    const initialize = useCallback(
        () => {
            dispatch(resetGameState())
        },
        [dispatch],
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

    const handleToggleIgnView = () => {
        toggleIgnView(!ignView);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    if(missing) return <h1 className="mt-5">Loading...</h1>;

    let gameModes = game.game_modes;
    let gamePlatforms = game.platforms;

    const AddGame = () => {
        handleToggleIgnView();
        dispatch(addGameToList(user.id, game.id, user._token, formData.in_game_name))
    };

    const handleRemoveGame = (e) => {
        user.toRemove = e.target.id;
        dispatch(removeGameFromList(user, user.toRemove, user._token))
    };    

    const tryAddGame = (e) => {
        e.preventDefault();
        try{
            AddGame();
        }catch(e){
            console.log(e)
            return
        }
    }

    let button;
    let notAddedButton = <button onClick={handleToggleIgnView} className="btn btn-small btn-success">Add Game</button>

    if(user.games_playing){
        if(user.games_playing[game.id]){
            button = (
            <>
            <button className="btn btn-small btn-info" disabled>Added</button>
            <button id={game.id} className="btn btn-small btn-danger" onClick={handleRemoveGame}>Remove</button>
            </>
            )
        }else{
            button = notAddedButton
        }
    }else{
        button = notAddedButton
    };

    let ignInput;

    if(ignView){
        ignInput = (
            <div>
                <form onSubmit={tryAddGame}>
                    <div className="form-group">
                        <label>In Game Name (optional)</label>
                        <input
                            name="in_game_name"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn btn-small btn-success">Add Game</button>
                </form>
                <button className="btn btn-small btn-danger" onClick={handleToggleIgnView}>Cancel</button>
            </div>
        )
    }else{
        ignInput = button;
    }
    
    

    return(
        <div className="d-flex flex-column align-items-center">
           <h1>{game.game_name}</h1>

            <div className="card w-50">
                <img className="card-img-top" src={game.cover_art} alt={game.game_name}></img>
                <div className="card-body">
                    <p className="card-text">{game.summary}</p><br/>
                    {ignInput}
                    <ul className="list-group list-group-flush text-left">
                        <li key="game-modes" className="list-group-item">Game Modes
                            <ul>
                                {gameModes.map(e => <li key={e}>{e}</li>)}
                            </ul>
                        </li>
                        
                        <li className="list-group-item">Platforms
                            <ul>
                                {gamePlatforms.map(e => <li key={e}>{e}</li>)}
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Game;