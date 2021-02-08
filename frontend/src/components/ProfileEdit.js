import React, { useState, useEffect, useRef, Fragment } from "react";
import {useHistory} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import {editProfile, deleteProfile} from '../actions/users'
import './css/Profile.css'
import Alert from "./Alert";
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";
import profilebg from '../static/profilebg.jpg';
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import NotLoggedIn from './NotLoggedIn'

const MESSAGE_SHOW_PERIOD_IN_MSEC = '3000'

function Profile() {
  const user = useSelector(st => st.users.user)
  const dispatch = useDispatch();
  const history = useHistory();

  const [userForm, setUserForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    profile_img_url: user.profile_img_url || "",
    username: user.username,
    password: "",
    errors: [],
    saveConfirmed: false,
    hasErrors: false
  });

  const [deleteShown, toggleDeleteShown] = useState(false);
  const [toDeletePass, setToDeletePass] = useState({
    password: ""
  })

  const messageShownRef = useRef(false);
  
  useEffect(
    function() {
      if (userForm.saveConfirmed && !messageShownRef.current) {
        messageShownRef.current = true;
        setTimeout(function() {
          setUserForm(f => ({ ...f, saveConfirmed: false }));
          messageShownRef.current = false;
        }, MESSAGE_SHOW_PERIOD_IN_MSEC);
      }
    },
    [userForm]
  );

  useEffect(
    function() {
      if (userForm.hasErrors && !messageShownRef.current) {
        messageShownRef.current = true;
        setTimeout(function() {
          setUserForm(f => ({ ...f, hasErrors: false, errors: [] }));
          messageShownRef.current = false;
        }, MESSAGE_SHOW_PERIOD_IN_MSEC);
      }
    },
    [userForm]
  );

  if(!user){
    return(
      <NotLoggedIn />
    )
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let profileData = {
        first_name: userForm.first_name || undefined,
        last_name: userForm.last_name || undefined,
        email: userForm.email || undefined,
        profile_img_url: userForm.profile_img_url || undefined,
        password: userForm.password
      };

      profileData.username = user.username;
      profileData._token = user._token

      let updatedUser = await axios.patch(`http://localhost:3001/users/${user.id}`,profileData);

      setUserForm(f => ({
        ...f,
        errors: [],
        saveConfirmed: true,
        password: ""
      }));

      dispatch(editProfile(updatedUser.data.user))
    } catch (e) {
      let err = e.response.data.message
      console.log(err)
      setUserForm({
        ...userForm,
        hasErrors: true,
        errors: [...userForm.errors, err]
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUserForm(f => ({
      ...f,
      [name]: value,
      errors: []
    }));
  }

  const handleDeletePassChange = (e) => {
    const { name, value } = e.target;
    setToDeletePass(f => ({
      ...f,
      [name]: value,
      errors: []
    }));
  }

  const toggleDelete = () => {
    toggleDeleteShown(!deleteShown);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const toDelete = {
      id: user.id,
      username: user.username,
      password: toDeletePass.password,
      _token: user._token
    };
  
    try{
      const res = await axios.delete(`http://localhost:3001/users/${user.id}`,{data: toDelete});

      if(res.status === 200){
        history.push('/deleted');
        dispatch(deleteProfile());
      }
    }catch(errors){
      setUserForm(f => ({ ...f, errors }));
    }
  };

  let previous = [{title: "Profile"}]

  return (
    <Fragment>
    <Helmet>
        <title>Group-Up Gamers || Edit Profile</title>
    </Helmet>
    <Breadcrumb
                title="Edit Profile"
                bg={profilebg}
                prev={previous}
                stem="Profile"
            />
    <LayoutDefault className="template-color-1 template-font-1">
    <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4 d-flex flex-column align-items-center mt-5 pt-3">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Username</label>
              <p className="form-control-plaintext">{userForm.username}</p>
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                name="first_name"
                className="form-control"
                value={userForm.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="last_name"
                className="form-control"
                value={userForm.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                className="form-control"
                value={userForm.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                name="profile_img_url"
                className="form-control"
                value={userForm.profile_img_url}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm password to make changes:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={userForm.password}
                onChange={handleChange}
              />
            </div>

            {userForm.errors.length ? (
              <Alert type="danger" messages={userForm.errors} />
            ) : null}

            {userForm.saveConfirmed ? (
              <Alert type="success" messages={["User updated successfully."]} />
            ) : null}

            <button
              className="btn btn-primary btn-block mt-4"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <div className="mt-3">
        <h3>Delete Profile</h3>
      </div>
      
      <div className="card">
        <div className="card-body">
          <form>
            {deleteShown ? (
              <>
              <div className="form-group">
                <label>
                  Confirm password to permanently delete your account:
                  <br/>
                  NOTE: This cannot be undone!
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={toDeletePass.password}
                  onChange={handleDeletePassChange}
                />
              </div>

              <button
              className="btn btn-primary btn-block mt-4"
              onClick={handleDelete}
              >
              Delete Profile
              </button>
              <button className="btn btn-danger btn-block mt-4" onClick={toggleDelete} >
                Cancel
              </button>
            </>
            ) : (
              <button
                className="btn btn-primary btn-block mt-4"
                onClick={toggleDelete}
              >
                Delete Profile
              </button>
            )}            
          </form>
        </div>
      </div>
    </div>
    </LayoutDefault>
    </Fragment>
  );
}

export default Profile;
