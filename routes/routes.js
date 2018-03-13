"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router();

// Routing
router.use('/' , require('./start'));

//Helper
router.use('/helper/' , require('./helper'));

// MiddleWares
router.use(middlewares.CreLasUrs);
router.use(middlewares.CreLangVar);
router.use(middlewares.setLocaleGlo);
router.use(middlewares.SpSes);
router.use(middlewares.SpI18n);

// Routing
router.use(/^\/(fa|en)[\/]?$/ , require('./home'));
router.use(/^\/(fa|en)(\/+)home[\/]?$/ , require('./home'));
router.use(/^\/(fa|en)(\/+)license[\/]?$/ , require('./license'));
router.use(/^\/(fa|en)(\/+)signIn[\/]?$/ , require('./sign/signIn'));
router.use(/^\/(fa|en)(\/+)signUp[\/]?$/ , require('./sign/signUp'));
router.use('/sign/sign_out' , require('./sign/sign_out'));
router.use('/stuff/lanPopShow' , require('./stuff/lanPopShow'));
router.use(/^\/(fa|en)(\/+)searchRes[\/]?$/ , require('./searchRes'));
router.use(/^\/(fa|en)(\/+)searchRes(\/+)\w+/ , require('./searchRes'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)medicine[\/]?$/ , require('./encyclopedia/medicine'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)medicine(\/+)\w+/ , require('./encyclopedia/medicine'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)fruits[\/]?$/ , require('./encyclopedia/fruits'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)fruits(\/+)\w+/ , require('./encyclopedia/fruits'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)plants[\/]?$/ , require('./encyclopedia/plants'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)plants(\/+)\w+/ , require('./encyclopedia/plants'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)edible[\/]?$/ , require('./encyclopedia/edible'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)edible(\/+)\w+/ , require('./encyclopedia/edible'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)sickness[\/]?$/ , require('./encyclopedia/sickness'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)sickness(\/+)\w+/ , require('./encyclopedia/sickness'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)lifestyle[\/]?$/ , require('./encyclopedia/lifestyle'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)lifestyle(\/+)\w+/ , require('./encyclopedia/lifestyle'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)genetic[\/]?$/ , require('./encyclopedia/genetic'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)genetic(\/+)\w+/ , require('./encyclopedia/genetic'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)other[\/]?$/ , require('./encyclopedia/other'));
router.use(/^\/(fa|en)(\/+)encyclopedia(\/+)other(\/+)\w+/ , require('./encyclopedia/other'));
router.use(/^\/(fa|en)(\/+)medicine(\/+)home[\/]?$/ , require('./medicine/home'));
router.use(/^\/(fa|en)(\/+)fruits(\/+)home[\/]?$/ , require('./fruits/home'));
router.use(/^\/(fa|en)(\/+)plants(\/+)home[\/]?$/ , require('./plants/home'));
router.use(/^\/(fa|en)(\/+)edible(\/+)home[\/]?$/ , require('./edible/home'));
router.use(/^\/(fa|en)(\/+)sickness(\/+)home[\/]?$/ , require('./sickness/home'));
router.use(/^\/(fa|en)(\/+)lifestyle(\/+)home[\/]?$/ , require('./lifestyle/home'));
router.use(/^\/(fa|en)(\/+)genetic(\/+)home[\/]?$/ , require('./genetic/home'));
router.use(/^\/(fa|en)(\/+)other(\/+)home[\/]?$/ , require('./other/home'));
router.use(/^\/(fa|en)(\/+)online_services(\/+)home[\/]?$/ , require('./online_services/home'));
router.use(/^\/(fa|en)(\/+)online_services(\/+)temperament[\/]?$/ , require('./online_services/temperament'));
router.use(/^\/(fa|en)(\/+)stuff(\/+)notTranslated[\/]?$/ , require('./stuff/notTranslated'));
router.use(/^\/(fa|en)(\/+)stuff(\/+)500[\/]?$/ , require('./stuff/500'));

// Routing - panel
router.use(/^\/(fa|en)\/panel/ , require('./panel/'));
router.use(/^\/(fa|en)\/panel\// , require('./panel/'));

// 404 happend
router.use(require('./stuff/404'));
module.exports = router;
