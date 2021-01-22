import React, {useEffect, useCallback} from 'react'
import './css/GamesList.css'
import {useSelector, useDispatch} from 'react-redux';
import {getAllGroupsFromApi, resetGroupsState} from '../actions/groups'
import {NavLink} from 'react-router-dom'


const GroupsList = () => {
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [resetGroupsState],
    )

    useEffect(() => {initialize(); }, [initialize])
    const groups = useSelector(st => st.groups.groups);
    const dispatch = useDispatch();
    const missing = !groups;

    // const [offset, setOffset] = useState(0);
    // const [data, setData] = useState([]);
    // const [perPage, setPerPage] = useState(10);
    // const [pageCount, setPageCount] = useState(0);

    useEffect(function() {
        if(missing) {
            dispatch(getAllGroupsFromApi())
        }
    }, [missing, dispatch])

    

    if(missing) return <h1 className="mt-5">Loading...</h1>;
    let groupsArr = Object.values(groups)
    

    return(
        <div className="container d-flex flex-column align-items-center">
            {groupsArr.map(e => (
                <div key={e.id}>
                    <NavLink to={`/groups/${e.id}`} >
                    <div className="card flex-row flex-wrap">
                        <div className="card-header border-0">
                            <img src={e.group_logo_url} alt={e.group_name} />
                        </div>
                        <div className="card-block px-2">
                            <h4 className="card-title">{e.group_name}</h4>
                        </div>

                    </div>
                    </NavLink>
                </div>
                
            ))}
            
        </div>
    )
};

export default GroupsList;