const express = require('express')
const router = express.Router();


const Game = require('../models/game')
const {validate} = require("jsonschema");

const {gameNewSchema, gameUpdate} = require('../schemas/index')

router.get('/',  async function(req, res, next) {
    try{
        const games = await Game.findAll(req.body);
        return res.json({games})
    }catch(e){
        return next(e)
    }
});

router.get('/min',  async function(req, res, next){
    try{
        const games = await Game.findAllMin();
        return res.json([games])
    }catch(e){
        return next(e)
    }
});

router.post('/search',  async function(req, res, next){
    try{
        const games = await Game.findAllStartsWith(req.body.search);
        return res.json([games])
    }catch(e){
        return next(e)
    }
});

router.get('/:slug',  async function (req, res, next) {
    try{
        const game = await Game.findOne(req.params.slug);
        return res.json({game})
    }catch(e){
        return next(e);
    }
});

// router.post('/',  async function(req, res, next){
//     try{
//         const isValid = validate(req.body, gameNewSchema)

//         if(!isValid.valid) {
//             return next({
//                 status: 400,
//                 message: isValid.errors.map(e => e.stack)
//             });
//         }

//         const newGame = await Game.addGame(req.body);
//         return res.status(201).json({newGame})
//     }catch(e){
//         return next(e)
//     }
// });

// router.patch('/:slug',  async function(req, res, next) {
//     try{
//         if('slug' in req.body){
//             return next({status: 400, message: "Not Allowed"});
//         };
    
//         const isValid = validate(req.body, gameUpdate);
//         if(!isValid.valid){
//             return next({
//                 status: 400,
//                 message: isValid.errors.map(e => e.stack)
//             });
//         }
    
//         const game = await Game.updateGame(req.params.slug, req.body);
//         return res.json({game})
//     }catch(e){
//         return next(e)
//     }
// });

// router.delete('/:slug',  async function(req, res, next) {
//     try{
//         await Game.removeGame(req.params.slug);
//         return res.json({message: "Game deleted"});
//     }catch(e) {
//         return next(e)
//     }
// })

module.exports = router