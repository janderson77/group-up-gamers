import React, {useState, Fragment} from 'react';
import {Helmet} from "react-helmet";
import {NavLink} from 'react-router-dom';
import {alphaOptions} from '../helpers/alphaOptions';
import SelectSearch from 'react-select-search';
import axios from 'axios';
import './css/GamesList.css';
import LayoutDefault from "../template/layouts/LayoutDefault";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import gamesbg from '../static/gamesbg.jpg'


const GamesList = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001"

    let [games, setGames] = useState([]);
    let [game, setGame] = useState();

    let gamesSelect;
    // Will find the selected game on the db and return it
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

    // Will collect the selected game from the db
    const handleGameSelect = async (e) => {
        try{
            setGame(null)
            let gameRes = await axios.get(`${BASE_URL}/games/${e}`)
            setGame(gameRes.data.game)
        }catch(e){
            console.error(e)
        }
        
    }

    // After the initial game data is loaded it is passed to the SelectSearch, which displays the list of games to be filtered through and one selected
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

    // Will display some info about the selected game, or return null if no game is selected
    if(!game){
        gameDisplay = null;
    }else{
        gameDisplay = (
            <div className="card d-flex flex-column align-items-center" >
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
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers | Games</title>
            </Helmet>
            <LayoutDefault className="template-color-1 template-font-1">
            <Breadcrumb
                    title="Games"
                    bg={gamesbg}
                />

            </LayoutDefault>
            <div id="main-cont" className="container mt-5 pt-5 d-flex flex-column align-items-center">
                <div>
                    <h2>Find a game</h2>
                    <SelectSearch
                        onChange={handleGameCheck}
                        options={alphaOptions}
                        search
                        placeholder="Start By Clicking Here."
                    />
                </div>
                <div>
                    {gamesSelect}
                </div>
                <div>
                    {gameDisplay}
                </div>
            </div>
        </Fragment>
    )
};

export default GamesList;