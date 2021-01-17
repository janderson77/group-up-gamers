import React, {useEffect, useCallback} from 'react'
import './css/GamesList.css'
import {useSelector, useDispatch} from 'react-redux';
import {getAllGamesFromAPI, resetGameState} from '../actions/games'
import {NavLink} from 'react-router-dom'


const GamesList = () => {
    const initialize = useCallback(
        () => {
            dispatch(resetGameState())
        },
        [resetGameState],
    )

    useEffect(() => {initialize(); }, [initialize])
    const games = useSelector(st => st.games.games);
    const dispatch = useDispatch();
    const missing = !games;

    // const [offset, setOffset] = useState(0);
    // const [data, setData] = useState([]);
    // const [perPage, setPerPage] = useState(10);
    // const [pageCount, setPageCount] = useState(0);

    useEffect(function() {
        if(missing) {
            dispatch(getAllGamesFromAPI())
        }
    }, [missing, dispatch])

    

    if(missing) return <h1 className="mt-5">Loading...</h1>;
    let gamesArr = Object.values(games)
    

    return(
        <div className="container d-flex flex-column align-items-center">
            {gamesArr.map(e => (
                <div>
                    <NavLink to={`/games/${e.slug}`} >
                    <div className="card flex-row flex-wrap">
                        <div className="card-header border-0">
                            <img src={e.cover_art} alt="" />
                        </div>
                        <div className="card-block px-2">
                            <h4 className="card-title">{e.game_name}</h4>
                            {/* <p className="card-text overflow-elipses">{e.summary}</p> */}
                        </div>

                    </div>
                    </NavLink>
                </div>
                
            ))}
            
        </div>
    )
};

export default GamesList;