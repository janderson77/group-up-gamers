import React, { useEffect, useCallback } from "react";
import {useSelector, useDispatch } from 'react-redux'
import './css/Profile.css'
import { NavLink, useParams, Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {getUser, resetVisitingState} from '../actions/users'

function Profile() {
    const loggedInUser = useSelector(st => st.users.user);
    const dispatch = useDispatch();

    const initialize = useCallback(
        () => {
            dispatch(resetVisitingState())
        },
        [dispatch],
    );

    useEffect(() => {initialize(); }, [initialize])

    const {id} = useParams();
    const user = useSelector(st => st.users.visiting[id])

    const missing = !user

    useEffect(() => {
        if(missing){
            dispatch(getUser(id));
        }
    }, [missing, id, dispatch])    

    if(missing){
        return <ClipLoader size={150} color="#123abc" />;
    }

    if(loggedInUser){
        if(loggedInUser.id === user.id){
            return <Redirect to="/profile"/>
        }
    }
        
    let userGames;
    
    user.games_playing ? userGames= Object.values(user.games_playing) : userGames= [];

    let gamesList;

    if(userGames.length > 0){
        gamesList = userGames.map(e => (
            <div key={e.slug}><NavLink to={`/games/${e.slug}`}>{e.game_name}</NavLink></div>
        ))
    }else{
        gamesList = <div>
            <div>{user.username} has not added any games yet.</div>
        </div>
    };

    let groups;

    if(user.groups.length){
        groups = user.groups.map(e => (
            <div key={e.group_id}>
                <NavLink to={`/groups/${e.group_id}`}>{e.group_name}</NavLink>
            </div>
        ))
    }else{
        groups = (
            <div>
            <p>{user.username} has not joined any groups</p>
            </div>
        )
    }

  return (
    <div>
        <div className="col-md-10 offset-md-1">
            <h3>{user.username}'s Profile</h3>
            <div className="d-flex">
            <div className="col-md-6">
                {user.profile_img_url ? <img alt={user.username} src={user.profile_img_url} /> : <img alt={user.username} src='../static/404.png'/>}
            </div>
            
            <div className="col-md-6 d-flex flex-column align-items-center">
                <div>
                    <h4>Groups</h4>
                    {groups}
                </div>
            </div>
            </div>
        </div>
        <div className="col-md-10 offset-md-1">
            <div className="d-flex">
            <div className="col-md-6">
                <h4>Games</h4>
                {gamesList}
            </div>
            <div className="col-md-6 d-flex flex-column align-items-center">
                <div>
                    
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}

    

export default Profile;
