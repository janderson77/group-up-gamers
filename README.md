# Group-Up Gamers

[![GitHub Stars](https://img.shields.io/github/stars/janderson77/group-up-gamers.svg)](https://github.com/janderson77/group-up-gamers/stargazers) [![GitHub Issues](https://img.shields.io/github/issues/janderson77/group-up-gamers.svg)](https://github.com/janderson77/group-up-gamers/issues) [![Current Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/janderson77/group-up-gamers)

This is a React.js application powered by Redux, Node.js and the Twitch [IGDB API](https://api-docs.igdb.com/) that provides a place for gamers across any and all currently available platforms to find players of the games they love to join them in their quests, adventures and battles.

---

![Front Page Preview](https://i.imgur.com/ScgqaBz.png)

## Features

---

* Account creation/deletion/editing
* Adding games to a list of games you enjoy
* Group creation/deltion/editing
* Group admin with kick/ban/message removal capabilities
* Joining existing groups
* Messaging on group message board
* More amazing features to come

## Setup

---

Clone this repo to your chosen destination.

Navigate to the frontend folder and run `npm install` to install dependancies

Navigate to the backend folder and run `npm install` to install dependancies

You wil need to obtain a FullPage.js license. Once obtained, create a secrets.js file in the frontend's src directory. Export a variable named "licenseKey".

You will also need to create and export a variable called "TOKEN_STORAGE_ID" which should be named "GG-token"

```js
export const licenseKey = 'your-key-here'
export const TOKEN_STORAGE_ID = "GG-token"
```

To set up the database, you will need to be using PostgreSQL.

First run

```console
createdb groupupgamers_db
```

The included db file is a db dump, so you will just need to run the following command from your shell

```console
psql groupupgamers_db < db.pgsql
```

## Usage

---

Once all dependencies are installed, the db has been created and the dump file used to seed the data, navigate to the frontend directory and run `npm start` to start the application. This will start the backend server as well as the front end.

## Future Plans

At the moment the group messaging system is very basic. I plan to implement more of a forum style system with topics, announcements and things of that nature.

I am also investigating integration with the Discord API, as well as elastic search to refine the game and group search

I am also planning to integrate with Amazon S3 for user profile image and group logo image storage
