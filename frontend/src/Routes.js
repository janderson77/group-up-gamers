import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home'
import Game from './components/Game'
import GamesList from './components/GamesList'
import Login from './components/Login'
import Profile from './components/Profile'
import GroupsList from './components/GroupsList'
import Group from './components/Group'
import GroupGameForm from './components/GroupGameForm'
import GroupForm from './components/GroupForm'
import GroupAdmin from './components/GroupAdmin'
import ProfileVisit from './components/ProfileVisit'
import ProfileEdit from './components/ProfileEdit'
import ProfileDeleted from './components/ProfileDeleted'
import PrivateRoute from './PrivateRoute'

const Routes = () => {
    return(
        <Switch>
            <Route path="/" exact><Home /></Route>
            <Route exact path="/games" ><GamesList /></Route>
            <PrivateRoute exact path="/games/:slug" ><Game /></PrivateRoute>
            <Route exact path="/login"><Login /></Route>
            <Route exact path="/profile" ><Profile /></Route>
            <PrivateRoute exact path="/profile/edit" ><ProfileEdit /></PrivateRoute>
            <Route exact path="/groups"><GroupsList /></Route>
            <PrivateRoute exact path="/groups/select"><GroupGameForm /></PrivateRoute>
            <PrivateRoute exact path="/groups/create"><GroupForm /></PrivateRoute>
            <PrivateRoute exact path="/groups/:id"><Group /></PrivateRoute>
            <PrivateRoute exact path="/groups/:id/admin"><GroupAdmin /></PrivateRoute>
            <PrivateRoute exact path="/users/:id"><ProfileVisit /></PrivateRoute>
            <Route exact path="/deleted"><ProfileDeleted /></Route>
            <Redirect to="/" />
        </Switch>
    )
}

export default Routes