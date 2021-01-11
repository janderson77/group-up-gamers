const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { validate } = require("jsonschema");
const { userNew } = require("../schemas");

const { userNew, userUpdate } = require('../schemas/index');

const createToken = require('../helpers/createToken');

router.get('/', async function(req, res, next) {
    try{
        const users = 
    }catch(e) {
        return next(e)
    }
})