"use strict";

let mongodb = require('mongodb');
let ObjectID = require('mongodb').ObjectID;
let async = require('async');
let Tree = require('node-tree-data');
let ups = require('../UsPs');

let mongoClient = mongodb.MongoClient;

let db;
let cbfs = [];
async function db_connect(cbf)
{
	let dbName = 'health';
	let mongo_server_address = 'localhost:27017/' + dbName;
	let url = 'mongodb://'+ ups.mongo_username + ':' + ups.mongo_password + '@' + mongo_server_address;

	// var mlab_server_address = 'ds157298.mlab.com:57298/' + dbName;
	// var url = 'mongodb://'+ ups.mlab_username + ':' + ups.mlab_password + '@' + mlab_server_address;

	await mongoClient.connect(url , function(err , DbConn)
	{
		if(err)
		{			
			console.error( new Error(`#Mongo #FIXME. Cannot connect to mongodb. message: ${err}`.red) );
		}
		else
		{
			db = DbConn;
			process.nextTick(function ()
			{
				for (var i = 0; i < cbfs.length; i++)
				{				
					cbfs[i](DbConn);			
				}
				cbfs = null;
			});
			console.log("#Mongo. Successfully connected to mongodb".green);
			cbf();
			// DbConn.close();
		}
	});
}

function GetConn(cb)
{
	if(db)
	{
		process.nextTick(function()
		{
			cb(db);
		});
	}
	else
	{
		cbfs.push(cb);
	}
}

function signUp(email , password , Lang , cbf)
{
	let collection = db.collection('users');
	collection.insertOne
	({
		"username" : null,
		"password" : password,
		"email" : email,
		"name" : null,
		"family" : null,
		"Lang": Lang,
		"date" : new Date(),
		"permissions" :
		{
			"panel" : false,
			"create_art" : false,
			"place_art": false,
			"edit_art": false,
			"update_art": false,
			"delete_art": false,
			"approve_art": false,
			"add_res_art": false,
			"enc_tree": false,
			"pages_stuff": false,
			"admin_stuff": false,
			"helpers": false,
			"space": false
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			cbf(err, consV.codes.db.Error);
		}
		else
		{
			cbf(null, result.ops[0]);
		}
	});
}

function usersList(cbf)
{
	let collection = db.collection('users');
	collection.find().toArray(function(err , users)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(users == null)
		{
			console.log("#Mongo. Can not find user document.");
		}
		cbf(err, users);
	});
}

function userInfo(email , password , cbf)
{
	let collection = db.collection('users');

	collection.findOne( { email : email, password : password } , function(err , user)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(user == null)
		{
			console.log("#Mongo. Can not find user document.");
		}
		else if(user)
		{
			// console.log("#Mongo. user document finded");
		}
		cbf(err, user);
	});
}

function deleteUser(nodeId , cbf)
{
	let collection = db.collection('users');
	let node_id = new ObjectID (nodeId);

	collection.findOneAndDelete
	({
		_id: node_id
	},
	function(err, res)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else
		{
			console.log("#Mongo. user Deleted.".yellow);
		}
		cbf(err, res.value);
	});
}
function setUserPerm(nodeId, perms, cbf)
{
	delete perms.nodeId;	
	nodeId = new ObjectID (nodeId);	
	let collection = db.collection('users');
	collection.findOneAndUpdate
	({
		'_id' : nodeId
	},
	{
		$set:
		{
			'permissions': perms
		}
	},
	function(err , user)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(user == null)
		{
			console.log("#Mongo. Can not find user document.");
		}
		cbf(err, user);
	});
}

function emailInf(email , cbf)
{
	let collection = db.collection('users');
	collection.findOne( { "email" : email } , function(err , user)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(user == null)
		{
			console.log("#Mongo. Can not find email");
		}
		cbf(err, user);
	});
}

function slideshowInf(page, Lang, cbf)
{
	async.waterfall
	([
		function (callback)
		{
			let collection = db.collection('site');

			collection.findOne( { "_id" : "slideshows" } , function(err , doc)
			{
				if(doc == null)
				{
					err = true;
				}
				callback(err , doc);
			});
		},
		function (doc , callback)
		{
			async.forEachOf(doc[page][Lang] , function(el , index , callb)
			{				
				url_by_NodeId_NoObj_NoColl(el.art_id.valueOf().toString() , function (err, url)
				{
					if(err)
					{
						return callb(err);
					}
					else
					{
						doc[page][Lang][index].url = url;
					}
					callb(null);
				});
			},
			function (err)
			{
				callback(err , doc[page][Lang]);
			});
		}
	],
	function (err , doc)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf( err, doc );
	});
}

