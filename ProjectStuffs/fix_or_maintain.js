"use strict";

let DBMain = require( consV.methods.db.main );
let DBRelatedP = require(consV.methods.db.relatedP);
let DBArticles = require( consV.methods.db.articles);
let space = require( consV.methods.space );
let ObjectID = require('mongodb').ObjectID;
let async = require('async');
let request = require('request');

function addAdminAsOwnerToAllArts()
{
	DBMain.GetConn(function(db)
	{
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callB)
		{
			let collection = db.collection(el);
			let user_id = 
			collection.updateMany
			({},
			{
				$addToSet:
				{
					"owners":
					{
						$each: ["58423ba9dd0fb6146c218339","59afe6cbbd5a340604b9bf1d","5a4cb75f69b805158cf72009"]
					}
						
				}
			},
			function (err, result)
			{
				if(err)
				{
					return callB(err);
				}
				callB(null)
			});
		},
		function (err)
		{
			if(err)
			{
				console.error("check it");
			}
			else
			{
				console.warn('#Fix||Maintain. mlibre added to rhe all arts'.yellow);
			}
		});
	});	
}

function isEveryArticleHaveItsFolder()
{
	artilcesFolders(function (list)
	{
		async.forEachOf(list, function(el, index, cb)
		{
			let res = space.CheckFolder(consV.space.articlesFolderName, el);
			if( res == false )
			{
				console.error( new Error(`#Fix||Maintain. #Error. message: ${consV.space.articlesFolderName}${el} is ${res}`.red) );
				space.CreateFolder(consV.space.articlesFolderName, el, function (err, res)
				{
					if(err)
					{
						console.error( new Error("#Fix||Maintain. Cant craete folder. message: %s".red, err) );
					}
					else
					{
						console.log('#Fix||Maintain. Folder %s %s Created'.green, consV.space.articlesFolderName, el);
					}
					cb(null);
				});
			}
			else
			{
				cb(null);
			}
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s ".red, err) );
			}
		});
	});
}

function deleteOrphanFolders()
{
	let ADList = space.directoryList(consV.space.articlesFolderName);
	artilcesFolders(function (AList)
	{
		ADList.diff(AList).forEach(function(el)
		{
			console.error( new Error(`#Fix||Maintain. Oraphan Folder: ${consV.space.articlesFolderName + el}`.red) );
			space.deleteFolder(consV.space.articlesFolderName, el, function ()
			{
				console.log(consV.space.articlesFolderName.green + el.green, 'deleted'.green);
			});
		}, this);
	});

	let RDList = space.directoryList(consV.space.resourcesFolderName);
	allResources(function (err, keys)
	{		
		RDList.diff(keys).forEach(function(el)
		{
			console.error( new Error(`#Fix||Maintain. Oraphan Folder: ${consV.space.articlesFolderName + el}`.red) );
			space.deleteFolder(consV.space.resourcesFolderName, el, function ()
			{
				console.log('folder %s%s deleted'.green, consV.space.articlesFolderName, el);
			});
		}, this);
	});
}

function deleteDeletedResources()
{
	DBMain.GetConn(function(db)
	{
		let allPossibleResources = [...Array(200).keys()];
		async.waterfall
		([
			function (callback)
			{
				allResources(function (err, reses)
				{
					reses.forEach(function (item, index)
					{
						reses[index] = parseInt(item);
					});
					callback(err, reses);
				});
			},
			function (reses, callback)
			{
				let shouldBeDelete = allPossibleResources.diff(reses);
				let sbdO = {};
				shouldBeDelete.forEach(function (item, index)
				{
					sbdO['resources.' + item] = "";
				});				
				async.forEachOf(consV.database.enc.EncsColls , function(el , index , callB)
				{
					let collection = db.collection(el);
					collection.updateMany
					({},
					{
						$unset: sbdO
					},
					function (err, result)
					{
						if(err)
						{
							return callB(err);
						}
						callB(null)
					});
				},
				function (err)
				{
					callback(err);
				});
			}
		],
		function (err, result)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s ".red, err) );
			}
		});
	});
}

