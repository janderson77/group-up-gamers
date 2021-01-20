import React, {useEffect, useCallback, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavLink, useParams} from 'react-router-dom';
import {getGroupFromApi, resetGroupsState} from '../actions/groups' 
import "./css/Game.css"

const Group = () => {
    const user = useSelector(st => st.users.user)

    const userGames = user.games_playing.data
    const userGroups = user.groups.data;

    const dispatch = useDispatch();
    
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [resetGroupsState],
    )

    useEffect(() => {initialize(); }, [initialize])

    const {id} = useParams();
    const group = useSelector(st => st.groups[id]);
    
    const missing = !group;

    console.log(group)

    useEffect(function() {
        if(missing) {
            dispatch(getGroupFromApi(id));
        }
    }, [missing, id, dispatch]);


    if(missing) return <h1 className="mt-5">Loading...</h1>;

    let joinButton;
    if(user){
      joinButton = (
          <div>
              <div className="btn btn-secondary btn-sm" disabled>Joined</div>
              <div className="btn btn-danger btn-sm">Leave</div>
          </div>
          
      )
    }else{
        joinButton = (
            <div>
                <div className="btn btn-success btn-sm" disabled>Join!</div>
            </div>
        )
    }

    return(
        <div className="d-flex flex-column align-items-center">
            <div className="card w-50">
                <div className="d-flex justify-content-around">
                <img className="card-img-top" src={group.group_logo_url} alt={group.group_name}></img>
                <h1>{group.group_name}</h1>
                </div>
                <div className="justify-self-start">
                    {joinButton}
                </div>
                <div className="card-body d-flex justify-content-around">
                
                    <div id="group-info">
                        <h4>Group Info</h4>
                        <p className="card-text">Discord:</p>
                        <p className="card-text">{group.group_discord_url || "No Discord"}</p>
                    </div>
                    <div id="group-members">
                        <h4>Group Members</h4>
                        <ul class="list-group list-group-flush text-left">
                            {group.members.map(e => (
                                <div><NavLink to={`/users/${e.username}`} >{e.username}</NavLink></div>
                            ))}
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Group;