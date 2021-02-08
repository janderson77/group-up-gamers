import React, {useState, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {createGroup} from '../actions/groups';
import {addGameToList} from '../actions/users';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import gamesbg from '../static/gamesbg.jpg';
import NotLoggedIn from './NotLoggedIn'

const GroupForm = () => {
    const user = useSelector(st => st.users.user)
    const game = useSelector(st => st.groups.group_game)
    const dispatch = useDispatch();
    const history = useHistory();

    


    let FORM_INITIAL_STATE = {
        group_name: "",
        group_slug: "",
        group_game_id: game.id,
        group_owner_id: user.id,
        group_discord_url: "",
        group_logo_url: ""
    };

    if(!user.games_playing[game.id]){
        FORM_INITIAL_STATE.in_game_name = ""
    }

    let [formData, setFormData] = useState(FORM_INITIAL_STATE);

    if(!user){
        <NotLoggedIn />
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.hasOwnProperty('in_game_name')){
            dispatch(addGameToList(user.id, game.id, user._token, formData.in_game_name || undefined))
        };
        let data = {...formData}
        let slug = data.group_name;
        slug = slug.toLowerCase();
        slug = slug.split(" ")
        slug = slug.join("-")
        data.group_slug = slug
        dispatch(createGroup(data))
        history.push('/profile')
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
            <img className="card-img-top" src={game.cover_art} alt={game.game_name} />
            <div className="card-body">
                <h5 className="card-title">{game.game_name}</h5>
            </div>
            </div>
        );
    };

    const create =
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

    const createAndAddGameToPlaying = 
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
                <div className="form-group">
                    <label>In Game Name</label>
                    <input 
                        name="in_game_name"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Optional"
                    />
                </div>

                <button className="btn btn-info btn-lg" type="submit">Submit</button>
                <button className="btn btn-danger btn-lg" onClick={handleCancel}>Cancel</button>
            </form>
    let previous = [{title: "Groups"}, {title: "Select"}]
    return(
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers || Group Form</title>
            </Helmet>
            <Breadcrumb
                        title="Game Select"
                        bg={gamesbg}
                        prev={previous}
                        stem="/groups"
                />
            <LayoutDefault className="template-color-1 template-font-1 mb--40">
            <div className='container d-flex justify-content-center align-items-center mt-5 mb-5 pt-5'>
                {gameDisplay}
            </div>
            <div className='container GroupForm'>
                {user.games_playing[game.id] ? create : createAndAddGameToPlaying}
            </div>
            </LayoutDefault>
        </Fragment>
    );

}

export default GroupForm;