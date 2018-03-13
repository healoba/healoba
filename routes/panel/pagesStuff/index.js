"use strict";

let express = require("express");
let middlewares = require( consV.methods.middlewares);
var router = express.Router({mergeParams: true});

// Routing
router.use(middlewares.checkPageStuffAccess);

router.use('/mainPage', require('./mainPage'));
router.use('/slideShow', require('./slideShow'));
router.use('/setSlideShow', require('./setSlideShow'));
router.use('/getSlideShow', require('./getSlideShow'));

module.exports = router;