function slideshowInfSpecifySN(page, Lang, SN, cbf)
{
	let collection = db.collection('site');	
	collection.findOne( { "_id" : "slideshows" } , function(err , doc)
	{
		if(err || (doc == null))
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, doc[page][Lang][SN]);
	});
}


function setSlideshowInf(Page, Lang, SlideNumber, Alts, Title, NodeId, Image_add, cbf)
{
	let collection = db.collection('site');
	let title = Page + '.' + Lang + '.' + SlideNumber + '.title';
	let image_add = Page + '.' + Lang + '.' + SlideNumber + '.image_add';
	let image_alt = Page + '.' + Lang + '.' + SlideNumber + '.image_alt';
	let art_id = Page + '.' + Lang + '.' + SlideNumber + '.art_id';
	NodeId = new ObjectID (NodeId);	
	collection.findOneAndUpdate
	({
		_id: 'slideshows'
	},
	{
		$set:
		{
			[title]: Title,
			[image_add]: Image_add,
			[image_alt]: Alts,
			[art_id]: NodeId,
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err);
	});
}

function setLegInf(Title, Content, Tags, Lang, cbf)
{
	let collection = db.collection(consV.database.site.CollName);
	let tags = "tags." + Lang;
	let content = "content." + Lang;
	let title = "title." + Lang;

	collection.findOneAndUpdate
	({
		"_id": "leg"
	},
	{
		$set:
		{
			[title]: Title,
			[content]: Content,
			[tags]: Tags,
			"date" : new Date()
		}
	},
	{
		returnOriginal: false,
		upsert: true
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, result.value);
	});
}

function last_article(collections, lang, cbf)
{
	let lastArticles = [];
	if( collections == null)
	{
		collections = consV.database.enc.EncsColls;
	}
	else
	{
		collections = [collections];
	}	
	async.forEachOf(collections , function(el , index , callback)
	{
		let collection = db.collection(el);
		let contentQ = "content." + lang;
		let treeTitleQ = "treeTitle." + lang;
		collection.find
		({
			[contentQ]:
			{
				$exists: true,
				$nin: [null,'']
			},
			[treeTitleQ]:
			{
				$exists: true,
				$nin: [null,'']
			}
		})
		.sort({"date" : -1}).limit(1).toArray(function(err , LA)
		{
			if(err)
			{
				return callback(err);
			}
			else if(LA.length != 0)
			{
				lastArticles.push([LA[0] , el]);
			}
			callback(null);
		});
	},
	function (err)
	{
		if(err)
		{
			console.error( new Error(`#Error. message: ${err}`.red) );
			cbf(err);
		}
		else if(lastArticles.length != 0)
		{
			lastArticles.sort(function (a , b)
			{
				return b[0].date.getTime() - a[0].date.getTime();
			});
			url_by_NodeId(lastArticles[0][0]._id, lastArticles[0][1], function (err, url)
			{
				lastArticles[0][0].url = url;
				cbf(err, lastArticles[0][0]);
			});
		}
		else
		{
			console.error( new Error(`#Warning. The ${collections} is empty of article: ${err}`.red) );			
			cbf(err);
		}
	});
}

