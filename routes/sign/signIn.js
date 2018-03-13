"use strict";

var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = "هیلوبا، دانشنامه ی طب سنتی، اسلامی";		
	res.render("sign/signIn" ,
	{
		title: title
	});
})
.post(function(req , res)
{
	if(req.body.email == "" || typeof req.body.email == "undefined" ||
    req.body.password == "" || typeof req.body.password == "undefined")
    {
		res.send( '-3' );
		return;
    }
	async.waterfall
	([
		function (callback)
		{
			mongo.userInfo(req.body.email , req.body.password , function(err, user)
			{
				if( err )
				{
					callback(true , consV.codes.db.Error);
				}
				// user is not exist.
				else if( user == null )
				{
					callback(true , consV.codes.db.docNotFound);
				}
				// user is exist.
				else if( user )
				{
					callback(null , user);
				}
			});
		}
	],
	function (err , user)
	{
		// mongodb error happened.
		if( err )
		{
			res.send( user.toString() );
		}
		else 
		{
			req.session.logged = true;
			req.session.user = user;

			res.send( consV.codes.db.success.toString() );
		}
	});
});

module.exports = router;
