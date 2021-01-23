const express = require("express");
const router = new express.Router();

const {adminRequired, authRequired} = require("../middleware/auth");

const Group = require('../models/group');
const Message = require('../models/message')
const {validate} = require("jsonschema");

const {groupNew, groupUpdate, messagesNew} = require('../schemas/index')

// Groups Routes
// ************************************************************

router.get("/", async function (req, res, next) {
    try {
      if(req.query.search){
        searchString = req.query.search;
        searchArray = searchString.split(" ");
        newSearchString = searchArray.join("-");

        const groups = await Group.findAll(newSearchString);
        return res.json(groups);
      }
      const groups = await Group.findAll(req.query);
      return res.json(groups);
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

router.get('/members/:id', async function(req, res, next){
  try{
    const groups = await Group.findAllOfOwn(req.params.id);
    return res.json(groups)
  }catch(e){
    return next(e)
  }
})

router.post("/", async function (req, res, next) {
    try {
      const isValid = validate(req.body, groupNew);
  
      if (!isValid.valid) {
        return next({
          status: 400,
          message: isValid.eors.map(e => e.stack)
        });
      };
      let group = req.body;
      
      let groupNameStr = req.body.group_name.toLowerCase()
      let convertNameArr = groupNameStr.split(" ");
      groupSlug = convertNameArr.join("-");

      group.group_slug = groupSlug

      const newGroup = await Group.create(group);
      return res.status(201).json({newGroup});   // 201 CREATED
    }catch (e) {
      return next(e);
    };
});

router.post('/:id/join', async function(req, res, next){
  try{
    const user = req.body.user;
    const group_id = req.params.id;

    const group = await Group.findOneById(group_id);

    const result = await Group.joinGroup(user, group);
    return res.status(200).json(result);
  }catch(e){
    return next(e)
  }
});

router.patch("/:id", async function (req, res, next) {
    try {
      if ("id" in req.body) {
        return next({status: 400, message: "Not allowed"});
      }
  
      const isValid = validate(req.body, groupUpdate);
      if (!isValid.valid) {
        return next({
          status: 400,
          message: isValid.errors.map(e => e.stack)
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

// ************************************************************
// Group messages Routes
// ************************************************************

router.get('/:id/messages', async function(req, res, next){
  try{
    const messages = await Message.getMessage(req.params.id);
    return res.status(200).json(messages);
  }catch(e){
    return next(e)
  }
});

router.post('/:id/messages', async function(req, res, next){
  try{
    const message = req.body;

    const isValid = validate(message, messagesNew);

    if (!isValid.valid) {
      return next({
        status: 400,
        message: isValid.errors.map(e => e.stack)
      });
    };

    const newMessage = Message.createMessage(message);

    return res.status(201).json(newMessage);
  }catch(e){
    return next(e)
  };
});

router.delete('/:id/messages/:message_id', async function(req, res, next){
  try{
    const message = await Message.deleteMessage(req.params.message_id);

    return res.status(200).json({message: "Message deleted"});
  }catch(e){
    return next(e)
  }
})

module.exports = router;