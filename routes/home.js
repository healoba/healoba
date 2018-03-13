"use strict";

let DBMain = require(consV.methods.db.main);
let middlewares = require(consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	async.parallel
	([
		function (callback)
		{
			DBMain.last_article( null , req.params[0] , function(err, LA)
			{
				LA.url.push('/' + req.params[0] + '/encyclopedia');
				LA.url.reverse();
				LA.url = LA.url.join('/');
				callback(err , LA);
			});
		},
		function (callback)
		{
			DBMain.today_article(req.params[0], function(err, TA)
			{				
				if(err)
				{
					console.error( new Error( `#Today Artilce Problem. err=${err}`) );
					callback(err);
				}
				else
				{
					TA.url.push('/' + req.params[0] + '/encyclopedia');
					TA.url.reverse();
					TA.url = TA.url.join('/');
					callback(err , TA);
				}
			});
		},
		function (callback)
		{
			DBMain.slideshowInf("home", req.params[0], function(err, doc)
			{
				if(err)
				{
					console.error( new Error( `#SlideShow Problem. err=${err}`) );
					callback(err);
				}
				else
				{
					doc.forEach(function(el , index)
					{
						let Surl = el.url;
						Surl.push('/' + req.params[0] + '/encyclopedia');
						Surl.reverse();
						doc[index].url = Surl.join('/');
					});
					callback(err , doc);
				}
			});
		}
	],
	function (err , results)
	{
		if(err)
		{
			res.status(500).render('stuff/500');
			return;
		}
		let title = "هیلوبا، دانشنامه ی طب سنتی، اسلامی";		
		res.render("home" ,
		{
			title: title,
			slideshows: results[2],
			LA: results[0],
			TA: results[1]
		});
	});
});

module.exports = router;