function today_article(pageLang, cbf)
{
	let collection = db.collection('site');
	async.waterfall
	([
		function (callback)
		{
			collection.findOne( {"_id":"today_article"} , function(err , Today_article_info)
			{
				if( Today_article_info == null )
				{
					err = true;
				}
				callback(err ,Today_article_info[pageLang].collection , Today_article_info[pageLang].node_id);
			});
		},
		function (coll, node_id, callback)
		{
			url_by_NodeId(node_id , coll , function (err, url)
			{
				callback(err, coll, node_id, url);
			});
		},
		function (coll , node_id , url, callback)
		{
			collection = db.collection(coll);
			collection.findOne( {"_id" : node_id} , function(err , TA)
			{
				if( TA == null )
				{
					err = true;
				}
				TA.url = url;
				callback(err ,TA);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, result);
	});
}

function set_today_article(nodeId, Enc, Lang, cbf)
{
	let collection = db.collection('site');
	let langNID = Lang + '.node_id';
	let langNColl = Lang + '.collection';
	collection.findOneAndUpdate
	({
		_id: 'today_article'
	},
	{
		$set:
		{
			[langNID]: nodeId,
			[langNColl]: Enc
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err);
	});
}

function build_tree(coll, node_id, depth, cbf)
{
	let collection = db.collection(coll);

	let tree = new Tree('The_Tree');
	let root = tree.createNode(node_id.valueOf().toString());

	async.parallel
	([
		function (callback)
		{
			collection.findOne({"_id" : node_id } , function(err , doc)
			{
				if(err || doc == null)
				{
					callback(consV.codes.db.Error);
				}
				else if(doc)
				{
					tree.setNodeData(doc , root.id);
					callback(null);
				}
			});
		},
		function (callback)
		{
			let callbackCalled = false;
			let FC_counter = 1;
			let max_dep = 0;
			function rec(node , root , dep)
			{
				max_dep = Math.max(max_dep , dep);
				collection.find({"parent":node}).toArray(function(err , nodes)
				{
					if(depth != -1 && dep >= depth)
					{
						// nothing
					}
					else if(err)
					{
						if(callbackCalled == false)
						{
							callbackCalled = true;
							callback(err);
						}
					}
					else if(nodes.length == 0)
					{
						// console.log("#Mongo. #build_tree function. Can not find node document");
					}
					else if(nodes)
					{
						FC_counter += nodes.length;
						for(var i = 0 ; i < nodes.length ; i++)
						{
							var child = tree.createNode(nodes[i]._id.valueOf().toString() , root.id);
							tree.setNodeData(nodes[i] , child.id);

							rec(nodes[i]._id , child , dep + 1);
						}
					}
					FC_counter--;
					if(FC_counter == 0 && callbackCalled == false)
					{
						callbackCalled = true;
						callback(null , max_dep);
					}
				});
			}
			rec(node_id , root , 0);
		}
	],
	function (err , results)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf( err, tree , results[1] );
	});
}

function build_tree_with_owner_label(coll, node_id, depth, user_id, cbf)
{
	let collection = db.collection(coll);

	let tree = new Tree('The_Tree');
	let root = tree.createNode(node_id.valueOf().toString());

	async.parallel
	([
		function (callback)
		{
			collection.findOne({"_id" : node_id } , function(err , doc)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(true , consV.codes.db.Error);
				}
				else if(doc == null)
				{
					console.error( new Error(`#Mongo #FIXME. Can not find ${node_id} document.`.red ) );
					callback(true , consV.codes.db.docNotFound);
				}
				else if(doc)
				{
					// add an i onwer info to node data
					if( doc.owners.indexOf(user_id) != -1 )
					{
						doc.DI_i_am_owner = true;
					}
					else
					{
						doc.DI_i_am_owner = false;
					}
					// End Of add an i onwer info to node data
					tree.setNodeData(doc , root.id);
					callback(null);
				}
			});
		},
		function (callback)
		{
			let callbackCalled = false;
			let FC_counter = 1;
			let max_dep = 0;
			function rec(node , root , dep)
			{
				max_dep = Math.max(max_dep , dep);
				collection.find({"parent":node}).toArray(function(err , nodes)
				{
					if(depth != -1 && dep >= depth)
					{
						// nothing
					}
					else if(err)
					{
						console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
						if(callbackCalled == false)
						{
							callbackCalled = true;
							callback(true , consV.codes.db.Error);
						}
					}
					else if(nodes.length == 0)
					{
						// console.log("#Mongo. #build_tree function. Can not find node document");
					}
					else if(nodes)
					{
						FC_counter += nodes.length;
						for(var i = 0 ; i < nodes.length ; i++)
						{
							var child = tree.createNode(nodes[i]._id.valueOf().toString() , root.id);
							// add an i onwer info to node data
							if( nodes[i].owners.indexOf(user_id) != -1 )
							{
								nodes[i].DI_i_am_owner = true;
							}
							else
							{
								nodes[i].DI_i_am_owner = false;
							}
							// End Of add an i onwer info to node data
							tree.setNodeData(nodes[i] , child.id);
							rec(nodes[i]._id , child , dep + 1);
						}
					}
					FC_counter--;
					if(FC_counter == 0 && callbackCalled == false)
					{
						callbackCalled = true;
						callback(null , max_dep);
					}
				});
			}
			rec(node_id , root , 0);
		}
	],
	function (err , results)
	{
		cbf( err, tree , results[1] );
	});
}

