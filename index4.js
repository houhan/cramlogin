var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var app = express();
var gcm = require('node-gcm');
var FCM = require('fcm-node');
var fcm = new FCM('AIzaSyDn9S-x9r31Ub3ns_VZnBBEBBvggdH1CoI');
var bodyParser = require('body-parser')

var mongodbURL = 'mongodb://houhan:ag460360@ds029745.mlab.com:29745/dbforaccount';

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
		password : request.query.password,
		minor : request.query.minor,
		room : request.query.room,
		regid : request.query.regid,
		sstatus: request.query.sstatus
		
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


//更新RegId
app.get('/api/insertRegId', function(request, response) {
	var items = myDB.collection('login');
	var user = request.query.user;
	var regid = request.query.regid;
	console.log('testLog');
	items.update( { 'user':user }, { $set: { 'regid':regid } });
	response.type('application/json');
	response.status(200).send("Succeed Save"); 
	response.end();

});


//更新Status
app.get('/api/insertstatus', function(request, response) {
	var items = myDB.collection('login');
	var regid = request.query.regid;
	var sstatus = request.query.sstatus;
	console.log('testLog');
	items.update( { 'regid':regid }, { $set: { 'sstatus':sstatus} });
	response.type('application/json');
	response.status(200).send("Succeed Save"); 
	response.end();

});

