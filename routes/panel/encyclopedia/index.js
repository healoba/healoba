"use strict";

let express = require("express");
var router = express.Router({mergeParams: true});

// Routing
router.use('/createArt' , require('./createArt'));
router.use('/placeArt' , require('./placeArt'));
router.use('/editArt' , require('./editArt'));
router.use('/updateArt' , require('./updateArt'));
router.use('/deleteArt' , require('./deleteArt'));
router.use('/approveArt' , require('./approveArt'));
router.use('/resources' , require('./resources'));
router.use('/delResource' , require('./delResource'));
router.use('/nodeInf' , require('./nodeInf'));
router.use('/nodeUrl' , require('./nodeUrl'));
router.use('/uploadFile' , require('./uploadFile'));
router.use('/ArtApproves' , require('./ArtApproves'));
router.use('/ArtResources' , require('./ArtResources'));
router.use('/URLNameValidation' , require('./URLNameValidation'));

module.exports = router;