function resources(cbf)
{
	let collection = db.collection('site');
	collection.findOne( { "_id" : 'resources' } , function(err , resources)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		delete resources._id;
		cbf(err, resources);
	});
}

function resInf(resId, cbf)
{
	let collection = db.collection("site");
	collection.findOne({"_id": "resources"} , function (err, resDoc)
	{
		cbf(err , resDoc[resId]);
	});
}

function create_edit_resources(resId, Lang, Type, Name, Family, Writer, URL, Lic, LicO, Ex, ImageName, cbf)
{
	let collection = db.collection("site");
	async.waterfall
	([
		function (callback)
		{
			if(resId == null || resId == "")
			{
				collection.findOne({"_id": "resources"} , function (err, resDoc)
				{
					let keys = Object.keys(resDoc);
					keys.splice( keys.indexOf("resources"), 1);
					keys.sort(function (a , b)
					{
						return parseInt(b) - parseInt(a);
					});				
					callback( err, parseInt(keys[0])+1 );
				});
			}
			else
			{
				callback( null, resId );
			}
		},
		function (resId, callback)
		{
			let DType = resId + ".type";
			let DName = resId + ".name." + Lang;
			let DFamily = resId + ".family." + Lang;
			let DWriter = resId + ".writer";
			let DURL = resId + ".url";
			let DLicense = resId + ".license";
			let DLicenseC = resId + ".license_custom";
			let DContent = resId + ".content." + Lang;
			let DImageName = resId + ".image";

			collection.findOneAndUpdate
			({
				"_id": "resources"
			},
			{
				$set:
				{
					[DType]: Type,
					[DName]: Name,
					[DFamily]: Family,
					[DWriter]: Writer,
					[DURL]: URL,
					[DLicense]: Lic,
					[DLicenseC]: LicO,
					[DContent]: Ex,
					[DImageName]: ImageName
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				callback(err, result.value[resId] , resId);
			});
		}
	],
	function (err, result, resId )
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}		
		cbf(err, [result, resId]);
	});
	
}

function deleteNode(nodeId, cbf)
{
	let nodeColl = null;
	let nodeParent = null;
	async.series
	([
		function (callback)
		{
			node_coll_by_Id(nodeId, function(err, coll)
			{
				nodeColl = coll;
				callback(null);
			});
		},
		function (callback)
		{
			parentId_by_nodeId(nodeColl, nodeId, function (err, res)
			{
				nodeParent = res;
				callback(null);
			});
		},
		function (callback)
		{
			let collection = db.collection(nodeColl);
			let node_id = new ObjectID (nodeId);
			
			collection.find({"parent":node_id}).toArray(function(err , nodes)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(true , consV.codes.db.Error);
				}
				else if(nodes)
				{
					async.forEachOf(nodes , function(el , index , callb)
					{
						edit_parent_by_id(nodeColl, el._id, nodeParent, function (err)
						{
							if(err)
							{
								return callb(err);
							}
							callb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error("#check it. message: %s".red, err) );
							callback(true, err);
						}
						else
						{
							callback(null);
						}
					});
				}
				else
				{
					callback(null);
				}
			});
		},
		function (callback)
		{
			let collection = db.collection(nodeColl);
			let node_id = new ObjectID (nodeId);

			collection.findOneAndDelete
			({
				_id: node_id
			},
			function(err, res)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				else
				{
					console.log("#Mongo. Article Deleted.".yellow);
				}
				callback(null, res.value);
			});
		}
	],
	function (err , result)
	{
		cbf(err, result[3]);
	});
}

function checkChildDup(nodeId, parentNodeId, URLName, cbf)
{
	node_coll_by_Id(parentNodeId , function(err, coll)
	{
		let collection = db.collection(coll);
		let parentObjectId = new ObjectID (parentNodeId);
		collection.findOne( { parent: parentObjectId, URLName: URLName } , function(err , child)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, child);
		});
	});
}

function IsFnode(nodeId, nodeCol, cbf)
{
	let collection = db.collection(nodeCol);
	collection.find( { parent: nodeId }).toArray(function(err , reSs)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, reSs);
	});
}

