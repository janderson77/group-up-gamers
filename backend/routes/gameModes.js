const express = require('express')
const router = express.Router();

const GameMode = require('../models/gameMode');

router.post('/', async function(req, res, next){
    // For admin use only
    try{
        const newGameMode = await GameMode.addGame(req.body);
        return res.status(201).json(newGameMode)
    }catch(e){
        return next(e)
    }
});

module.exports = router