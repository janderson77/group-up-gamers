import React, {useEffect, useCallback, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavLink, useParams, useHistory} from 'react-router-dom';
import {getGroupFromApi, resetGroupsState, deleteMessage, updateGroup, kickMember} from '../actions/groups';
import Alert from "./Alert";

const MESSAGE_SHOW_PERIOD_IN_MSEC = '3000'

const GroupAdmin = () => {
    const dispatch = useDispatch();
    const user = useSelector(st => st.users.user)

    const {id} = useParams();
    const group = useSelector(st => st.groups[id]);
    
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [resetGroupsState],
    );

    useEffect(() => {initialize(); }, [])

    const missing = !group;

    useEffect(function() {
        if(missing) {
            dispatch(getGroupFromApi(id));
        }
    }, [missing, id, dispatch]);

    const [groupForm, setGroupForm] = useState({
        errors: [],
        saveConfirmed: false,
        hasErrors: false
    })

    const [deleteShown, toggleDeleteShown] = useState(false);
    const [toDeletePass, setToDeletePass] = useState({
        password: ""
    })

    useEffect(() => {
        if(!missing){
            setGroupForm({
                group_name: group.group_name,
                group_discord_url: group.group_discord_url,
                group_logo_url: group.group_logo_url,
                errors: [],
                saveConfirmed: false,
                hasErrors: false
            })
        }
        
    }, [missing])

    useEffect(
        function() {
        if (groupForm.saveConfirmed && !messageShownRef.current) {
            messageShownRef.current = true;
            setTimeout(function() {
            setGroupForm(f => ({ ...f, saveConfirmed: false }));
            messageShownRef.current = false;
            }, MESSAGE_SHOW_PERIOD_IN_MSEC);
        }
        },
        [groupForm]
    );

    useEffect(
        function() {
        if (groupForm.hasErrors && !messageShownRef.current) {
            messageShownRef.current = true;
            setTimeout(function() {
            setGroupForm(f => ({ ...f, hasErrors: false, errors: [] }));
            messageShownRef.current = false;
            }, MESSAGE_SHOW_PERIOD_IN_MSEC);
        }
        },
        [groupForm]
    );

    const messageShownRef = useRef(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setGroupForm(f => ({
          ...f,
          [name]: value,
          errors: []
        }));
      };
    
    const handleGroupEditSubmit = (e) => {
        e.preventDefault();
        console.log(groupForm)
        let groupData = {
            id: group.id,
            group_name: groupForm.group_name,
            group_discord_url: groupForm.group_discord_url,
            group_logo_url: groupForm.group_logo_url
        };
        dispatch(updateGroup(groupData))
    };

    const handleDeletePassChange = (e) => {
        const { name, value } = e.target;
        setToDeletePass(f => ({
            ...f,
            [name]: value,
            errors: []
        }));
    };

    const toggleDelete = () => {
        toggleDeleteShown(!deleteShown);
      };

    const handleDelete = async (e) => {
        e.preventDefault();
        // const toDelete = {
        //   id: user.id,
        //   username: user.username,
        //   password: toDeletePass.password,
        //   _token: user._token
        // };
      
        // try{
        //   const res = await axios.delete(`http://localhost:3001/users/${user.id}`,{data: toDelete});
    
        //   if(res.status === 200){
        //     history.push('/deleted');
        //     dispatch(deleteProfile());
        //   }
        // }catch(errors){
        //   setUserForm(f => ({ ...f, errors }));
        // }
      };

    const handleDeleteMessage = (e) => {
        const deleteMessageData = {
            message_id: e.target.id,
            group_id: group.id
        };
        dispatch(deleteMessage(deleteMessageData))
    }

    if(missing) return <h1 className="mt-5">Loading...</h1>;

    let messages;

    if(group.messages.length){
        messages = group.messages.map(m => (
            <div className="card text-left" data-messageid={m.message_id} key={`message-${m.message_id}`}>
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">{m.message_username}</h6>
                    <div className="message-body d-flex justify-content-between">
                        <span className="card-text">{m.message_body}</span>
                        <button 
                            id={m.message_id}
                            className="btn btn-sm btn-danger"
                            onClick={handleDeleteMessage}
                        >X</button>
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

    let members;

    const handleKickMember = (e) => {
        dispatch(kickMember(group.id, e.target.getAttribute('data-userid')))
    }

    if(group.members.length){
        members = group.members.map(m => (
            <div className="card text-left" data-userid={m.user_id} key={`member-${m.user_id}`}>
                <div className="card-body">
                    
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="card-subtitle mb-2 text-muted">{m.username}</h6>
                        </div>
                        <div>
                            {m.user_id === group.group_owner_id ? <span>Owner / </span> : null}
                            {m.is_group_admin ? <span>Admin</span> : <p>Member</p>}
                        </div>
                        <div>
                            {m.user_id === user.id ? 
                            <>
                                <button className="btn btn-primary" disabled>You</button>
                            </> :
                                
                                <>
                                <button 
                                data-userid={m.user_id}
                                className="btn btn-sm btn-warning"
                                onClick={handleKickMember}
                                >Kick</button>
                                <button 
                                    data-userid={m.user_id}
                                    className="btn btn-sm btn-danger"
                                    // onClick={handleDeleteMessage}
                                >Ban</button>
                            </>
                            }
                            
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        ))
    };

    

    return(
        <>
        <div className="m-3">
            <h3><NavLink to={`/groups/${group.id}`}>{group.group_name}</NavLink> Admin Page</h3>
            <h6>Here you can edit your group, kick or ban users, and delete unwanted messages.</h6>
        </div>

        <div className="d-flex flex-row">
        <div className="col-md-6 d-flex flex-column align-items-center">
        
        <div className="card" id="edit-group-area">
            <div className="card-body">
            <form>
                <div className="form-group">
                <label>Group Name</label>
                <input
                    name="group_name"
                    className="form-control"
                    value={groupForm.group_name}
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label>Discord URL</label>
                <input
                    name="group_discord_url"
                    className="form-control"
                    value={groupForm.group_discord_url}
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label>Logo URL</label>
                <input
                    name="group_logo_url"
                    className="form-control"
                    value={groupForm.group_logo_url}
                    onChange={handleChange}
                />
                </div>

                {groupForm.errors.length ? (
                <Alert type="danger" messages={groupForm.errors} />
                ) : null}

                {groupForm.saveConfirmed ? (
                <Alert type="success" messages={["User updated successfully."]} />
                ) : null}

                <button
                className="btn btn-primary btn-block mt-4"
                onClick={handleGroupEditSubmit}
                >
                Save Changes
                </button>
            </form>
            </div>
        </div>

        <h4>Delete Group</h4>
        <h6 className="text-danger">**This Cannot Be Undone**</h6>
        <div className="card">
            <div className="card-body">
            <form>
                {deleteShown ? (
                <>
                <div className="form-group">
                    <label>
                    <p>
                        Confirm password to permanently delete this group:
                    </p>
                    
                    <p className="text-danger">
                        REMINDER: This cannot be undone!
                    </p>
                    </label>
                    <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={toDeletePass.password}
                    onChange={handleDeletePassChange}
                    />
                </div>

                <button
                className="btn btn-primary btn-block mt-4"
                onClick={handleDelete}
                >
                Delete Profile
                </button>
                <button className="btn btn-danger btn-block mt-4" onClick={toggleDelete} >
                    Cancel
                </button>
                </>
                ) : (
                <button
                    className="btn btn-primary btn-block mt-4"
                    onClick={toggleDelete}
                >
                    Delete Profile
                </button>
                )}            
            </form>
            </div>
            </div>
        </div>

        <div className="col-md-6 d-flex flex-column align-items-center">
            <div id="group-users">
                <div className="mb-5">
                    <h5>Group Members</h5>
                    {members}
                </div>
            </div>
            <div id="group-messages">
                <h5>Messages</h5>
                {messages}
            </div>
        </div>

        </div>

        </>
    )

};

export default GroupAdmin;