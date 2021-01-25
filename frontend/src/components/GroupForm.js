import axios from 'axios'
import React, {useState, useCallback, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {createGroup} from '../actions/groups'

const GroupForm = () => {
    const user = useSelector(st => st.users.user)
    const game = useSelector(st => st.groups.group_game)
    const dispatch = useDispatch();
    const history = useHistory();
    const BASE_URL = 'http://localhost:3001'

    

    const FORM_INITIAL_STATE = {
        group_name: "",
        group_slug: "",
        group_game_id: game.id,
        group_owner_id: user.id,
        group_discord_url: "",
        group_logo_url: ""
    };

    let [formData, setFormData] = useState(FORM_INITIAL_STATE);
    let [isLoading, setIsLoading] = useState(false);
    let [gamesLoaded, setGamesLoaded] = useState(false);
    let [games, setGames] = useState([])
    

    const getGames = useCallback(async () => {
        try{
            const res = await axios.get(`${BASE_URL}/games/min`)
            if(res.status === 200){
                setGamesLoaded(true);
                return setGames(res.data[0])
            };
        }catch(e){
            console.error(e)
        };
    },[gamesLoaded])

    useEffect(() => {
        getGames() }, [])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    let gamesList

    if(!games.length){
        gamesList = <option value="Loading..." />
    }else{
        gamesList = games.map(e => (
            <option key={e.id} name={e.id} value={e.game_name} />
        ))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {...formData}
        let slug = data.group_name;
        slug = slug.toLowerCase();
        slug = slug.split(" ")
        slug = slug.join("-")
        data.group_slug = slug
        dispatch(createGroup(data))
    }

    const handleCancel = (e) => {
        e.preventDefault();
        history.push('/profile');
    }

    let gameDisplay;

    if(!game){
        gameDisplay = null;
    }else{
        gameDisplay = (
            <div className="card d-flex align-items-center" >
            <img className="card-img-top" src={game.cover_art} alt="Card image cap" />
            <div className="card-body">
                <h5 className="card-title">{game.game_name}</h5>
            </div>
            </div>
        );
    };

    return(
        <>
        <div className='container d-flex justify-content-center align-items-center'>
            {gameDisplay}
        </div>
        <div className='container GroupForm'>
            
            <form className="GroupForm-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Group Name</label>
                    <input 
                        name="group_name"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Discord URL</label>
                    <input 
                        name="group_discord_url"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Logo URL</label>
                    <input 
                        name="group_logo_url"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>

                <button className="btn btn-info btn-lg" type="submit">Submit</button>
                <button className="btn btn-danger btn-lg" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
        </>
    );

}

export default GroupForm;