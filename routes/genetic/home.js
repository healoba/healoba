"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	let nodeId = null;
	async.series
	([
		function (callback)
		{
			DBMain.last_article( consV.database.enc.genetic.CollName , req.params[0], function(err, LA)
			{
				if(err || typeof LA == 'undefined')
				{
					callback(null , LA);					
				}
				else
				{
					nodeId = LA._id;
					callback(null , LA);
				}
			});
		},
		function (callback)
		{
			DBMain.slideshowInf("genetic_home", req.params[0], function(err, doc)
			{
				doc.forEach(function(el , index)
				{
					let Surl = el.url;
					Surl.push('/' + req.params[0] + '/encyclopedia');
					Surl.reverse();
					doc[index].url = Surl.join('/');
				});
				callback(err , doc);
			});
		},
		function (callback)
		{
			DBMain.url_by_NodeId(nodeId, consV.database.enc.genetic.CollName, function(err , url)
			{
				if(err || (url == null) )
				{
					callback( consV.codes.db.Error );
				}
				else
				{
					url.push('/' + req.params[0] + '/encyclopedia');
					url.reverse();
					url = url.join('/');
					callback( null, url );
				}
			});
		}
	],
	function (err , results)
	{
		let title = "پرتال دانشنامه ی ژنتیک . هیلوبا";
		res.render("genetic/home" ,
		{
			title: title ,
			slideshows: results[1],
			LA: results[0],
			url: results[2]
		});
	});
});

module.exports = router;
