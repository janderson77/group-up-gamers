import React, { useContext } from "react";
import UserContext from "../UserContext";
import './css/Profile.css'
import { NavLink } from "react-router-dom";

function Profile() {
  const { currentUser } = useContext(UserContext);

  const user = currentUser.data.user;
  const userGames = user.games_playing.data

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
  }

  console.log(user)
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
                    {user.groups.length > 0 ?
                    user.groups.map(e => <div>{e.group_id}</div>) : <div><p>No Groups Joined</p><p><NavLink to="/groups">Join one now!</NavLink></p></div>}
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