function deleteDeletedUsers()
{
	DBMain.GetConn(function(db)
	{
		async.waterfall
		([
			function (callback)
			{
				DBMain.usersList(function(err , users)
				{
					let usersId = [];
					users.forEach(element => {
						usersId.push(element._id.valueOf().toString());
					});
					callback(err, usersId);
				});
			},
			function (usersId, callback)
			{
				async.forEachOf(consV.database.enc.EncsColls , function(el , index , callB)
				{
					let collection = db.collection(el);
					collection.updateMany
					({},
					{
						$pull:
						{
							owners: 
							{
								$nin: usersId
							},
							approved_by_users: 
							{
								$nin: usersId
							}
						}
					},
					function (err, result)
					{
						if(err)
						{
							return callB(err);
						}
						callB(null)
					});
				},
				function (err)
				{
					callback(err, usersId);
				});
			},
			function (usersId, callback)
			{
				deleteDeletedUsersFromRejected_by_usersField(usersId, function(err)
				{
					callback(err);
				});
			}
		],
		function (err, result)
		{
			if(err)
			{
				console.error( new Error(`#error. message: ${err}`.red) );
			}
		});
	});
}

function deleteDeletedUsersFromRejected_by_usersField(usersId, cbf)
{
	DBMain.GetConn(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						let shbd = Object.keys(el_2.rejected_by_users).diff(usersId);
						let sbdO = {"TEMP" :"TEMP"};
						shbd.forEach(function (item, index)
						{
							sbdO['rejected_by_users.' + item] = "";
						});
						collection.findOneAndUpdate
						({
							_id: el_2._id
						},
						{
							$unset: sbdO
						},
						function(err , result)
						{
							if(err)
							{
								console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
							}
							cb(err);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
			cbf(err);
		});
	});
}

function allResources(cbf)
{
	DBMain.GetConn(function(db)
	{
		let collection = db.collection("site");
		collection.findOne({"_id": "resources"} , function (err, resDoc)
		{
			let keys = Object.keys(resDoc);
			keys.splice( keys.indexOf("resources"), 1);
			cbf(err, keys);
		});
	});
}

function artilcesFolders(cbf)
{
	let spaceFolderNameList = [];
	DBMain.GetConn(function(db)
	{
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log('#Fix||Maintain. %s is empty'.yellow, el);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						spaceFolderNameList.push(el_2.spaceFolderName);
						cb(null);
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error("#error. message: %s".red, err) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
			cbf(spaceFolderNameList);
		});
	});
}

function deltedDeltedNonArtTelArts()
{
	async.waterfall
	([
		function (callback)
		{
			DBRelatedP.telNonArts(function(err , result)
			{
				callback(null, result);
			});
		},
		function (result, callback)
		{
			async.forEachOf(result.list, function(el, index, asFEcb)
			{
				DBMain.nodeInfCObj(el, function(err , art)
				{
					if( art == null )
					{
						DBRelatedP.telNonArtDel(el, function(err , result)
						{
							asFEcb(null);
						});
					}
					else
					{
						asFEcb(null);
					}
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#error: " + ${err}`.red) );
				}
				callback(null, result);
			});
		}
	],
	function (err, result)
	{		
		if(err)
		{
			console.log('Be Nazar Nahsode :))');
		}
	});
}

function lostArticles()
{
	DBMain.GetConn(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						DBMain.url_by_NodeId(el_2._id, el, function (err, url)
						{
							if(err)
							{
								console.log('Find Article With Wrong Parent. Moving To drafts.');
								DBArticles.replace_art(consV.database.draft.CollName, el_2._id, null, null, function(err, result)
								{
									cb(null);
								});
							}
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

function checkAllLinksInArts()
{
	DBMain.GetConn(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						async.forEachOf(el_2.content, function(el_3, index_3, asFEcb)
						{
							let REgFindRes = {};
							REgFindRes = el_3.match(/src="(.*?)"/g);
							if(REgFindRes == null){REgFindRes = {}}
							for( var i = 0 ; i < REgFindRes.length; i++)
							{
								let REgFindResEl = REgFindRes[i];
								REgFindResEl = REgFindResEl.replace(/src="\//g , '');
								REgFindResEl = REgFindResEl.replace(/"/g , '');
								let url = 'https://' + consV.host.domain + '/' + REgFindResEl
								request.get(url , function (error, response, body)
								{
									if(error || response.statusCode == 404)
									{
										console.warn(`Url: ${url} IN ${el_2.treeTitle[index_3]} dose not exist. please check it`);
									}
								});	
							}
							asFEcb(null);
						},
						function (err)
						{
							cb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

exports.addAdminAsOwnerToAllArts = addAdminAsOwnerToAllArts;
exports.isEveryArticleHaveItsFolder = isEveryArticleHaveItsFolder;
exports.deleteOrphanFolders = deleteOrphanFolders;
exports.deleteDeletedResources = deleteDeletedResources;
exports.deleteDeletedUsers = deleteDeletedUsers;
exports.deltedDeltedNonArtTelArts = deltedDeltedNonArtTelArts;
exports.lostArticles = lostArticles;
exports.checkAllLinksInArts = checkAllLinksInArts;