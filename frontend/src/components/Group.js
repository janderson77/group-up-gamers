import React, {useEffect, useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavLink, useParams, useHistory} from 'react-router-dom';
import {getGroupFromApi, resetGroupsState, joinGroup, leaveGroup, createMessage, deleteMessage} from '../actions/groups' 
import "./css/Game.css"

const Group = () => {
    const history = useHistory();
    const user = useSelector(st => st.users.user)
    const FORM_INITIAL_STATE = {message: ""}
    const [messagePosting, setMessagePosting] = useState(false);
    const [formData, setFormData] = useState(FORM_INITIAL_STATE)
    

    let userGames;
    let userGroups;

    user.games_playing ? userGames = user.games_playing.data : userGames = [];
    user.groups ? userGroups = user.groups.data : userGroups = [];

    const dispatch = useDispatch();
    
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [resetGroupsState],
    )

    useEffect(() => {initialize(); }, [])

    const {id} = useParams();
    const group = useSelector(st => st.groups[id]);

    const missing = !group;

    useEffect(function() {
        if(missing) {
            dispatch(getGroupFromApi(id));
        }
    }, [missing, id, dispatch]);


    if(missing) return <h1 className="mt-5">Loading...</h1>;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(FORM_INITIAL_STATE)

        const data = {
            ...formData,
            user_id: user.id,
            username: user.username,
            group_id: group.id
        };
        dispatch(createMessage(data));
    };

    let messages;

    const handleDeleteMessage = (e) => {

        const deleteMessageData = {
            message_id: e.target.id,
            group_id: group.id
        };
        dispatch(deleteMessage(deleteMessageData))
    }
    

    if(group.messages.length){
        messages = group.messages.map(m => (
            <div className="card w-75 text-left" data-messageid={m.message_id} key={`message-${m.message_id}`}>
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">{m.message_username}</h6>
                    <div className="message-body d-flex justify-content-between">
                        <span className="card-text">{m.message_body}</span>
                        {user.id === m.message_user_id ? <button 
                            id={m.message_id}
                            className="btn btn-sm btn-danger"
                            onClick={handleDeleteMessage}
                        >X</button> : null}
                    </div>
                    
                </div>
            </div>
        ))
    }else{
        messages = (
            <div className="card w-75 text-left" key={`message-default`}>
                <div className="card-body">
                    <p className="card-text">No messages...</p>
                </div>
            </div>
        )
    };

    

    const addGroup = () => {
        dispatch(joinGroup(user.id, group.id))
    };

    const tryAddGroup = () => {
        try{
            addGroup();
        }catch(e){
            console.log(e)
        }
    };

    const doLeaveGroup = () => {
        dispatch(leaveGroup(user.id, group.id))
        history.push('/groups')
    };

    const tryLeaveGroup = () => {
        try{
            doLeaveGroup();
        }catch(e){
            console.log(e)
        }
    };

    let joinButton;
    let adminButton;

    if(user.owned_groups && user.owned_groups[group.id]){
        adminButton = (
            <div>
                <NavLink to={`/groups/${group.id}/admin`} className="btn btn-success btn-sm">Admin Page</NavLink>
            </div>
        )
    }else{
        adminButton = null;
    }


    if(user.groups){
        if(user.groups[group.id]){
            joinButton = (
                <div>
                    <div className="btn btn-secondary btn-sm" disabled>Joined</div>
                    <div className="btn btn-danger btn-sm" onClick={tryLeaveGroup}>Leave</div>
                </div>
                
            );
        }else{
            joinButton = (
                <div>
                    <div className="btn btn-success btn-sm" onClick={tryAddGroup}>Join!</div>
                </div>
            );
        };
      
    }else{
        joinButton = (
            <div>
                <div className="btn btn-success btn-sm" onClick={tryAddGroup}>Join!</div>
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
                    {adminButton ? adminButton: joinButton}
                </div>
                <div className="card-body d-flex justify-content-around">
                
                    <div id="group-info">
                        <h4>Group Info</h4>
                        <p className="card-text">Discord:</p>
                        <p className="card-text">{group.group_discord_url || "No Discord"}</p>
                    </div>
                    <div id="group-members">
                        <h4>Group Members</h4>
                        <ul className="list-group list-group-flush text-left">
                            {group.members.map(e => (
                                <div>
                                    <span>{e.user_id === group.group_owner_id ? <span>Owner / </span> : null}
                                    {e.is_group_admin ? <span>Admin </span> : null}</span>
                                    <NavLink to={`/users/${e.username}`} >{e.username}</NavLink>
                                </div>
                            ))}
                        </ul>
                    </div>
                    
                </div>
            </div>
            <div className="messages-area w-50 mt-5" >
                <h3>Messages</h3>
                <div>
                    <form className="form-inline pl-0 ml-0" onSubmit={handleSubmit}>
                        <div className="form-group mb-2 pl-0 col-12">
                            <div className="col-sm-10">
                                <input 
                                style={{width: "100%"}}
                                onChange={handleChange}
                                type="text" 
                                className="form-control" 
                                id="message" 
                                name="message"
                                aria-describedby="message" 
                                placeholder="Write a message..." 
                                value={formData.message}
                                required
                            />
                            </div>
                            <button className="btn btn-sm btn-primary">OK</button>
                        </div>
                        
                    </form>
                </div>
                <div>
                    <div className="messages w-100 d-flex flex-column align-items-center border border-dark">
                        {messages}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Group;