import React from 'react';
import {useSelector} from 'react-redux'
import {Redirect, Route} from 'react-router-dom'

const PrivateRoute = ({exact, path, children}) => {
    const user = useSelector(st => st.users.user)

    if(!user){
        return <Redirect to='/login' />
    }

    return (
        <Route exact={exact} path={path}>
            {children}
        </Route>
    )
}

export default PrivateRoute