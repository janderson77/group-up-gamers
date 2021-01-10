const express = require('express')
const router = express.Router();

const Platform = require('../models/platform')

router.post('/', async function(req, res, next){
    try{
        const newPlatform = await Platform.addPlatform(req.body);
        return res.status(201).json(newPlatform)
    }catch(e){
        return next(e)
    }
})

module.exports = router;