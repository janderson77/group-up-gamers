const express = require("express");
const router = new express.Router();

const {adminRequired, authRequired} = require("../middleware/auth");

const Group = require('../models/group');
const {validate} = require("jsonschema");

const {groupNew, groupUpdate} = require('../schemas/index')

router.get("/", async function (req, res, next) {
    try {
      const group = await Group.findAll(req.query);
      return res.json({group});
    }
  
    catch (e) {
      return next(e);
    }
  });

router.get("/:id", async function (req, res, next) {
    try {
      const group = await Group.findOneById(req.params.id);
      return res.json({group});
    }
  
    catch (e) {
      return next(e);
    }
});

router.post("/", async function (req, res, next) {
    try {
      const validation = validate(req.body, groupNew);
  
      if (!validation.valid) {
        return next({
          status: 400,
          message: validation.eors.map(e => e.stack)
        });
      };
  
      const group = await Group.create(req.body);
      return res.status(201).json({group});   // 201 CREATED
    }catch (e) {
      return next(e);
    };
});

router.patch("/:id", async function (req, res, next) {
    try {
      if ("id" in req.body) {
        return next({status: 400, message: "Not allowed"});
      }
  
      const validation = validate(req.body, groupUpdate);
      if (!validation.valid) {
        return next({
          status: 400,
          message: validation.errors.map(e => e.stack)
        });
      }
  
      const group = await Group.update(req.params.handle, req.body);
      return res.json({group});
    }
  
    catch (err) {
      return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
      await Group.remove(req.params.id);
      return res.json({message: "Group deleted"});
    }
  
    catch (err) {
      return next(err);
    }
});


module.exports = router;