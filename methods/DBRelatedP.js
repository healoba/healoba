"use strict";

let database = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let async = require('async');

function telNonArts(cbf)
{
	database.GetConn(function(db)
	{
		let collection = db.collection(consV.database.telegram.CollName);

		collection.findOne
		({
			"_id": "non_arts"
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

function telNonArtDel(nodeId, cbf)
{
	database.GetConn(function(db)
	{
		let collection = db.collection(consV.database.telegram.CollName);
		collection.findOneAndUpdate
		({
			"_id": "non_arts"
		},
		{
			$pull:
			{
				"list": nodeId
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

function telNonArtAdd(nodeId, cbf)
{
	if(nodeId == "" || nodeId == null || typeof nodeId == "undefined")
	{
		return cbf(true);
	}	
	database.GetConn(function(db)
	{
		let collection = db.collection(consV.database.telegram.CollName);
		collection.findOneAndUpdate
		({
			"_id": "non_arts"
		},
		{
			$addToSet:
			{
				"list": nodeId
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

exports.telNonArts = telNonArts;
exports.telNonArtDel = telNonArtDel;
exports.telNonArtAdd = telNonArtAdd;
