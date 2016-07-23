var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();

var mongodbURL = 'mongodb://bob840312:bob0932233875@ds023624.mlab.com:23624/cram';

var myDB;
mongodb.MongoClient.connect(mongodbURL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		myDB = db;
		console.log('connection success');
	}
});


//將帳號、密碼、名稱存入login資料庫
app.get('/api/insert', function(request, response) {
	var item = {
		user : request.query.user,
		password : md5(request.query.password),
		desc : request.query.desc
	}
	var collection = myDB.collection('login');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		}else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});


app.get('/api/queryDataPoint',function(request,response){
	var items = {
		user : request.query.user,
		password : request.query.password,
		desc : request.query.desc
	}
	var collection = myDB.collection('login');
	collection.find({user : request.query.user}, {password: 1, _id: 1, desc: 1}).toArray(function(err, docs) {
	if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});

	app.use(express.static(__dirname+'/public'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));



