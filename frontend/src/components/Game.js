import React, {useEffect, useCallback, useState, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {getGameFromAPI, resetGameState} from '../actions/games'
import {addGameToList, removeGameFromList} from '../actions/users'
import "./css/Game.css"
import Default from '../static/Default.png';
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import {Col, Container, Row} from "react-bootstrap";
import Thumbnail from "../template/components/about-us/thumbnail/AboutThumbOne";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import gamesbg from '../static/gamesbg.jpg';
import NotLoggedIn from './NotLoggedIn'

const Game = () => {
    const dispatch = useDispatch();
    const user = useSelector(st => st.users.user)
    const [ignView, toggleIgnView] = useState(false);
    const INITIAL_STATE = {in_game_name: ""}
    const [formData, setFormData] = useState(INITIAL_STATE)

    const initialize = useCallback(
        () => {
            dispatch(resetGameState())
        },
        [dispatch],
    )

    useEffect(() => {initialize(); }, [initialize])

    const {slug} = useParams();
    const game = useSelector(st => st.games[slug]);

    const missing = !game;

    useEffect(function() {
        if(missing) {
            dispatch(getGameFromAPI(slug));
        }
    }, [missing, slug, dispatch]);

    const handleToggleIgnView = () => {
        toggleIgnView(!ignView);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    if(missing) return <h1 className="mt-5">Loading...</h1>;

    let gameModes = game.game_modes;
    let gamePlatforms = game.platforms;

    if(!user){
        return(
            <NotLoggedIn />
        )
    };

    const AddGame = () => {
        handleToggleIgnView();
        dispatch(addGameToList(user.id, game.id, user._token, formData.in_game_name))
    };

    const handleRemoveGame = (e) => {
        user.toRemove = e.target.id;
        dispatch(removeGameFromList(user, user.toRemove, user._token))
    };    

    const tryAddGame = (e) => {
        e.preventDefault();
        try{
            AddGame();
        }catch(e){
            console.log(e)
            return
        }
    }

    let button;
    let notAddedButton = <button onClick={handleToggleIgnView} className="btn btn-small btn-success">Add Game</button>

    

    if(user.games_playing){
        if(user.games_playing[game.id]){
            button = (
            <>
            <button className="btn btn-small btn-info" disabled>Added</button>
            <button id={game.id} className="btn btn-small btn-danger" onClick={handleRemoveGame}>Remove</button>
            </>
            )
        }else{
            button = notAddedButton
        }
    }else{
        button = notAddedButton
    };

    let ignInput;

    if(ignView){
        ignInput = (
            <div>
                <form onSubmit={tryAddGame}>
                    <div className="form-group">
                        <label>In Game Name (optional)</label>
                        <input
                            name="in_game_name"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn btn-small btn-success">Add Game</button>
                </form>
                <button className="btn btn-small btn-danger" onClick={handleToggleIgnView}>Cancel</button>
            </div>
        )
    }else{
        ignInput = button;
    }
    
    let previous = [{title: 'Games'}]

    return(
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers || {game.game_name}</title>
            </Helmet>
            <LayoutDefault className="template-color-1 template-font-1">
            <Breadcrumb
                    title={game.game_name}
                    bg={gamesbg}
                    prev={previous}
                    stem="/games"
            />
            <div className="brook-blog-details-area bg_color--1 pt--90 pb--150">
            
                <Container>
                    <Row>
                        <Col lg={8} className={'mx-auto'}>
                            <div className="blog-details-wrapper">
                                <article className="blog-post standard-post">
                                    <header className="header mb--40 text-center">
                                        <h3 className="heading heading-h3 font-32">
                                            {game.game_name}
                                        </h3>
                                        
                                    </header>

                                    <Thumbnail thumb={game.cover_art ? game.cover_art: Default} className="mb--60 d-flex justify-content-center " imgClass='gameImg'/>

                                    <section className="content basic-dark2-line-1px pb--50 mb--35">
                                        <div className="inner">
                                            <h5 className="heading heading-h5 line-height-1-95 wow move-up">
                                                {game.summary}
                                            </h5>
                                            <div className="desc mt--45 mb--35">
                                                <div className="bk_pra wow move-up">
                                                    {ignInput}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="basic-dark2-line-1px mb--35 wow move-up" />
                                            <h5 className="heading heading-h5 line-height-1-95 wow move-up">Game Modes</h5>
                                            <div className="desc mt--45 mb--50 wow move-up">
                                                {gameModes.map(e => <p className="wow move-up" key={e}>{e}</p>)}
                                            </div>
                                        <div className="basic-dark2-line-1px mb--35 wow move-up" />
                                            <h5 className="heading heading-h5 line-height-1-95 wow move-up">Platforms</h5>
                                            <div className="desc mt--45 mb--50 wow move-up">
                                                {gamePlatforms.map(e => <p key={e}>{e}</p>)}
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
    )
}

export default Game;