"use strict";

let express = require("express");
var router = express.Router({mergeParams: true});

// Routing
router.use('/text' , require('./text'));
router.use('/art' , require('./art'));

module.exports = router;
