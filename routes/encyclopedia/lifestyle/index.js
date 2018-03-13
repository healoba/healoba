"use strict";

let DBMain = require( consV.methods.db.main);
let DBArticles = require( consV.methods.db.articles );
let middlewares = require( consV.methods.middlewares);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('*')
.get(function(req , res, next)
{
	let url = req.originalUrl;
	if(url.indexOf('?') != -1)
	{
		url = url.slice( 0, url.indexOf('?') );
	}
	if(url[url.length-1] == '/')
	{
		url = url.slice(0 , -1);
	}
	let path = url.match(/[^\/]+/ig);
	path.splice(0 , 2);
	
	let target_node_id = null;
	let tree_nodeid = null;
	let branch = null;

	if(typeof req.query.tree_nodeid != "undefined")
	{
		try
		{
			tree_nodeid = new ObjectID (req.query.tree_nodeid);
		}
		catch (error)
		{
			console.error( new Error(`ignoring wrong tree_nodeid=${req.query.tree_nodeid}. message: ${error}`.red) );
		}
	}
	async.series
	([
		function (callback)
		{
			DBMain.node_byPath(path , consV.database.enc.lifestyle.CollName , function(err, resul)
			{
				if(err == true)
				{
					return next();
				}
				else if(err)
				{
					callback(err);
				}
				else if(req.params[0] == 'en' && typeof resul.content.en == 'undefined')
				{
					res.redirect('/' + req.params[0] + consV.pages.notTranslated);
					return;
				}
				else if(req.params[0] == 'fa' && typeof resul.content.fa == 'undefined')
				{
					res.redirect('/' + req.params[0] + consV.pages.notTranslated);
					return;
				}
				else
				{
					target_node_id = resul._id;
					callback(null, resul);
				}
			});
		},
		function (callback)
		{
			if(tree_nodeid == null)
			{
				DBMain.parentId_by_nodeId(consV.database.enc.lifestyle.CollName, target_node_id, function (err, re)
				{
					tree_nodeid = re;
					callback(null);						
				});
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBMain.loc_byPath(path , consV.database.enc.lifestyle.CollName , req.params[0], function(err, loc_path)
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					loc_path.splice(0,1);
					let location = ['دانشنامه' , 'سبک زندگی'].concat(loc_path);
					callback(null, location);
				}
			});
		},
		function (callback)
		{
			DBArticles.article_approves(target_node_id, consV.database.enc.lifestyle.CollName, function(err , ArtApprvs)
			{
				if(err)
				{
					callback(err);
				}
				else if( ArtApprvs == null )
				{
					callback(true , consV.codes.db.docNotFound);
				}
				else
				{
					callback(null , ArtApprvs.length);					
				}
			});
		},
		function (callback)
		{
			DBArticles.article_resources_WUsersAResInfo(target_node_id, consV.database.enc.lifestyle.CollName, function(err , res)
			{
				if(err || res == null)
				{
					callback(consV.codes.db.Error.toString());
				}
				else
				{
					callback(null , res);
				}
			});
		},
		function (callback)
		{
			DBMain.build_tree(consV.database.enc.lifestyle.CollName, tree_nodeid || target_node_id, 4 , function(err, tree , depth)
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					callback(null , tree.json().rootIds , tree.json().nodes);
				}
			});
		},
		function (callback)
		{			
			if(tree_nodeid != null)
			{
				DBMain.url_by_NodeId(tree_nodeid, consV.database.enc.lifestyle.CollName, function(err , url)
				{
					if( url == null )
					{
						err = consV.codes.db.docNotFound;
					}
					url.push('/' + req.params[0] + '/encyclopedia');
					url.reverse();
					url = url.join('/');
					callback(err , url);
				});
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBMain.branch_by_NodeId(target_node_id, consV.database.enc.lifestyle.CollName, req.params[0], function(err , br)
			{
				if( br == null )
				{
					err = consV.codes.db.docNotFound;
				}
				branch = br;
				callback(err, br);				
			});
		},
		function (callback)
		{
			let treeNodeIdIndex;
			branch.forEach(function(el, index)
			{
				if(el._id.valueOf().toString() == tree_nodeid)
				{
					treeNodeIdIndex = index;					
				}
			});
			callback(null, treeNodeIdIndex);
		}
	],
	function(err , result)
	{
		if(err)
		{
			res.status(500).render('stuff/500');
			return;
		}
		let title;	
		if(req.params[0] == 'fa')
		{			
			title = result[0].treeTitle[req.params[0]] + ' . هیلوبا';
		}
		else
		{
			title = result[0].treeTitle[req.params[0]] + ' . Healoba';
		}
		res.render("encyclopedia/lifestyle/home" ,
		{
			title: title,
			location: result[2],
			apRate: result[3].toString(),
			resources: result[4],
			max_depth: 4,
			root_id: result[5][0][0],
			nodes: result[5][1],
			target_node_id: target_node_id,
			base_url: result[6] || url,
			branch: result[7],
			treeNodeIdIndex: result[8]
		});
	});
});

module.exports = router;
