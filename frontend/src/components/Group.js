import React, {useEffect, useCallback, useState, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavLink, useParams, useHistory} from 'react-router-dom';
import {getGroupFromApi, resetGroupsState, joinGroup, leaveGroup, createMessage, deleteMessage, joinGroupAndAddGame} from '../actions/groups' 
import Default from '../static/Default.png';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import {Col, Container, Row} from "react-bootstrap";
import Thumbnail from "../template/components/about-us/thumbnail/AboutThumbOne";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import groupsbg from '../static/groupsbg.jpg';
import './css/Group.css';
import SidebarItem from '../template/container/sidebar/elements/SidebarItem';
import NotLoggedIn from './NotLoggedIn'


const Group = () => {
    const history = useHistory();
    const user = useSelector(st => st.users.user)
    const FORM_INITIAL_STATE = {message: ""}
    const IGN_INITIAL_STATE = {in_game_name: ""}
    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    const [ignDisplay, toggleIgnDisplay] = useState(false);
    const [ignData, setIgnData] = useState(IGN_INITIAL_STATE);
    const dispatch = useDispatch();

    const handleIgnToggle = () => {
        toggleIgnDisplay(!ignDisplay)
    }
    
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [dispatch],
    )

    useEffect(() => {initialize(); }, [initialize])

    const {id} = useParams();
    const group = useSelector(st => st.groups[id]);

    const missing = !group;

    useEffect(function() {
        if(missing) {
            dispatch(getGroupFromApi(id));
        }
    }, [missing, id, dispatch]);


    if(missing) return <h1 className="mt-5">Loading...</h1>;
    if(!user){
        return(
            <NotLoggedIn />
        )
    };
    if(user.groups){
        if(user.groups[id] && user.groups[id].is_banned) return (
            <div className="mt-5">
                <h2>You Have Been Banned From This Group.</h2>
                <h4>You can find another group to join.</h4>
                <NavLink to='/groups'>Back to groups search.</NavLink>
            </div>
            )
    }
    

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleIgnChange = (e) => {
        const {name, value} = e.target;
        setIgnData(formData => ({
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

    let messageArea;

    if(user.groups && user.groups[id]){
        messageArea = (
            <>
            <div>
                <form 
                id="message-form"
                className="form-inline pl-0 ml-0" 
                onSubmit={handleSubmit}>
                    <div id="message-form-group" className="form-group mb-2 pl-0 d-flex flex-row flex-nowrap">
                        <div id="form-input-wrapper">
                            <input 
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
            </>
        )
    }else{
        messageArea = (
            <>
            <h5>You must be in the group to see or post messages.</h5>
            </>
        )
    }

    const addGroup = () => {
        dispatch(joinGroup(user.id, group.id))
        initialize();
    };

    const tryAddGroup = () => {
        try{
            addGroup();
        }catch(e){
            console.log(e)
        }
    };

    const addGroupAndGame = () => {
        let data = {
            ...ignData,
            user_id: user.id,
            game_id: group.game_id,
            _token: user._token,
            group_id: group.id,
            username: user.username
        }
        
        dispatch(joinGroupAndAddGame(data))
        history.push('/profile')
        
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

    let ignArea;

    if(ignDisplay){
        ignArea = <>
            <input name="in_game_name" className="form-control" onChange={handleIgnChange} placeholder="In Game Name" />
            <div className="btn btn-success btn-sm" onClick={addGroupAndGame}>Join!</div>
            <div className="btn btn-danger btn-sm" onClick={handleIgnToggle}>Cancel</div>

        </>
    }else{
        ignArea = <div>
        <div className="btn btn-success btn-sm" onClick={handleIgnToggle}>Join!</div>
    </div>
    }


    if(user.groups){
        if(!user.games_playing){
            joinButton = (
                <div>
                    {ignArea}
                </div>
                
            );
        }
        else if(!user.groups[group.id] && !user.games_playing[group.game_id]){
            joinButton = (
                <div>
                    {ignArea}
                </div>
                
            );
        }else if(user.groups[group.id]){
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
        if(!user.games_playing){
                joinButton = (
                    <div>
                        {ignArea}
                    </div>
                )
        }else if(!user.games_playing[group.game_id]){
            joinButton = (
                <div>
                    {ignArea}
                </div>
            )
        }else{
            joinButton = (
                <div>
                    <div className="btn btn-success btn-sm" onClick={tryAddGroup}>Join!</div>
                </div>
            )
        }
        
    }

    let owner_info = group.members.filter(e => e.user_id === group.group_owner_id)

    let admins = group.members.filter(e => e.is_group_admin === true && e.id !== group.group_owner_id)

    let previous = [{title: 'Groups'}]
    return(
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers || {group.group_name}</title>
            </Helmet>
            <Breadcrumb
                    title={group.group_name}
                    bg={groupsbg}
                    prev={previous}
                    stem="groups"
                />
        <LayoutDefault className="template-color-1 template-font-1">
        <div className="brook-blog-details-area bg_color--1 pt--90 pb--150">
            <Container>
                <Row>
                    <Col lg={8}>
                        <div className="blog-details-wrapper wow move-up">
                            <article className="blog-post standard-post wow move-up">
                                <header className="header mb--40 text-center">
                                    <h3 className="heading heading-h3 font-32 wow move-up">
                                        {group.group_name}
                                    </h3>
                                    <div className="post-meta mt--20 wow move-up">
                                        <div className="post-date ">Game</div>
                                        <div className="post-category">
                                            <NavLink to={`/games/${group.game_slug}`}>{group.game_name}</NavLink>
                                        </div>
                                    </div>
                                </header>
                                <div className="group-info d-flex justify-content-around wow move-up">
                                    <div className="group-info-img wow move-up">
                                        <Thumbnail thumb={group.group_logo_url ? group.group_logo_url: Default} className="mb--60"/>
                                    </div>
                                    <div className="group-info-info wow move-up">
                                        <div className="group-info-discord wow move-up">
                                            <div className="card-text"><span className="bold">Discord: </span></div>
                                                {user.groups && user.groups[group.id] ? 
                                                    <p className="card-text">{group.group_discord_url || "No Discord"}</p>
                                                    : 
                                                    <p className="card-text">You must be in the group to see this.</p>
                                                }
                                        </div>
                                        <div className="group-info-admins wow move-up">
                                            <div className='mt-2'>
                                                <div>
                                                    <span className="bold">Owner:</span>
                                                </div> 
                                                <NavLink to={`/users/${owner_info[0].id}`}>{owner_info[0].username}</NavLink></div>

                                            
                                        </div>
                                        <div className="mt-4">
                                        {adminButton ? adminButton: joinButton}
                                        </div>
                                    </div>
                                </div>
                                <section className="content basic-dark2-line-1px pb--50 mb--35 mt--50">
                                    <div className="d-flex flex-column justify-content-center">
                                        <h3>Messages</h3>
                                        {messageArea}
                                    </div>
                                
                                </section>
                            </article>
                        </div>
                    </Col>

                    
                    <Col lg={4} className="mt_md--60 mt_sm--60">
                        <div className="blog-sidebar-container">
                            <div className="blog-sidebar-wrapper">
                            <SidebarItem
                                    title="Admins"
                                    className="category mt--10"
                                >
                                    <div className="inner">
                                        <ul className="category-list">
                                            {admins.length ? 
                                                admins.map(e => (
                                                    <div key={`admin-${e.id}`}>
                                                        <NavLink to={`/users/${e.id}`}>{e.username}</NavLink>
                                                    </div>
                                                    
                                                ))
                                            : <div key="no-admins">No Admins. See Group Owner</div>}
                                            
                                        </ul>
                                    </div>
                                </SidebarItem>
                                <SidebarItem
                                    title="Members"
                                    className="category mt--30"
                                >
                                    <div className="inner">
                                        <ul className="category-list">
                                            {group.members.map((e) => (
                                                <li key={e.user_id}>
                                                    
                                                    <NavLink to={`/users/${e.id}`} ><span>{e.user_id === group.group_owner_id ? <span>Owner/</span> : null}
                                                    {e.is_group_admin ? <span>Admin </span> : null}</span>{e.username}</NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </SidebarItem>

                            </div>
                        </div>
                    </Col>
                    
                </Row>
            </Container>
        </div>
        </LayoutDefault>
        </Fragment>
    )
}

export default Group;