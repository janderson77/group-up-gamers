import React, { useState, useEffect } from "react";
import {useSelector, useDispatch } from 'react-redux'
import './css/Profile.css'
import { NavLink, useParams, useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {getUser} from '../actions/users'

function Profile() {
    const loggedInUser = useSelector(st => st.users.user);
    const history = useHistory();
    const params = useParams();
    
    if(loggedInUser){
        if(loggedInUser.id === params.id){
            history.push('/profile')
        }
    }
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getUser(params.id))
    }, [params.id])

  const user = useSelector(st => st.users.visiting.user)
  if(!user){
      return <ClipLoader size={150} color="#123abc" />;
  };

  let userGames;
  let userGroups;
  
  user.games_playing ? userGames= Object.values(user.games_playing) : userGames= [];
  user.userGroups ? userGroups = user.groups : userGroups = [];

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

  if(userGroups.length){
      groups = userGroups.map(e => (
          <div>
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
    // <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
    <div>
        <div className="col-md-10 offset-md-1">
            <h3>Profile</h3>
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
