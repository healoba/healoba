"use strict";

// Set consV In Global
global.consV = require('./constantVars');

let express = require("express");
let fileupload = require('express-fileupload');
let session = require('express-session');
let redis = require('redis');
let redis_store = require('connect-redis')(session);
let body_parser = require('body-parser');
let cookie_parser = require('cookie-parser');
let mongo = require(consV.methods.db.main);
let i18n = require('i18n');
let path = require('path');
let helper = require(consV.methods.helper);
let ejs = require('ejs'); // Create Client Javascript Files.
let fix_maintain = require(consV.methods.fix_or_maintain); // Fixing Stuff 
let colors = require('colors'); // Probablly Just For Developing

// Client Javascript Files.
let list = helper.directoryListRecursive('./files/js/eJS/' , []);
list.forEach(function (file)
{
	ejs.renderFile(file , function (err, str)
	{
		helper.createFile(file.replace('./files/js/eJS/','./files/js/JS/') , str);
	});	
});

// express object
let health = express();

// File Upload
health.use(fileupload());

// Session manager
let RedisClient = redis.createClient();
health.use(session
({
	store: new redis_store({client: RedisClient}),
	secret: 'Free',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 100000000 }
}));

// i18n
health.use(i18n.init);

i18n.configure
({
	locales: ['fa' , 'en'],
	directory: __dirname + '/files/locales',
	defaultLocale: 'fa'
});

// Views directory
health.set('views' , __dirname + '/site/');

// View engine
health.set('view engine' , 'ejs');

// Files
health.use(express.static('files'));
health.use(express.static('files/images'));
health.use(express.static('space'));

// Body parseer
health.use( body_parser.json({limit: '200mb'}) );
health.use( body_parser.urlencoded({ limit: '200mb', extended: true }) );

// Cookie parser
health.use( cookie_parser() );

// Connect to mongodb
mongo.db_connect(function ()
{
	// Fix Or Maintain
	fix_maintain.addAdminAsOwnerToAllArts();
	fix_maintain.isEveryArticleHaveItsFolder();
	fix_maintain.deleteOrphanFolders();
	fix_maintain.deleteDeletedResources();
	fix_maintain.deltedDeltedNonArtTelArts();
	fix_maintain.lostArticles();
	fix_maintain.deleteDeletedUsers();
	// fix_maintain.checkAllLinksInArts();

	// Routing
	health.use(require('./routes/routes.js'));
	
	// Server
	health.listen(3000 , '0.0.0.0', function()
	{
		console.log("#Server. Server Is Running Fine On 3000".green);
	});
});
