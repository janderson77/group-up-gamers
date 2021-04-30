const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const User = require("../models/user");
const GamePlaying = require('../models/gamePlaying')
const { validate } = require("jsonschema");

const { userNew, userUpdate, userAuth, gamePlayingSchema } = require('../schemas/index');

const createToken = require('../helpers/createToken');

// User Routes
// **************************************************************

router.get('/',  async function(req, res, next) {
    try{
        const users = User.findAll();
        return res.json({users});
    }catch(e) {
        return next(e)
    };
});

router.get("/:id",  async function(req, res, next) {
    try {
      const user = await User.findOne(req.params.id);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });

router.post("/register", async function(req, res, next) {
    try {
        delete req.body._token;
        const isValid = validate(req.body, userNew);

        if (!isValid.valid) {
        return next({
            status: 400,
            message: isValid.errors.map(e => e.stack)
        });
        };

        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        newUser._token = token
        return res.status(201).json(newUser);
    } catch (e) {
            return next(e);
};
});

router.post('/login',  async function(req, res, next){
  try{
    const isValid = validate(req.body, userAuth);

    if(!isValid.valid){
      return next({
        status: 400,
        message: isValid.errors.map(e => e.stack)
      });
    };

    const user = await User.authenticate(req.body);
    const token = createToken(user);
    user._token = token;

    return res.status(200).json(user)

  }catch(e){
    return next(e)
  };
});

router.patch("/:id",  authRequired, ensureCorrectUser, async function(req, res, next) {
  let data = req.body
    try {
      if (data.isAdmin) {
        return next({ status: 400, message: "Not allowed" });
      }
      await User.authenticate({
        username: data.username,
        password: data.password
      });

      let user = {
        password: data.password || undefined,
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        discord_url: data.discord_url || undefined,
        profile_img_url: data.profile_img_url || undefined,
        email: data.email || undefined
      };

      const isValid = validate(user, userUpdate);
      if (!isValid.valid) {
        return next({
          status: 400,
          message: isValid.errors.map(e => e.stack)
        });
      };

      user.username = data.username;

      user = await User.update(req.params.id, data);
      delete user.isAdmin;
      delete user.password;
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
});

router.delete("/:id", authRequired, ensureCorrectUser, async function(req, res, next) {
  const data = req.body
    try {
      console.log(data)
      await User.authenticate({
        username: data.username,
        password: data.password
      });

      await User.remove(req.params.id);
      return res.json({ message: "User deleted" });
    } catch (err) {
      return next(err);
    }
  });


// ******************************************************
// games_playing routes
// ******************************************************

router.get('/:id/games_playing',  async function(req, res, next){
  try{
    const gamesPlaying = await GamePlaying.getAllGamesPlaying(req.params.id);

    return res.json(gamesPlaying);
  }catch(e){
    return next(e);
}
});

router.get('/:id/games_playing/:game_id',  async function(req, res, next){
  try{
    let game_id = req.params.game_id;
    let body = req.body;
    body.game_id = game_id;
    const game = await GamePlaying.getOneGamePlayingById(body, req.params.id);

    return res.json(game);
  }catch(e){
    return next(e);
}
});

router.post('/:id/games_playing',  async function(req, res, next){
  let toValidate = {
    user_id: req.body.user_id,
    game_id: req.body.game_id,
    in_game_name: req.body.in_game_name
  }
  const isValid = validate(toValidate, gamePlayingSchema);

  if (!isValid.valid) {
    return next({
        status: 400,
        message: isValid.errors.map(e => e.stack)
    });
    };

  try{
    const game = await GamePlaying.addGamePlaying(req.body, req.params.id);

    game[0].in_game_name = req.body.in_game_name;

    return res.json(game);
  }catch(e){
    return next(e);
}
});

router.patch('/:id/games_playing/:game_id',  authRequired, ensureCorrectUser, async function(req, res, next){
  const isValid = validate(req.body, gamePlayingSchema);

  if (!isValid.valid) {
    return next({
        status: 400,
        message: isValid.errors.map(e => e.stack)
    });
    };

  try{
    let game_id = req.params.game_id;
    let body = req.body;
    body.game_id = game_id;

    const game = await GamePlaying.updateGamePlaying(body, req.params.id);

    return res.json(game);
  }catch(e){
    return next(e);
}
});

router.delete('/:id/games_playing/:game_id',  authRequired, async function(req, res, next){
  try{
    let game_id = req.params.game_id;
    let body = {game_id: game_id};

    const game = await GamePlaying.removeGamePlaying(body, req.params.id);

    return res.json(game);
  }catch(e){
    return next(e);
}
});
  
module.exports = router;