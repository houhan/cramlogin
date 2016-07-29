var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var app = express();
var md5 = require('md5');
var gcm = require('node-gcm');

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


//回傳密碼比對，若成功登入將UID、名稱紀錄起來
app.get('/api/query', function(request, response) {

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

//檢查帳號

app.get('/api/checkaccount', function(request, response) {
	var item = {
	 user : request.query.user
	}
	var collection = myDB.collection('login');
	collection.find({user: request.query.user} , {_id:0 , user:1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			var jsArray = new Array();
            var jsArray = docs; 
            var docs2 = []; 
            for(var i = 0; i < jsArray.length; i++){
                var jsObj = Object();
                var jsObj = jsArray[i];
            if(jsObj.user != " " && jsObj.user !=""){
					docs2 += jsObj.user;
                }
                }  
 
             if(docs2.length == 0)
             { 

            st = [{
            	user : "0"
            }]
            response.type('application/json');
			response.status(200).send(st).end();
			
             }
           
             else{
             	st2 = [{
             		user : "1"
             	}]
			        response.type('application/json');
			        response.status(200).send(st2).end();
                 }
		}
	});
});




app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));



