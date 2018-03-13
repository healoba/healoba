"use strict";

let database = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let async = require('async');

function create_edit_draft_art(spaceFolderName, TreeTitle, Content, Tags, License, Lang, userId, cbf)
{
	database.GetConn(function(db)
	{
		let collection = db.collection(consV.database.draft.CollName);
		let tags = "tags." + Lang;
		let content = "content." + Lang;
		let treeTitle = "treeTitle." + Lang;

		collection.findOneAndUpdate
		({
			"spaceFolderName": spaceFolderName
		},
		{
			$set:
			{
				"parent": null,
				"spaceFolderName": spaceFolderName,
				"URLName": null,
				[treeTitle]: TreeTitle,
				[content]: Content,
				[tags]: Tags,
				"license": License,
				"resources": {},
				"approved_by_users": [userId],
				"rejected_by_users": {},
				"owners" : [userId],
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
	});
}

function edit_art_by_spaceFName(spaceFolderName, TreeTitle, Content, Tags, License, Lang, userId, cbf)
{
	database.GetConn(function(db)
	{
		art_coll_by_spaceFName(spaceFolderName , function(err, coll)
		{
			if(err)
			{
				cbf(err);
			}
			if(coll == null)
			{
				cbf(true, coll);
				return;
			}
			let collection = db.collection(coll);
			let tags = "tags." + Lang;
			let content = "content." + Lang;
			let treeTitle = "treeTitle." + Lang;

			collection.findOneAndUpdate
			({
				"spaceFolderName": spaceFolderName
			},
			{
				$set:
				{
					"spaceFolderName": spaceFolderName,
					[treeTitle]: TreeTitle,
					[content]: Content,
					[tags]: Tags,
					"license": License,					
					"date" : new Date()
					// "owners" : [userId]
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				cbf(err, result.value);
			});
		});
	});
}

function edit_place_art_by_ID(nodeId, parentNodeId, URLName, cbf)
{
	database.GetConn(function(db)
	{
		database.node_coll_by_Id(nodeId , function(err, coll)
		{
			let collection = db.collection(coll);
			let node_id = new ObjectID (nodeId);
			let parent_node_id;
			if(parentNodeId == null)
			{
				parent_node_id = null;
			}
			else
			{
				parent_node_id = new ObjectID (parentNodeId);
			}

			collection.findOneAndUpdate
			({
				_id: node_id
			},
			{
				$set:
				{
					parent: parent_node_id,
					URLName: URLName
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				else
				{
					console.log("#Mongo. Article Edited.".yellow);
				}
				cbf(err, result.value);
			});
		});
	});
}

function check_editPerm_by_spaceFName(user_id, spaceFolderName, cbf)
{
	article_by_spaceFName(spaceFolderName, function (err, art)
	{
		if(err)
		{
			cbf(err);
		}
		else if(art == null)
		{
			cbf(null, true);
		}
		else if( art.owners.indexOf(user_id) != -1 )
		{
			cbf(null, true);
		}
		else
		{
			cbf(null, false)
		}
	});
}

function check_placePerm(user_id, art_id, cbf)
{
	database.GetConn(function(db)
	{
		database.nodeInfCObj(art_id, function(err , art)
		{
			if(err)
			{
				cbf(err);
			}
			else if( art.owners.indexOf(user_id) != -1 )
			{
				cbf(null, true);
			}
			else
			{
				cbf(null, false)
			}
		});
	});
}

function AArt(nodeId, nodeEnc, user_Id, cbf)
{
	database.GetConn(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$addToSet:
			{
				"approved_by_users": user_Id
			},
			$unset:
			{
				[rbuUId]: ""
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
				console.log("#Mongo. Article Edited. approve".yellow);
			}
			cbf(err);
		});
	});
}

function RArt(nodeId, nodeEnc, user_Id, RAText, cbf)
{
	database.GetConn(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$pull:
			{
				"approved_by_users": user_Id
			},
			$set:
			{
				[rbuUId]: RAText
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
				console.log("#Mongo. Article Edited. reject article".yellow);
			}
			cbf(err);
		});
	});
}

function NOArt(nodeId, nodeEnc, user_Id, cbf)
{
	database.GetConn(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$pull:
			{
				"approved_by_users": user_Id,
			},
			$unset:
			{
				[rbuUId]: ""
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
				console.log("#Mongo. Article Edited. reject article".yellow);
			}
			cbf(err);
		});
	});
}

function replace_art(Enc, nodeId, parentNodeId, URLName, cbf)
{
	var old_coll = null;
	database.GetConn(function(db)
	{
		async.waterfall
		([
			function (callback)
			{
				database.node_coll_by_Id(nodeId , function(err, coll)
				{
					old_coll = coll;
					callback(null);
				});
			},
			function (callback)
			{
				edit_place_art_by_ID(nodeId, parentNodeId, URLName, function (err , res)
				{
					callback(err , res);
				});
			},
			function(doc, callback)
			{
				var collection = db.collection(old_coll);
				collection.deleteOne(
				{
					"_id": doc._id
				},
				function(err , result)
				{
					callback(err , doc);
				});
			},
			function(doc, callback)
			{
				var collection = db.collection(Enc);
				collection.insertOne(doc,
				function(err , result)
				{
					callback(err , consV.codes.db.success);
				});
			},
			function(doc, callback)
			{
				let nodeIdOBJ = new ObjectID (nodeId);
				database.IsFnode(nodeIdOBJ, old_coll, function (err, nS)
				{
					async.forEachOf(nS , function(el , index , callb)
					{
						replace_art(Enc, el._id.valueOf().toString(), nodeId, el.URLName, function(err, r)
						{
							callb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error("#check it. message: %s".red, err) );
						}
						callback(err , consV.codes.db.success);
					});
				});
			}
		],
		function (err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else
			{
				console.log("#Mongo. Article replaced.".yellow);
			}
			cbf(err, result);
		});
	});
}

