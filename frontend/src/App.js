import React, {useState, useEffect} from 'react';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Nav'
import {BrowserRouter} from 'react-router-dom'
import { decode } from "jsonwebtoken";
import UserContext from "./UserContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { ClipLoader } from "react-spinners";
import axios from 'axios';

export const TOKEN_STORAGE_ID = "GG-token"

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        let { username } = decode(token);
        let currentUser = await axios.get(`http://localhost:3001/users/${username}`)
        let currentUserGroups = await axios.get(`http://localhost:3001/groups/members/${currentUser.data.user.id}`);

        let currentUserGames = await axios.get(`http://localhost:3001/users/${currentUser.data.user.id}/games_playing`);

        currentUser.data.user.groups = currentUserGroups;
        currentUser.data.user.games_playing = currentUserGames;

        setCurrentUser(currentUser);
      } catch (err) {
        setCurrentUser(null);
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  const handleLogOut = () => {
    setCurrentUser(null);
    setToken(null);
  };

  if (!infoLoaded) {
    return <ClipLoader size={150} color="#123abc" />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{currentUser, setCurrentUser}} >
          <Navigation logout={handleLogOut}/>
          <Routes setToken={setToken} />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
