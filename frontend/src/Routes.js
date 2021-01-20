import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home'
import Game from './components/Game'
import GamesList from './components/GamesList'
import Login from './components/Login'
import Profile from './components/Profile'
import GroupsList from './components/GroupsList'
import Group from './components/Group'

const Routes = () => {
    return(
        <Switch>
            <Route path="/" exact><Home /></Route>
            <Route exact path="/games" ><GamesList /></Route>
            <Route exact path="/games/:slug" ><Game /></Route>
            <Route exact path="/login"><Login /></Route>
            <Route exact path="/profile" ><Profile /></Route>
            <Route exact path="/groups"><GroupsList /></Route>
            <Route exact path="/groups/:id"><Group /></Route>
            <Route exact path="/users/:id"><Profile /></Route>
            <Redirect to="/" />
        </Switch>
    )
}

export default Routes