//回傳密碼比對，若成功登入將UID、名稱紀錄起來
app.get('/api/query', function(request, response) {
	var item = {
	user : request.query.user,
	name : request.query.name,
	room : request.query.room,
	minor : request.query.minor,
	password : request.query.password,
	sstatus: request.query.sstatus
	}
	
	var collection = myDB.collection('login');
	collection.find({user : request.query.user}, {password: 1, _id: 1, name:1, minor:1 , room:1, user:1, sstatus:1}).toArray(function(err, docs) {
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
	collection.find().sort({datefield: 1}).toArray(function(err, docs) {
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
app.get('/api/deletebill', function(request, response) {
	var param = {
		_id : new ObjectID(request.query._id)
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
	user : request.query.user,
	time : request.query.time,
	dis : request.query.dis
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
	user : request.query.user,
	time : request.query.time,
	dis : request.query.dis
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


//新增請假單
app.get('/api/insertqk', function(request, response) {
	var item = {
	name : request.query.name,
	date : request.query.date,
	reson : request.query.reson,
	ps : request.query.ps,
	}
	var collection = myDB.collection('qk');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		}else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});

//顯示請假單
app.get('/api/queryqk', function(request, response) {
	var item = {
	name : request.query.name,
	date : request.query.date,
	reson : request.query.reson,
	PS : request.query.PS,
	}
	var collection = myDB.collection('qk');
	collection.find({}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
}); 

//請假單刪除
app.get('/api/deleteqk', function(request, response) {
	var param = {
		_id : new ObjectID(request.query._id)
	}
	console.log(JSON.stringify(param));
	var collection = myDB.collection('qk');
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

//新增課程表
app.get('/api/insertqk', function(request, response) {
	var item = {
	course : request.query.course,
	day : request.query.day,
	time : request.query.time,
	}
	var collection = myDB.collection('schedule');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		}else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});

//名字顯示
app.get('/api/querystudentname', function(request, response) {
	var item = {
	name : request.query.name,
	room : request.query.name,
	regid : request.query.regid,
	}

	var collection = myDB.collection('login');
	collection.find({}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});

//顯示孩子到班資訊
app.get('/api/querystudentstatus', function(request, response) {
	var item = {
	name : request.query.name,
	sstatus : request.query.sstatus
	}
	var collection = myDB.collection('login');
	collection.find({name:request.query.name} , {sstatus : 1,_id: 0}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});


//發送小孩抵達通知
app.get('/api/sendfcm',function(request,response,next){
	var from = request.query.from;
	var to = request.query.to;
	var message = request.query.message;	
	var body = request.query.body;
	var request = require('request');

	function sendMessageToUser(deviceId){
	  	request({
		    url: 'https://fcm.googleapis.com/fcm/send',
		    method: 'POST',
		    headers: {
		        'Content-Type' : ' application/json',
		        'Authorization': 'key=AIzaSyDn9S-x9r31Ub3ns_VZnBBEBBvggdH1CoI'
		    },
		    body: JSON.stringify(
		        {
					"to" : deviceId,
					  "data": {
						"subject": "智慧安心班",
						"message": "小孩已到安親班囉！"
					   }
	
				}
		    )}, function(error, response, body) {
			    if (error) { 
			        console.error(error, response, body); 
			    }else if (response.statusCode >= 400) { 
			        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
			    }else {
			        console.log('Done!');
			    }
			}  
		);	
	};
	sendMessageToUser(to);
	
	response.write('Done!');
	response.end();		    	
		    	
});	

//發送小孩已可接送通知
app.get('/api/sendfcmgohome',function(request,response,next){
	var from = request.query.from;
	var to = request.query.to;
	var message = request.query.message;	
	var body = request.query.body;
	var request = require('request');

	function sendMessageToUser(deviceId){
	  	request({
		    url: 'https://fcm.googleapis.com/fcm/send',
		    method: 'POST',
		    headers: {
		        'Content-Type' : ' application/json',
		        'Authorization': 'key=AIzaSyDn9S-x9r31Ub3ns_VZnBBEBBvggdH1CoI'
		    },
		    body: JSON.stringify(
		        {
					"to" : deviceId,
					  "data": {
						"subject": "智慧安心班",
						"message": "孩子已完成功課，家長可以來接囉!"
					   }
	
				}
		    )}, function(error, response, body) {
			    if (error) { 
			        console.error(error, response, body); 
			    }else if (response.statusCode >= 400) { 
			        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
			    }else {
			        console.log('Done!');
			    }
			}  
		);	
	};
	sendMessageToUser(to);
	
	response.write('Done!');
	response.end();		    	
	    	
});	

//發送家長抵達狀況
app.get('/api/sendfcmarrive',function(request,response,next){
	var from = request.query.from;
	var to = request.query.to;
	var message = request.query.message;	
	var body = request.query.body;
	var request = require('request');

	function sendMessageToUser(deviceId){
	  	request({
		    url: 'https://fcm.googleapis.com/fcm/send',
		    method: 'POST',
		    headers: {
		        'Content-Type' : ' application/json',
		        'Authorization': 'key=AIzaSyDn9S-x9r31Ub3ns_VZnBBEBBvggdH1CoI'
		    },
		    body: JSON.stringify(
		        {
					"to" : deviceId,
					  "data": {
						"subject": "智慧安心班",
						"message": message
					   }
	
				}
		    )}, function(error, response, body) {
			    if (error) { 
			        console.error(error, response, body); 
			    }else if (response.statusCode >= 400) { 
			        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
			    }else {
			        console.log('Done!');
			    }
			}  
		);	
	};
	sendMessageToUser(to);
	
	response.write('Done!');
	response.end();		    	
		    	
});	


//發送抵達時間給老師 寫好ID
app.get('/api/sendfcmgohome2',function(request,response,next){
	var from = request.query.from;
	var to = request.query.to;
	var message = request.query.message;	
	var body = request.query.body;
	var request = require('request');

	function sendMessageToUser(deviceId){
	  	request({
		    url: 'https://fcm.googleapis.com/fcm/send',
		    method: 'POST',
		    headers: {
		        'Content-Type' : ' application/json',
		        'Authorization': 'key=AIzaSyDn9S-x9r31Ub3ns_VZnBBEBBvggdH1CoI'
		    },
		    body: JSON.stringify(
		        {
					"to" : "dh8BlEL1awI:APA91bFe0tg951Z1WdU2CtAn9dzpmveZebgFGKh0KG1RzlxJve7czYGrhwDHGLTJhiyjL0Wp4xUiEiglGb67Vz-YjRwArnM_nP7Oc189L2DrjbRvUEWELdsa3RNlkDS3ZVGkJLKgbrcm",
					  "data": {
						"subject": "智慧安心班",
						"message": message
					   }
	
				}
		    )}, function(error, response, body) {
			    if (error) { 
			        console.error(error, response, body); 
			    }else if (response.statusCode >= 400) { 
			        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
			    }else {
			        console.log('Done!');
			    }
			}  
		);	
	};
	sendMessageToUser(to);
	
	response.write('Done!');
	response.end();		    	
	    	
});	
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));