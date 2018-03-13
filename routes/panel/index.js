"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router({mergeParams: true});

router.use(middlewares.CheckLogedIn);
router.use(middlewares.CheckPanelAccess);
router.use(middlewares.SpPIm);

// Routing
router.use(/^\/(home)?/ , require('./home'));
router.use('/encyclopedia' , require('./encyclopedia/'));
router.use('/pagesStuff' , require('./pagesStuff/'));
router.use('/translate' , require('./translate/'));
router.use('/adminStuff' , require('./adminStuff/'));
router.use('/EncTree' , require('./EncTree'));

module.exports = router;
