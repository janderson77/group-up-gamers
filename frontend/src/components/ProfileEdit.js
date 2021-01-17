import React, { useState, useContext, useEffect, useRef } from "react";
import Alert from "./Alert";
import UserContext from "../UserContext";
import axios from "axios";

const MESSAGE_SHOW_PERIOD_IN_MSEC = 3000;

function Profile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  console.log(currentUser)

  const [userForm, setUserForm] = useState({
    first_name: currentUser.data.user.first_name || "",
    last_name: currentUser.data.user.last_name || "",
    email: currentUser.data.user.email || "",
    profile_img_url: currentUser.data.user.profile_img_url || "",
    username: currentUser.data.user.username,
    password: "",
    errors: [],
    saveConfirmed: false
  });

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

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      let profileData = {
        first_name: userForm.first_name || undefined,
        last_name: userForm.last_name || undefined,
        email: userForm.email || undefined,
        profile_img_url: userForm.profile_img_url || undefined,
        password: userForm.password
      };

      let username = userForm.username;
      let updatedUser = await axios.patch(`http://localhost:3001/`,{username, profileData});
      console.log("UPDATED USER", updatedUser)
      setUserForm(f => ({
        ...f,
        errors: [],
        saveConfirmed: true,
        password: ""
      }));
      setCurrentUser(updatedUser);
    } catch (errors) {
      setUserForm(f => ({ ...f, errors }));
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

  return (
    <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h3>Profile</h3>
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
    </div>
  );
}

export default Profile;
