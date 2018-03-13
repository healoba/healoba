"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckEdArAccess);

router.route('/')
.get(function(req , res)
{
	let title = 'پنل هیلوبا. صفحه ی اصلی';
	res.render("panel/encyclopedia/editArt",
	{
		title: title
	});
});

module.exports = router;