function drafts(cbf)
{
	database.GetConn(function(db)
	{
		var collection = db.collection('draft');
		collection.find().toArray(function(err , drafts)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, drafts);
		});
	});
}

function article_approves(nodeId, nodeEnc, cbf)
{
	database.GetConn(function(db)
	{
		var collection = db.collection(nodeEnc);
		collection.findOne( { "_id" : nodeId } , function(err , art)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			let users = [];
			async.forEachOf(art.approved_by_users , function(el , index , callback)
			{
				database.nodeInfCObj(el, function(err , user)
				{
					if(err)
					{
						return callback(err);
					}
					else
					{
						let Muser = {};
						Muser.email = user.email;
						Muser.name = user.name;
						Muser.family = user.family;
						users.push(Muser);
					}
					callback(null);
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
				}
				cbf(err, users);
			});
		});
	});
}

function article_resources_WUsersAResInfo(nodeId, nodeEnc, cbf)
{
	database.GetConn(function(db)
	{
		var collection = db.collection(nodeEnc);
		collection.findOne( { "_id" : nodeId } , function(err , art)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			let users = {};
			async.forEachOf(art.resources , function(value , key , callB)
			{
				async.forEachOf(value.content_user , function(v , k , callback)
				{
					database.nodeInfCObj(k, function(err , user)
					{
						if(err)
						{
							return callback(err);
						}
						else if(user == null)
						{
							console.error( new Error(`#article. #article_resources_WUsersAResInfo function. user not found. message: ${err}`.red) );	
						}
						else
						{
							let Muser = {};
							Muser.email = user.email;
							Muser.name = user.name;
							Muser.family = user.family;
							users[k] = Muser;
						}
						callback(null);
					});
				},
				function (err)
				{
					if(err)
					{
						console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
					}
					callB(err);
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
				}
				database.resources(function(err, res)
				{
					cbf(err, [art.resources, users, res]);
				});
			});
		});
	});
}

function addEditArtResources(nodeId, nodeEnc, userId, resources, cbf)
{
	database.GetConn(function(db)
	{
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		
		async.forEachOf(resources , function(value , key , callB)
		{
			let Res = "resources." + key + ".content_user." + userId;
			collection.findOneAndUpdate
			({
				_id: node_id
			},
			{
				$set:
				{
					[Res]: value
				}
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				callB(err);
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
			}
			cbf(err);
		});
	});
}

function delArtResources(nodeId, nodeEnc, userId, resId, cbf)
{
	database.GetConn(function(db)
	{
		async.series
		([
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let Res = "resources." + resId + ".content_user." + userId;
				collection.findOneAndUpdate
				({
					_id: node_id
				},
				{
					$unset:
					{
						[Res]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			},
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let CU = "resources." + resId + ".content_user";
				collection.findOneAndUpdate
				({
					_id: node_id,
					[CU]: {}
				},
				{
					$unset:
					{
						[CU]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			},
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let RE = "resources." + resId;
				collection.findOneAndUpdate
				({
					_id: node_id,
					[RE]: {}
				},
				{
					$unset:
					{
						[RE]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			}
		],
		function (err, result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err);
		});
		
	});
}

function article_by_spaceFName(spaceFolderName, cbf)
{
	database.GetConn(function(db)
	{
		art_coll_by_spaceFName(spaceFolderName , function(err, coll)
		{
			if(err)
			{
				cbf(err);
				return;
			}
			if(coll == null)
			{
				cbf(null, coll);
				return;
			}
			let collection = db.collection(coll);
			collection.findOne( { "spaceFolderName" : spaceFolderName } , function(err , art)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				cbf(err, art);
			});
		});
	});
}

function art_coll_by_spaceFName(spaceFolderName, cbf)
{
	database.GetConn(function(db)
	{
		var coll = null;
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callback)
		{
			var collection = db.collection(el);
			collection.findOne( { "spaceFolderName" : spaceFolderName } , function(err , art)
			{
				if(err)
				{
					return callback(err);
				}
				else if(art)
				{
					coll = consV.database.enc.allEncsColls[index];
				}
				callback(null);
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(coll == null)
			{
				// console.log( "#Mongo. Coudnt find article collection" );
			}
			cbf(err, coll);
		});
	});
}

exports.create_edit_draft_art = create_edit_draft_art;
exports.edit_art_by_spaceFName = edit_art_by_spaceFName;
exports.edit_place_art_by_ID = edit_place_art_by_ID;
exports.check_editPerm_by_spaceFName = check_editPerm_by_spaceFName;
exports.check_placePerm = check_placePerm;
exports.AArt = AArt;
exports.RArt = RArt;
exports.NOArt = NOArt;
exports.replace_art = replace_art;
exports.drafts = drafts;
exports.article_approves = article_approves;
exports.article_resources_WUsersAResInfo = article_resources_WUsersAResInfo;
exports.addEditArtResources = addEditArtResources;
exports.delArtResources = delArtResources;