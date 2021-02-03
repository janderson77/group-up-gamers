import React, {useEffect, useCallback, useState} from 'react';
import './css/GamesList.css';
import {useSelector, useDispatch} from 'react-redux';
import {getAllGamesFromAPI, resetGameState} from '../actions/games';
import {NavLink} from 'react-router-dom';
import {alphaOptions} from '../helpers/alphaOptions';
import SelectSearch from 'react-select-search';
import axios from 'axios';


const GamesList = () => {
    const BASE_URL = 'http://localhost:3001'
    const dispatch = useDispatch();

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
        placeholder="Search by name..."
        />
    }else{
        gamesSelect = null;
    };

    let gameDisplay;

    if(!game){
        gameDisplay = null;
    }else{
        gameDisplay = (
            <div className="card" >
            <img className="card-img-top" src={game.cover_art} alt={game.game_name} />
            <div className="card-body">
                <h5 className="card-title">{game.game_name}</h5>
                <p className="card-text">{game.summary}</p>
                <NavLink to={`/games/${game.slug}`} className="btn btn-primary btn-lg" 
                >Select This Game</NavLink>
            </div>
            </div>
        );
    };

    
    return(
        <div className="container">
            <div>
                <h2>Find a game here.</h2>
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
    
    // const initialize = useCallback(
    //     () => {
    //         dispatch(resetGameState())
    //     },
    //     [dispatch],
    // )

    // useEffect(() => {initialize(); }, [initialize])
    // const games = useSelector(st => st.games.games);
    
    // const missing = !games;

    // useEffect(function() {
    //     if(missing) {
    //         dispatch(getAllGamesFromAPI())
    //     }
    // }, [missing, dispatch])

    

    // if(missing) return <h1 className="mt-5">Loading...</h1>;
    // let gamesArr = Object.values(games)
    

    // return(
    //     <div className="container d-flex flex-column align-items-center">
    //         {gamesArr.map(e => (
    //             <div key={e.id}>
    //                 <NavLink to={`/games/${e.slug}`} >
    //                 <div className="card flex-row flex-wrap">
    //                     <div className="card-header border-0">
    //                         <img src={e.cover_art} alt="" />
    //                     </div>
    //                     <div className="card-block px-2">
    //                         <h4 className="card-title">{e.game_name}</h4>
    //                     </div>

    //                 </div>
    //                 </NavLink>
    //             </div>
                
    //         ))}
            
    //     </div>
    // )
};

export default GamesList;