function nodeInfCObj(nodeId, cbf)
{
	node_coll_by_Id(nodeId , function(err, coll)
	{
		if(err)
		{
			return cbf(err);			
		}
		else if(coll == null)
		{
			cbf(null, null);
			return;
		}
		let collection = db.collection(coll);
		let node_id = new ObjectID (nodeId);

		collection.findOne( { "_id" : node_id } , function(err , nod)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(nod == null)
			{
				console.log("#Mongo. Can not find node document".yellow);
			}
			cbf(err, nod);
		});
	});
}

function nodeInfNoObjWColl(node_id, coll, cbf)
{
	let collection = db.collection(coll);

	collection.findOne( { "_id" : node_id } , function(err , node)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(node == null)
		{
			console.log("#Mongo. Can not find node document".yellow);
		}
		cbf(err, node);
	});
}

function parentId_by_nodeId(coll, nodeId, cbf)
{
	let collection = db.collection(coll);
	let node_id = new ObjectID (nodeId);

	collection.findOne( { "_id" : node_id } , function(err , art)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(art == null)
		{
			console.error( new Error("#Mongo #FIXME. could not fine node parent. message: %s".red, err) );
		}
		cbf(err, art.parent);
	});
}

function edit_parent_by_id(coll, nodeId, parentNodeId, cbf)
{
	let collection = db.collection(coll);

	collection.findOneAndUpdate
	({
		_id: nodeId
	},
	{
		$set:
		{
			parent: parentNodeId
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else
		{
			console.log("#Mongo. #Article Edit. Parent edited.".yellow);
		}
		cbf(err);
	});
}

function node_coll_by_Id(nodeId, cbf)
{
	let node_id = null;
	try
	{
		node_id = new ObjectID (nodeId);
	}
	catch (error)
	{
		console.error( new Error(`wrong nodeId=${nodeId}. message: ${error}`.red) );
		return cbf(error);		
	}
	let coll = null;
	async.forEachOf(consV.database.allColls , function(el , index , callback)
	{
		let collection = db.collection(el);
		collection.findOne( { "_id" : node_id } , function(err , art)
		{
			if(err)
			{
				return callback(err);
			}
			else if(art)
			{
				coll = consV.database.allColls[index];
			}
			callback(null);
		});
	},
	function (err)
	{
		if(err)
		{
			console.error( new Error("#Error: ".red + err) );
		}
		else if(coll == null)
		{
			console.error( new Error(`#could not found art collection: ${err}`.red ) );
		}
		cbf(err, coll);
	});
}

function nodeId_byPath(address , coll , cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let node_id;
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error("#Mongo #FIXME. Can not find node document.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
				else
				{
					node_id = node._id;
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(null, node_id);
			}
		});
	}
	rec(address[i++], null);
}

function node_byPath(address , coll , cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let NodeInfo;
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.warn( `#Warning. #Mongo. Can not find node document by this address: ${address}`.yellow );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
				else
				{
					NodeInfo = node;
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(null, NodeInfo);
			}
		});
	}
	rec(address[i++], null);
}

function loc_byPath(address , coll , lang, cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let loc_path = [];
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error("#Mongo #FIXME. an error happened. message: %s".red, err) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error( "#Mongo #Wrong_Url. can not find path's node.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;	
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				loc_path.push(node.treeTitle[lang])
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(err, loc_path);
			}
		});
	}
	rec(address[i++], null);
}

