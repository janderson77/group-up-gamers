# Group-Up Gamers

[![GitHub Stars](https://img.shields.io/github/stars/janderson77/group-up-gamers.svg)](https://github.com/janderson77/group-up-gamers/stargazers) [![GitHub Issues](https://img.shields.io/github/issues/janderson77/group-up-gamers.svg)](https://github.com/janderson77/group-up-gamers/issues) [![Current Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/janderson77/group-up-gamers)

This is a React.js application powered by Redux, Node.js and the Twitch [IGDB API](https://api-docs.igdb.com/) that provides a place for gamers across any and all currently available platforms to find players of the games they love to join them in their quests, adventures and battles.

---

[![Front-Page-Preview](https://imgur.com/a/UL8rYcp)]

## Features

---

* Account creation/deletion/editing
* Adding games to a list of games you enjoy
* Group creation/deletion/editing
* Group admin with kick/ban/message removal capabilities
* Joining existing groups
* Messaging on group message board
* More amazing features to come

## Usage

---

Once all dependencies are installed, the db has been created and the dump file used to seed the data, navigate to the frontend directory and run `npm start` to start the application. This will start the backend server as well as the front end.

## Future Plans

At the moment the group messaging system is very basic. I plan to implement more of a forum style system with topics, announcements and things of that nature.

I am also investigating integration with the Discord API, as well as elastic search to refine the game and group search

I am also planning to integrate with Amazon S3 for user profile image and group logo image storage
