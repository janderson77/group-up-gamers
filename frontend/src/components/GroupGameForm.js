import axios from 'axios'
import React, {useState, Fragment} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import SelectSearch from 'react-select-search'
import {setGroupGame} from '../actions/groups';
import {alphaOptions} from '../helpers/alphaOptions';
import Default from '../static/Default.png';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import gamesbg from '../static/gamesbg.jpg';
import NotLoggedIn from './NotLoggedIn'


const GroupGameForm = () => {
    const BASE_URL = 'http://localhost:3001'
    const dispatch = useDispatch();
    const history = useHistory();
    let [games, setGames] = useState([]);
    let [game, setGame] = useState();
    const user = useSelector(st => st.users.user)

    let gamesSelect;

    // Will display that the user must be logged in to see this. Backup in case protected route fails
    if(!user){
        return(
            <NotLoggedIn />
        )
    };

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

    // Will display some info about the selected game, or return null if no game is selected
    if(!game){
        gameDisplay = null;
    }else{
        gameDisplay = (
            <div className="card d-flex justify-content center align-items-center mt-5" >
            <img className="card-img-top" src={game.cover_art ? game.cover_art : Default} alt={game.game_name} />
            <div className="card-body">
                <h5 className="card-title">{game.game_name}</h5>
                <p className="card-text">{game.summary}</p>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} >Select This Game</button>
            </div>
            </div>
        );
    };

    // This is for the breadcrumbs
    let previous = [{title: "Groups"}]
    return(
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers || Game Select</title>
            </Helmet>
            <LayoutDefault className="template-color-1 template-font-1">
                <Breadcrumb
                        title="Game Select"
                        bg={gamesbg}
                        prev={previous}
                        stem="/groups"
                />
                <div id="group-game-form" className="container mt-5 pt-5 d-flex flex-column align-items-center ">
                    <h2>Select A Game</h2>
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
            </LayoutDefault>
        </Fragment>
    )
};

export default GroupGameForm;