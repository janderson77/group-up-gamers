import React, { useState, useCallback } from "react";
import {useSelector } from 'react-redux'
import './css/Profile.css'
import { NavLink } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function Profile() {
  const user = useSelector(st => st.users.user)
  if(!user){
      return <ClipLoader size={150} color="#123abc" />;
  };

  const userGames = user.games_playing || [];
  const userGroups = user.groups || [];

  let gamesList;

  if(userGames.length > 0){
      gamesList = userGames.map(e => (
          <div key={e.slug}><NavLink to={`/games/${e.slug}`}>{e.game_name}</NavLink></div>
      ))
  }else{
      gamesList = <div>
          <div>No Games Added Yet</div>
          <div><NavLink to='/games'>Go Add Some!</NavLink></div>
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
          <p>You have not joined any groups</p>
          <p><NavLink to="/groups">Join One Now!</NavLink></p>
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