function branch_by_NodeId(node_id , coll, lang, cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let branch = [];
	let i = 0;
	let FC_counter = 1;
	function rec(nodeId)
	{
		collection.findOne( {"_id" : nodeId} , function(err , node)
		{
			if(err)
			{
				console.error( new Error("#Mongo #FIXME. an error happened. message: %s".red, err) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error( "#Mongo #Wrong_Url. can not find path's node.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;	
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				branch.push(node);
				if( node.parent != null )
				{
					FC_counter ++;
					rec(node.parent);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				async.forEachOf(branch, function(el, index, callback)
				{
					url_by_NodeId(el._id, coll, function(err , url)
					{
						url.push('/' + lang + '/encyclopedia');
						url.reverse();
						url = url.join('/');
						branch[index].url = url;
						callback(null);
					});
				},
				function (err)
				{
					if(err)
					{
						console.error( new Error("#error: ".red + err) );
					}
					cbf(err, branch);
				});
			}
		});
	}
	rec(node_id);
}

function url_by_NodeId(node_id , collection , cbf)
{
	let coll = db.collection(collection);
	let callbackCalled = false;
	let url = [];

	let i = 0;
	let FC_counter = 1;
	
	function rec(node_id)
	{
		coll.findOne( {"_id" : node_id} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(callbackCalled == false)
				{
					callbackCalled = true;
					cbf(err, null);
				}
			}
			else if(node == null)
			{
				err = true;
				console.log( new Error( `#Mongo. #url_by_NodeId function. Can not find node document. nodeId=${node_id} in collection=${collection}`) );
				if(callbackCalled == false)
				{
					callbackCalled = true;
					cbf(err, null);
				}
			}
			else if(node)
			{
				url.push(node.URLName);
				
				if(node._id.valueOf().toString() != root_id_by_coll_name(collection))
				{
					FC_counter++;
					rec(node.parent);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && callbackCalled == false)
			{
				callbackCalled = true;
				cbf(null, url);
			}
		});
	}
	rec(node_id);
}

function url_by_NodeId_NoObj_NoColl(nodeId , cbf)
{
	node_coll_by_Id(nodeId , function(err, coll)
	{
		if(err)
		{
			return cbf(err);			
		}
		else if(coll == null)
		{
			return cbf(null, null);
		}
		let collection = db.collection(coll);
		let node_id = new ObjectID (nodeId);
		let callbackCalled = false;
		let url = [];
	
		let i = 0;
		let FC_counter = 1;
		
		function rec(node_id)
		{
			collection.findOne( {"_id" : node_id} , function(err , node)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					if(callbackCalled == false)
					{
						callbackCalled = true;
						cbf(err, null);
					}
				}
				else if(node == null)
				{
					console.log( new Error( "#Mongo. #url_by_NodeId_NoObj_NoColl function. Can not find node document") );
				}
				else if(node)
				{
					url.push(node.URLName);
					
					if(node._id.valueOf().toString() != root_id_by_coll_name(coll))
					{
						FC_counter++;
						rec(node.parent);
					}
				}
				FC_counter--;
				if(FC_counter == 0 && callbackCalled == false)
				{
					callbackCalled = true;
					cbf(null, url);
				}
			});
		}
		rec(node_id);
	});
}

function root_id_by_coll_name(coll_name)
{
	if(coll_name == consV.database.enc.medicine.CollName)
	{
		return consV.database.enc.medicine.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.fruits.CollName)
	{
		return consV.database.enc.fruits.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.plants.CollName)
	{
		return consV.database.enc.plants.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.edible.CollName)
	{
		return consV.database.enc.edible.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.sickness.CollName)
	{
		return consV.database.enc.sickness.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.lifestyle.CollName)
	{
		return consV.database.enc.lifestyle.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.genetic.CollName)
	{
		return consV.database.enc.genetic.rootObjId.valueOf().toString();
	}
	else if(coll_name == consV.database.enc.other.CollName)
	{
		return consV.database.enc.other.rootObjId.valueOf().toString();
	}
}

exports.db_connect = db_connect;
exports.GetConn = GetConn;
exports.signUp = signUp;
exports.usersList = usersList;
exports.userInfo = userInfo;
exports.deleteUser = deleteUser;
exports.setUserPerm = setUserPerm;
exports.emailInf = emailInf;
exports.slideshowInf = slideshowInf;
exports.slideshowInfSpecifySN = slideshowInfSpecifySN;
exports.setSlideshowInf = setSlideshowInf;
exports.setLegInf = setLegInf;
exports.last_article = last_article;
exports.today_article = today_article;
exports.set_today_article = set_today_article;
exports.build_tree = build_tree;
exports.build_tree_with_owner_label = build_tree_with_owner_label;
exports.resources = resources;
exports.resInf = resInf;
exports.create_edit_resources = create_edit_resources;
exports.deleteNode = deleteNode;
exports.checkChildDup = checkChildDup;
exports.IsFnode = IsFnode;
exports.nodeInfCObj = nodeInfCObj;
exports.nodeInfNoObjWColl = nodeInfNoObjWColl;
exports.parentId_by_nodeId = parentId_by_nodeId;
exports.node_coll_by_Id = node_coll_by_Id;
exports.node_byPath = node_byPath;
exports.loc_byPath = loc_byPath;
exports.branch_by_NodeId = branch_by_NodeId;
exports.url_by_NodeId = url_by_NodeId;
exports.url_by_NodeId_NoObj_NoColl = url_by_NodeId_NoObj_NoColl;
exports.root_id_by_coll_name = root_id_by_coll_name;

