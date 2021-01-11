const express = require("express");
const router = new express.Router();

const {adminRequired, authRequired} = require("../middleware/auth");

const {validate} = require("jsonschema");

const {groupNew, groupUpdate} = require('../schemas/index')

router.get("/", authRequired, async function (req, res, next) {
    try {
      const companies = await Company.findAll(req.query);
      return res.json({companies});
    }
  
    catch (err) {
      return next(err);
    }
  });