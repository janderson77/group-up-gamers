import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import './css/Profile.css'
import { NavLink } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {removeGameFromList} from '../actions/users'

function Profile() {
  const user = useSelector(st => st.users.user)
  const dispatch = useDispatch();
  if(!user){
      return <ClipLoader size={150} color="#123abc" />;
  };

  let userGames;
  let userGroups;

  user.games_playing ? userGames = Object.values(user.games_playing) : userGames = {};
  user.groups ? userGroups = Object.values(user.groups) : userGroups = {};

  let gamesList;
  let groups;

  if(userGroups.length){
      groups = userGroups.map(e => (
          <div key={e.id}>
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

  let ownedGroups = [];
  user.owned_groups ? ownedGroups = Object.values(user.owned_groups) : ownedGroups = [] ;
  

  let ownedGroupsDisplay;

  if(ownedGroups.length){
    ownedGroupsDisplay =  ownedGroups.map(e => (
        <div key={e.id}>
            <NavLink to={`/groups/${e.id}`}>{e.group_name}</NavLink>
        </div>
    ))
  }else{
    ownedGroupsDisplay = (
        <div>
            <p>You haven't created any groups yet.</p>
            <p><NavLink to="/groups/select" >Go Make One!</NavLink></p>
        </div>
    )
  }

  const handleRemoveGame = (e) => {
    console.log(e.target.id)
    user.toRemove = e.target.id;
    dispatch(removeGameFromList(user, user.toRemove))
  }

  if(userGames.length > 0){
    gamesList = userGames.map(e => (
        <div key={e.slug}>
            <button className="btn btn-sm btn-danger" id={e.id} onClick={handleRemoveGame}>X</button>
            <NavLink to={`/games/${e.slug}`}>{e.game_name}</NavLink>
        </div>
    ))
}else{
    gamesList = <div>
        <div>No Games Added Yet</div>
        <div><NavLink to='/games'>Go Add Some!</NavLink></div>
    </div>
};




  return (
    // <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
    <div>
        <div className="col-md-10 offset-md-1 my-5">
            <h3>My Profile</h3>
            <div className="d-flex">
                <div className="col-md-6">
                    <div className="d-flex justify-content-center align-items-end">
                    {user.profile_img_url ? <img alt={user.username} src={user.profile_img_url} /> : <img alt={user.username} src='../static/404.png'/>}
                    <NavLink to="/profile/edit" className="btn btn-info btn-sm" style={{height: '2rem'}}>Edit Profile</NavLink>
                    </div>
                </div>
            
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <div>
                        <h4>My Groups</h4>
                        {groups}
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-10 offset-md-1 my-5 py-3">
            <div className="d-flex">
                <div className="col-md-6">
                    <h4>My Games</h4>
                    {gamesList}
                </div>

                <div className="col-md-6 d-flex flex-column align-items-center">
                    <div>
                        <h4>My Owned Groups</h4>
                        {ownedGroupsDisplay}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;
