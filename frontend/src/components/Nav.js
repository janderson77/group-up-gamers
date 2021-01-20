import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import './css/Nav.css';
import {logout} from '../actions/users';

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(st => st.users.user)

  const handleLogout = () => {
    try{
      dispatch(logout())
    }catch(e){
      console.log(e)
    }
    
  }
  const loggedOutNav = () => {
    return(
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">GG</NavLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/games">Games</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="groups">Groups</a>
                </li>
              </ul>
            </div>

            <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
              <NavLink className="nav-link me-2" to="/login"  >Login/register</NavLink>
              </li>
            </ul>
            </div>
          </div>
        </nav>
    );
  };

  const loggedInNav = () => {
    return(
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">GG</NavLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/games">Games</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/groups">Groups</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
              </ul>
            </div>

            <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
              <NavLink className="nav-link me-2" to="/" onClick={handleLogout} >Logout</NavLink>
              </li>
            </ul>
            </div>
          </div>
        </nav>
    );
  };

  return(
    <div>
      {user ? loggedInNav() : loggedOutNav()}
    </div>
  );
};

export default Navigation;