"use strict";

let i18n = require('i18n');
let DBArticles = require( consV.methods.db.articles);
let async = require('async');


function isSessCreated(req , res , next)
{
	if( typeof req.session == 'undefined')
	{
		res.redirect('/');
		next(new Error('Access denied.'.red));
	}
	next();
}

//**************** Permision & Access ****************\\
function CheckLogedIn(req , res , next)
{
	let sess = req.session;
	if( sess.logged != true)
	{
		res.redirect('/' + req.params[0] + consV.pages.signIn);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckHelperAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.helpers != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckPanelAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.panel != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckSpaceAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.space != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckUpArAccess (req , res , next)
{
	let sess = req.session;
	async.series
	([
		function (callback)
		{
			if( sess.user.permissions.update_art != true )
			{
				res.redirect('/' + req.params[0]);
				callback(true);
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBArticles.check_editPerm_by_spaceFName(sess.user._id,
			req.body.spaceFolderName, function (err, perm)
			{
				if(err)
				{
					res.send( consV.codes.db.Error.toString() );
				}
				else if(perm == false)
				{
					err = true;
					res.send( consV.codes.notAllowed.toString() );
				}
				callback(err);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			next(new Error('Access denied.'.red));
		}
		else
		{
			next();
		}
	});
}

function CheckUploadFFArAccess (req , res , next)
{
	let sess = req.session;
	async.series
	([
		function (callback)
		{
			let splite = req.body.spaceFolderAddress.match(/[^\/]+/ig);
			let spaceFolderName= splite[splite.length-1];
			DBArticles.check_editPerm_by_spaceFName(sess.user._id,
			spaceFolderName, function (err, perm)
			{
				if(err)
				{
					res.send( consV.codes.db.Error.toString() );
				}
				else if(perm == false)
				{
					err = true;
					res.send( consV.codes.notAllowed.toString() );
				}
				callback(err);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			next(new Error('Access denied.'.red));
		}
		else
		{
			next();
		}
	});
}

function CheckCrArAccess(req , res , next)
{
	let sess = req.session;	
	if( sess.user.permissions.create_art != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckGlPlArAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.place_art != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckPlArAccess(req , res , next)
{
	let sess = req.session;
	DBArticles.check_placePerm(sess.user._id,
	req.body.placeArtnodeId, function (err, perm)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else if(perm == false)
		{
			res.send( consV.codes.notAllowed.toString() );
			next(new Error('Access denied.'.red));
		}
		else
		{
			next();
		}
	});
}

function CheckEdArAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.edit_art != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function CheckDlArAccess (req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.delete_art != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function checkApArAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.approve_art != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function checkAddResArAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.add_res_art != true )
	{
		res.send( consV.codes.notAllowed.toString() );
		next(new Error('Access denied.'.red));
	}
	next();
}

function checkEncTreeAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.enc_tree != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function checkPageStuffAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.pages_stuff != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

function checkAdminStuffAccess(req , res , next)
{
	let sess = req.session;
	if( sess.user.permissions.admin_stuff != true )
	{
		res.redirect('/' + req.params[0]);
		next(new Error('Access denied.'.red));
	}
	next();
}

//**************** Create & Set Useful Variables ****************\\
function CreLasUrs(req , res , next)
{
	let url = req.originalUrl;
   let splite = url.match(/[^\/]+/ig);
	if(splite[0] == 'en')
	{
		res.locals.EnLaUrl = req.originalUrl;
		splite[0] = 'fa';
		splite = '/' + splite.join('/');
    	res.locals.FaLaUrl = splite;
	}
	else if(splite[0] == 'fa')
	{
    	res.locals.FaLaUrl = req.originalUrl;
		splite[0] = 'en';
		splite = '/' + splite.join('/');
		res.locals.EnLaUrl = splite;
	}
	next();
}

function CreLangVar(req , res , next)
{
	let url = req.originalUrl;
   let splite = url.match(/[^\/]+/ig);
	res.locals.lang = splite[0];
	next();
}

function SpSes(req , res , next)
{
	res.locals.sess = req.session;
	next();
}

function SpI18n(req , res , next)
{
	res.locals.i18n = i18n;
	next();
}

function SpPIm(req , res , next)
{
	let crypto = require('crypto');
	res.locals.profileImage = 'https://www.gravatar.com/avatar/' +
	crypto.createHash('md5').update(req.session.user.email).digest('hex');
	next();
}

//**************** Set Settings ****************\\
function setLocaleGlo(req , res , next)
{
	let url = req.originalUrl;
   let splite = url.match(/[^\/]+/ig);
	i18n.setLocale(splite[0]);
	next();
}


exports.isSessCreated = isSessCreated;
exports.CheckLogedIn = CheckLogedIn;
exports.CheckHelperAccess = CheckHelperAccess;
exports.CheckPanelAccess = CheckPanelAccess;
exports.CheckSpaceAccess = CheckSpaceAccess;
exports.CheckUpArAccess = CheckUpArAccess;
exports.CheckUploadFFArAccess = CheckUploadFFArAccess;
exports.CheckCrArAccess = CheckCrArAccess;
exports.CheckGlPlArAccess = CheckGlPlArAccess;
exports.CheckPlArAccess = CheckPlArAccess;
exports.CheckEdArAccess = CheckEdArAccess;
exports.CheckDlArAccess = CheckDlArAccess;
exports.checkApArAccess = checkApArAccess;
exports.checkAddResArAccess = checkAddResArAccess;
exports.checkEncTreeAccess = checkEncTreeAccess;
exports.checkPageStuffAccess = checkPageStuffAccess;
exports.checkAdminStuffAccess = checkAdminStuffAccess;
exports.CreLasUrs = CreLasUrs;
exports.CreLangVar = CreLangVar;
exports.SpSes = SpSes;
exports.SpI18n = SpI18n;
exports.SpPIm = SpPIm;
exports.setLocaleGlo = setLocaleGlo;
