var http = require('http'),
	Parser = require('./parser.js');
	fs = require('fs');
	nano = require('nano')('http://localhost:5984');
var filePath = "./Church Directory-Jan 2012.txt";
var parser = new Parser();
var db = nano.use('members');


parser.parseFileToRecords(filePath, function(result){	
	for(var i = 0; i < result.length; i++){
		var created = new Date();
		created.setMilliseconds(created.getMilliseconds() + i)
		result[i].created = created.getTime();
	}
	db.bulk({'docs':result}, function(err, body) {
	  if (!err)
	    console.log(body);
	});
});