var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var app = express();
var md5 = require('md5');
var gcm = require('node-gcm');

var mongodbURL = 'mongodb://houhan:ag460360@ds029745.mlab.com:29745/dbforaccount';

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
		name : request.query.name,
		password : md5(request.query.password),
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
	var item = {
	user : request.query.user,
	name : request.query.name,
	password : md5(request.query.password),
	}
	
	var collection = myDB.collection('login');
	collection.find({user : request.query.user}, {password: 1, _id: 1}).toArray(function(err, docs) {
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


//公佈欄顯示
app.get('/api/querybillboard', function(request, response) {


	var collection = myDB.collection('billboard');
	collection.find({}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});

//公佈欄新增
app.get('/api/insertbb', function(request, response) {
	var item = {
		date : request.query.date,
		title : request.query.title,
		content : request.query.content,
	}
	var collection = myDB.collection('billboard');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		}else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});


//公佈欄刪除
app.get('/api/deletebillboard', function(request, response) {

	var item = {
	date: request.query.date,
	title: request.query.title,
	content: request.query.content
	}
	var collection = myDB.collection('billboard');
	collection.find({date: request.query.date,title: request.query.title,content: request.query.content} , {_id: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});
//刪除公佈欄步驟二
app.get('/api/delete2', function(request, response) {
	var param = {
		_id : new ObjectID(request.query.id)
	}
	console.log(JSON.stringify(param));
	var collection = myDB.collection('billboard');
	collection.remove(param, function(err, result) {
		if (err) {
			console.log('response err' + JSON.stringify(err));
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});

//新增預計抵達時間
app.get('/api/inserttime', function(request, response) {
	var item = {
	hours : request.query.hours,
	min : request.query.min,
	}
	var collection = myDB.collection('arrivetime');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		}else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});

//顯示預計抵達
app.get('/api/querytime', function(request, response) {
	var item = {
	hours : request.query.hours,
	min : request.query.min,
	}
	
	var collection = myDB.collection('arrivetime');
	collection.find({}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	ser});
}); 



app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));



