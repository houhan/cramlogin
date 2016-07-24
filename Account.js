var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();

var uri = 'mongodb://bob840312:bob0932233875@ds023624.mlab.com:23624/cram';

var database;

mongodb.MongoClient.connect(uri, function(err, db) {
	if (err) {
		console.log('connect mongo db error ' + err);
	} else {
		console.log('connect mongo db success');
		database = db;
	}
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
					if(password == jsObj.password){
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