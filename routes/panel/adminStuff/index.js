"use strict";

let express = require("express");
let middlewares = require( consV.methods.middlewares);
let router = express.Router({mergeParams: true});

router.use(middlewares.checkAdminStuffAccess);

// Routing
router.use('/addResources' , require('./addResources'));
router.use('/editResources' , require('./editResources'));
router.use('/addEditResources' , require('./addEditResources'));
router.use('/resApproveArt' , require('./resApproveArt'));
router.use('/resTrusUsers' , require('./resTrusUsers'));
router.use('/resInf' , require('./resInf'));
router.use('/leg' , require('./leg'));
router.use('/nonArtTel' , require('./nonArtTel'));
router.use('/perm' , require('./perm'));
router.use('/WS/nonArtsTelList_WA' , require('./WS/nonArtsTelList_WA'));
router.use('/WS/nonArtTelDel_WA' , require('./WS/nonArtTelDel_WA'));
router.use('/WS/nonArtTelAdd_WA' , require('./WS/nonArtTelAdd_WA'));
router.use('/WS/permList_WA' , require('./WS/permList_WA'));
router.use('/WS/delUser_WA' , require('./WS/delUser_WA'));

module.exports = router;
