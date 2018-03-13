"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router({mergeParams: true});

// router.use(middlewares.CheckHelperAccess);

// Routing
router.use('/user_region' , require('./user_region'));

module.exports = router;
