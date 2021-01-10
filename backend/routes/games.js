const express = require('express')
const router = express.Router();

const Game = require('../models/game')
const { validate } = require("jsonschema");

const {gameNewSchema} = require('../schemas/gameNewSchema')



router.post('/', async function(req, res, next){
    try{
        // const isValid = validate(req.body, gameNewSchema)

        // if(!isValid.valid) {
        //     return next({
        //         status: 400,
        //         message: isValid.errors.map(e => e.stack)
        //     });
        // }

        const newGame = await Game.addGame(req.body);
        return res.status(201).json({newGame})
    }catch(e){
        return next(e)
    }
});

module.exports = router