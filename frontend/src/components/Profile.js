import React, {Fragment} from "react";
import {useSelector, useDispatch} from 'react-redux'
import './css/Profile.css'
import { NavLink } from "react-router-dom";
import {removeGameFromList} from '../actions/users'
import Default from '../static/Default.png';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import {Col, Container, Row} from "react-bootstrap";
import Thumbnail from "../template/components/about-us/thumbnail/AboutThumbOne";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import profilebg from '../static/profilebg.jpg';
import './css/Group.css';
import SidebarItem from '../template/container/sidebar/elements/SidebarItem';
import ClipLoader from 'react-spinners/ClipLoader'

function Profile() {
    const user = useSelector(st => st.users.user)
    const dispatch = useDispatch();

    let userGames;
    let userGroups;

    // Will display that a loading screen indicating that the user is being logged in. Also acts as an additional barrier to entry
    if(!user){
    return(
        <Fragment>
            <LayoutDefault>
                <div className="mt-5 pt-5">
                    <h2>Logging You In!</h2>
                    <h5>This may take a moment...</h5>
                    <ClipLoader />
                </div>
            </LayoutDefault>
        </Fragment>
        
    )
    };

    // Builds the list of games the user is playing
    user.games_playing ? userGames = Object.values(user.games_playing) : userGames = {};
    // Builds the list of groups the user is in, but also filters out the groups the user has been banned from
    user.groups ? userGroups = Object.values(user.groups).filter(b => b.is_banned !== true) : userGroups = {};

    let gamesList;
    let groups;

    // Builds the elements to be used in the users groups section, or sets it to a default value
    if(userGroups.length){
        groups = userGroups.map(e => (
            <li key={e.id} className="border-bottom p-1">
                <div>
                    <NavLink to={`/groups/${e.group_id}`}>{e.group_name}</NavLink>
                </div>
            </li>
        ))
    }else{
        groups = (
        <li className="border-bottom p-1">
            <div>
                <div>You have not joined any groups</div>
                <div><NavLink to="/groups">Join One Now!</NavLink></div>
            </div>
        </li>
        )
    }

    let ownedGroups = [];
    // Builds the list of groups the user owns and manages
    user.owned_groups ? ownedGroups = Object.values(user.owned_groups) : ownedGroups = [] ;


    let ownedGroupsDisplay;

    // Builds the owned groups list into usable elements, or sets to a default value
    if(ownedGroups.length){
    let myOwnedGroups =  ownedGroups.map(e => (
        <li key={e.id} className="border-bottom p-1">
            <div >
                <NavLink to={`/groups/${e.id}/admin`}>{e.group_name}</NavLink>
            </div>
            
        </li>
    ))
    ownedGroupsDisplay = (
        <div>
            <div className="border-bottom p-1">
                <div>{myOwnedGroups}</div>
                <div className="mt-5 bold"><NavLink to={'/groups/select'} >Make another!</NavLink></div>
            </div>
        </div>
    )
    }else{
    ownedGroupsDisplay = (
        <div>
            <div className="border-bottom p-1">
                <div>You haven't created any groups yet.</div>
                <div className='mt-1'><NavLink className="btn btn-sm btn-primary" to="/groups/select" >Go Make One!</NavLink></div>
            </div>
            
        </div>
    )
    }

    const handleRemoveGame = (e) => {
    user.toRemove = e.target.id;
    dispatch(removeGameFromList(user, user.toRemove, user._token))
    }

    // Takes the users list of games playing and turns them into usable elements, or a default value
    if(userGames.length > 0){
    gamesList = userGames.map(e => (
        <li key={e.slug} className="my-1 py-1 d-flex flex-column">
            <div className="d-flex flex-row justify-content-center align-items-center flex-wrap border-bottom pt-0 pb-1">

                <NavLink to={`/games/${e.slug}`}><span className='bold'>{e.game_name}:</span></NavLink> <span className="mr-1">In Game Name: {e.in_game_name || "None"}</span>

                <button className="btn btn-sm btn-danger mr-1 px-1 py-0" id={e.id} onClick={handleRemoveGame}>Remove</button>
            </div>
        </li>
    ))
    }else{
    gamesList = <li>
        <div>No Games Added Yet</div>
        <div><NavLink to='/games'>Go Add Some!</NavLink></div>
    </li>
    };




  return (
      <Fragment>
            <Helmet>
                <title>Group-Up Gamers || My Profile</title>
            </Helmet>
            <Breadcrumb
                title="My Profile"
                bg={profilebg}
            />
            <LayoutDefault className="template-color-1 template-font-1">
                <div className="brook-blog-details-area bg_color--1 pt--90 pb--150">
                    <Container>
                        <Row>
                            <Col lg={8}>
                                <div className="blog-details-wrapper wow move-up">
                                    <article className="blog-post standard-post wow move-up">
                                        <header className="header mb--40 text-center"></header>
                                        <div className="group-info d-flex justify-content-around wow move-up">
                                            <div className="group-info-img wow move-up">
                                                <div className="bold">Profile Image</div>
                                                <Thumbnail 
                                                thumb={user.profile_img_url ? user.profile_img_url: Default}
                                                className="mb--60 profile-own-img"/>
                                            </div>
                                            <div className="group-info-info wow move-up">
                                                <div className="group-info-discord wow move-up">
                                                    <div className="card-text"><span className="bold">My Info</span></div>
                                                        <div>First Name: {user.first_name}</div>
                                                        <div>Last Name: {user.last_name}</div>
                                                        <div>Email: {user.email}</div>
                                                        <div>Discord: {user.discord_url}</div>
                                                        <div className="mt-5"><NavLink to="/profile/edit" className="btn btn-primary btn-sm" style={{height: '2rem'}}>Edit Profile</NavLink></div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </Col>

                            <Col lg={4} className="mt_md--60 mt_sm--60">
                                <div className="blog-sidebar-container">
                                    <div className="blog-sidebar-wrapper">
                                        <SidebarItem
                                            title="My Games"
                                            className="category mb--30"
                                            >
                                            <div className="inner">
                                                <ul className="category-list">
                                                    {gamesList}
                                                </ul>
                                            </div>
                                        </SidebarItem>
                                        <div className="border-bottom border-dark"></div>
                                        <div className="border-bottom border-dark" style={{height: '2rem'}}></div>
                                        <SidebarItem
                                            title="Joined Groups"
                                            className="category mt--30 mb--30"
                                            >
                                            <div className="inner">
                                                <ul className="category-list">
                                                    {groups}
                                                </ul>
                                            </div>
                                        </SidebarItem>
                                        <div className="border-bottom border-dark"></div>
                                        <div className="border-bottom border-dark" style={{height: '2rem'}}></div>
                                        <SidebarItem
                                            title="Owned Groups"
                                            className="category mt--30 mb--30"
                                            >
                                            <div className="inner">
                                                <ul className="category-list">
                                                    {ownedGroupsDisplay}
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
  );
}

export default Profile;
