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
	var tel;
	var name;
	var email;
	var birth;
	var passwd;
	var endString
	var str = request.query.value;
	var AccountArray = new Array();
	var AccountArray = str.split(",");
	

	var insert = {
		tel: AccountArray[0],
		name : AccountArray[1],
		email : AccountArray[2],
		birth : AccountArray[3],
		passwd : AccountArray[4]
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
	var tel;
	var name;
	var email;
	var birth;
	var passwd;
	var endString
	var str = request.query.value;
	var AccountArray = new Array();
	var AccountArray = str.split(",");
	

	var insert = {
		tel: AccountArray[0],
		name : AccountArray[1],
		email : AccountArray[2],
		birth : AccountArray[3],
		passwd : AccountArray[4]
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

app.get('/api/queryTelDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var tel = request.query.tel;

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
				if(tel == jsObj.tel){
					response.status(200).send("TelExisted" + "," + jsObj.name);
					response.end();
					break;
				}
				else if(tel != jsObj.tel && i == jsArray.length -1){
					response.status(200).send("TelUsefully" + "," + jsObj.name);
					response.end();
				}

			}

		}
	});
});

app.get('/api/queryNameDataPoint', function(request, response) {
	var items = database.collection('dbforaccount');

	var tel = request.query.tel;

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
				if(tel == jsObj.tel){
					response.status(200).send(jsObj.name);
					response.end();
					break;
				}
			}

		}
	});
});

app.get('/api/queryAccountInfo', function(request, response) {
	var items = database.collection('dbforaccount');

	var tel = request.query.tel;

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
				if(tel == jsObj.tel){
					var str = jsObj.tel + "," + jsObj.name + "," + jsObj.email + "," + jsObj.birth;
					response.status(200).send(str);
					response.end();
					break;
				}
			}

		}
	});
});

app.get('/api/queryMemberInfo', function(request, response) {
	var items = database.collection('dbforaccount');

	var tel = request.query.tel;

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
				if(tel == jsObj.tel){
					var str = jsObj.tel + "," + jsObj.name;
					response.status(200).send(str);
					response.end();
					break;
				}
			}

		}
	});
});

app.get('/api/insertRegId', function(request, response) {
	var items = database.collection('dbforaccount');

	var str = request.query.value;
	var Ary = new Array();
	var Ary= str.split(",");

	var id = Ary[0];
	var regid = Ary[1];
	items.update( { tel:id }, { '$set': { regid:regid } });
	response.type('application/json');
	response.status(200).send("Succeed Save"); 
	response.end();

	/*items.find().toArray(function (err, docs) {
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
					
					response.status(200).send("Succeed Save");
					response.end();
				}

			}

		}
	});*/
});

app.get('/api/insertGpsDistance', function(request, response) {
	var items = database.collection('dbforaccount');

	var str = request.query.value;
	var Ary = new Array();
	var Ary= str.split(",");

	var id = Ary[0];
	var distance = Ary[1];
	items.update( { tel:id }, { '$set': { distance:distance } });
	response.type('application/json');
	response.status(200).send("Succeed Save : " + distance); 
	response.end();
});


/*****以下為Order*****/

app.get('/api/addOrderInfo', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var str = request.query.value;
	var orderArray = new Array();
	var orderArray = str.split(",");	

	var insert = {
		tel : orderArray[0],
		starter : orderArray[1],
		main : orderArray[2],
		nonStaple : orderArray[3],
		drink : orderArray[4],
		dessert : orderArray[5],
		price : orderArray[6],
		saveBtn : orderArray[7],
		dining : orderArray[8]
	};
		
	var items = database.collection('dbforclientorder');
	items.insert(insert, function(err, result) {
		if (err) {
			__sendErrorResponse(response, 406, err);
		} else {
			response.type('application/json');
			response.status(200).send(result);
			response.end();
		}
	});
});

app.get('/api/modifyOrderInfo', function(request, response) { // replace early data
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var str = request.query.value;
	var orderArray = new Array();
	var orderArray = str.split(",");	

	var insert = {
		tel : orderArray[0],
		starter : orderArray[1],
		main : orderArray[2],
		nonStaple : orderArray[3],
		drink : orderArray[4],
		dessert : orderArray[5],
		price : orderArray[6],
		saveBtn : orderArray[7],
		dining : orderArray[8]
	};
		
	var items = database.collection('dbforclientorder');

	items.remove({tel:orderArray[0]});

	items.insert(insert, function(err, result) {
		if (err) {
			__sendErrorResponse(response, 406, err);
		} else {
			response.type('application/json');
			response.status(200).send(result);
			response.end();
		}
	});
});

app.get('/api/queryOrderData', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var items = database.collection('dbforclientorder');

	var str = request.query.value;

	items.find({tel:str}).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			response.type('application/json');
			response.status(200).send(docs);
			response.end();
		}
	});
});

app.get('/api/queryPersonalOrderData', function(request, response) {
	var items = database.collection('dbforclientorder');
	var tel = request.query.tel;

	items.find().toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			response.type('application/json');
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				if(tel == jsObj.tel){
					//var str = jsObj.tel + "," + jsObj.name;
					
					response.status(200).send(jsObj);
					response.end();
					break;
				}
				else if(tel != jsObj.tel && i == jsArray.length-1){
					var str = "noData";
					response.status(200).send(str);
					response.end();
					break;
				}

			}
		}
	});
});

app.get('/api/changeDining', function(request, response) {
	var items = database.collection('dbforclientorder');
	var tel = request.query.tel;

	items.find().toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
			var jsArray = docs;
			response.type('application/json');
			for(var i = 0; i < jsArray.length; i++){
				var jsObj = Object();
				var jsObj = jsArray[i];
				if(jsObj.tel == tel){
					//var str = jsObj.tel + "," + jsObj.name;
					items.update({tel : tel}, {$set: {dining: "true"}});
					response.status(200).send("Succeed");
					response.end();
					break;
				}
				else if(jsObj.tel != tel && i == jsArray.length-1){
					response.status(200).send("Failed");
					response.end();
					break;
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