import axios from 'axios'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import SelectSearch from 'react-select-search'
import {setGroupGame} from '../actions/groups';
import {alphaOptions} from '../helpers/alphaOptions';


const GroupGameForm = () => {
    const BASE_URL = 'http://localhost:3001'
    const dispatch = useDispatch();
    const history = useHistory();
    let [games, setGames] = useState([]);
    let [game, setGame] = useState();

    let gamesSelect;

    const handleGameCheck = async (str) => {
        try{
            setGames([])
            const res = await axios.post(`${BASE_URL}/games/search`, {search: `${str}`});

            if(res.status === 200){
                setGames([...res.data[0]])
            };
        }catch(e){
            console.error(e)
        };
    };

    const handleGameSelect = async (e) => {
        try{
            setGame(null)
            let gameRes = await axios.get(`${BASE_URL}/games/${e}`)
            setGame(gameRes.data.game)
        }catch(e){
            console.error(e)
        }
        
    }

    if(games.length){
        let gamesList = games.map(e =>({name: e.game_name, value: e.slug}))
        gamesSelect = <SelectSearch
        options={gamesList}
        onChange={handleGameSelect}
        search
        placeholder="Select your Game"
        />
    }else{
        gamesSelect = null;
    };

    let gameDisplay;

    const handleSubmit = (e) => {
        dispatch(setGroupGame(game));
        history.push("/groups/create")
    }

    if(!game){
        gameDisplay = null;
    }else{
        gameDisplay = (
            <div className="card" >
            <img className="card-img-top" src={game.cover_art} alt={game.game_name} />
            <div className="card-body">
                <h5 className="card-title">{game.game_name}</h5>
                <p className="card-text">{game.summary}</p>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} >Select This Game</button>
            </div>
            </div>
        );
    };

    
    return(
        <div className="container">
            <div>
                <SelectSearch
                    onChange={handleGameCheck}
                    options={alphaOptions}
                    search
                    placeholder="Start Here."
                />
            </div>
            <div>
                {gamesSelect}
            </div>
            <div>
                {gameDisplay}
            </div>
        </div>
    )
};

export default GroupGameForm;