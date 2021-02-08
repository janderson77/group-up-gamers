import React, { useEffect, useCallback, Fragment } from "react";
import {useSelector, useDispatch } from 'react-redux'
import './css/ProfileVisit.css'
import { NavLink, useParams, Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {getUser, resetVisitingState} from '../actions/users'
import Default from '../static/Default.png';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import {Col, Container, Row} from "react-bootstrap";
import Thumbnail from "../template/components/about-us/thumbnail/AboutThumbOne";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import gamesbg from '../static/gamesbg.jpg';
import NotLoggedIn from './NotLoggedIn'

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
    }else{
        return (
            <NotLoggedIn />
        )
    }
        
    let userGames;
    
    user.games_playing ? userGames= Object.values(user.games_playing) : userGames= [];

    let gamesList;

    if(userGames.length > 0){
        gamesList = userGames.map(e => (
            <div key={e.slug} className="user-lists"><NavLink to={`/games/${e.slug}`}>{e.game_name}</NavLink></div>
        ))
    }else{
        gamesList = <div>
            <div>{user.username} has not added any games yet.</div>
        </div>
    };

    let groups;

    if(user.groups.length){
        groups = user.groups.map(e => (
            <div key={e.group_id} className="user-lists">
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
    <Fragment>
        <Helmet>
            <title>Group-Up Gamers || {user.username}</title>
        </Helmet>
        <LayoutDefault className="template-color-1 template-font-1">
        <Breadcrumb
            title={`${user.username}'s Profile`}
            bg={gamesbg}
        />

        <div className="brook-blog-details-area bg_color--1 pt--90 pb--150">
            <Container>
                <Row>
                    <Col lg={8} className={'mx-auto'}>
                        <div className="blog-details-wrapper">
                            <article className="blog-post standard-post">
                                <header className="header text-center">
                                </header>

                                <Thumbnail thumb={user.profile_img_url ? user.profile_img_url: Default} className="mb--60 d-flex justify-content-center " imgClass='gameImg'/>

                                <section className="content basic-dark2-line-1px pb--50 mb--35">
                                    <div className="inner">
                                        <h5 className="heading wow move-up user-lists-heading">
                                           {`${user.username}'s Groups`}
                                        </h5>
                                        <section className="content basic-dark2-line-1px pt-1"></section>
                                        {groups}
                                    </div>
                                    <section className="content basic-dark2-line-1px my-5 pb-5"></section>
                                    <div className="inner">
                                        <h5 className="heading wow move-up user-lists-heading">
                                           {`${user.username}'s Games`}
                                        </h5>
                                        <section className="content basic-dark2-line-1px pt-1"></section>
                                        {gamesList}
                                    </div>
                                </section>
                                <footer className="blog-footer mb--85 wow move-up">
                                </footer>
                            </article>
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
