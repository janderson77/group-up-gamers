import { combineReducers } from "redux";
import games from './games';
import groups from './groups';
import users from './users'

export default combineReducers({
  games,
  groups,
  users
});