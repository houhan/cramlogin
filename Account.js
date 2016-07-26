var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();

var uri = 'mongodb://houhan:ag460360@ds029745.mlab.com:29745/dbforaccount';

var database;

mongodb.MongoClient.connect(uri, function(err, db) {
	if (err) {
		console.log('connect mongo db error ' + err);
	} else {
		console.log('connect mongo db success');
		database = db;
	}
});

app.get('/api/creatFirst', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var a;
	var name;
	var passwd;
	var endString
	var str = request.query.value;
	var AccountArray = new Array();
	var AccountArray = str.split(",");
	

	var insert = {
		a: AccountArray[0],
		name : AccountArray[1],
		passwd : AccountArray[2]
	};
	
	var items = database.collection('dbforaccount');

	items.insert(insert, function(err, result) {
					if (err) {
					__sendErrorResponse(response, 406, err);
					} else {
						response.type('application/json');
						response.status(200).send("註冊完成!!");
						response.end();
					}
				});
	
});

app.get('/api/createDataPoint', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var a;
	var name;
	var passwd;
	var endString
	var str = request.query.value;
	var AccountArray = new Array();
	var AccountArray = str.split(",");
	

	var insert = {
		a: AccountArray[0],
		name : AccountArray[1],
		passwd : AccountArray[2]
	};
	
	var items = database.collection('dbforaccount');

	items.find().toArray(function (err, docs) {
		var jsArray = new Array();
		var jsArray = docs;
		for(var i = 0; i < jsArray.length; i++){
			var jsObj = Object();
			var jsObj = jsArray[i];
			response.type('application/json');
			if(jsObj.tel == tel){
				response.status(200).send("此帳號已註冊!!");
				response.end();
				break;
			}
			else if(jsObj.tel != tel && i == jsArray.length -1){
				items.insert(insert, function(err, result) {
					if (err) {
					__sendErrorResponse(response, 406, err);
					} else {
						response.type('application/json');
						response.status(200).send("註冊完成!!");
						response.end();
					}
				});
			}
		}
	});
	
});

app.get('/api/queryAccountDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var str = request.query.value;
	var id;
	var passwd;
	var AccountArray = new Array();
	var AccountArray = str.split(",");


	id = AccountArray[0];
	passwd = AccountArray[1];

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(id == jsObj.tel){
					if(passwd == jsObj.passwd){
						response.status(200).send("succeedLogIn");
						response.end();
						break;
					}
					else if(passwd != jsObj.passwd){
						response.status(200).send("WarnPassword");
						response.end();
						break;
					}
				}
				else if(id != jsObj.tel && i == jsArray.length -1){
					response.status(200).send("WarnId");
					response.end();
				}

			}

		}
	});
});

app.get('/api/queryAccountDataPoint', function(request, response) {
	var items = database.collection('login');

	var str = request.query.value;
	var id;
	var password;
	var AccountArray = new Array();
	var AccountArray = str.split(",");


	id = AccountArray[0];
	password = AccountArray[1];

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				response.type('application/json');
				if(id == jsObj.user){
					if(id == jsObj.user && password == jsObj.password){
						response.status(200).send("succeedLogIn");
						response.end();
						break;
					}
					else if(password != jsObj.password){
						response.status(200).send("WarnPassword");
						response.end();
						break;
					}
				}
				else if(id != jsObj.user && i == jsArray.length -1){
					response.status(200).send("WarnId");
					response.end();
				}

			}

		}
	});
});

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 6789);
console.log('port ' + (process.env.PORT || 6666));

function __sendErrorResponse(response, code, content) {
	var ret = {
		err: code,
		desc : content 
	};
	response.status(code).send(ret);
	response.end();
}