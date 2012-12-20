var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string','string');
var Identifier = require('./lineIdentifier.js'),
	fs = require('fs');

var identifier = new Identifier();
var emptylineRegex = new RegExp(/^$/);

var parser = 
	(function(){var c = function () {}

	c.prototype.parseStringToObj = function(stringToParse) {
		var lines = stringToParse.split('\n');
		var returnObj = {};
		for(var ind=0; ind<lines.length;ind++){
			var line = lines[ind];

			if(line == "" || line =={} || typeof line === "undefined")
				continue;

			var type = identifier.identify(ind,line);		
			if(type)
				lineparsers[type](returnObj, line);

		}
		return returnObj;
	};

	c.prototype.parseFileToRecords = function(fileName, callback){
		var self = this;
		var records = [];
		var parsedLines = {};
		var buffer = ""
		var filestream = fs.createReadStream(fileName,
			{encoding:"utf8"});
		filestream.on("data", function(data){
			buffer += data.toString();				
		})
		filestream.on('end',function(){
			var recordStrings = buffer.split('\n\n');			
			recordStrings.forEach(function(recordString, index){				
				var record = self.parseStringToObj(recordString);
				records.push(record);
			})					
			callback(records);		
		});
	}
	return c;	
})();

var lineparsers = {
	"primaryNames" : function(obj, line){
		var splitLine = line.split(/,(.+)?$/);
		var family = _.str.trim(splitLine[0]);
		var namesString =_.str.trim(splitLine[1]);
		var names = namesString.split('&');
		obj.family = family;
		obj.people = {};
		_.each(names, function(name){
			var santizedName = _.str.trim(name);
			santizedName = santizedName.replace('*',"");
			obj.people[santizedName] = {"name":santizedName};
		})
	},
	"streetaddress" : function(obj, line){
		if(!obj.address)
			obj.address = {};
		obj.address.street = line;
	},
	"phone" : function(obj,line){
		if(line.length == 8)
			line = "513-" + line;
		obj.phone = line;
	},
	"statusReport" : function(obj,line){
		var splitByApos = line.split("'");
		if(splitByApos.length > 1)
			var name = line.split("'")[0];
		else
			var name = Object.keys(obj.people)[0];
		var status = _.str.trim(line.split(":")[1])
						.split(" ")[0];

		if(!obj.people)
			obj.people = {};
		if(!obj.people[name])
			obj.people[name] ={};
		obj.people[name].active = status == "Active";
	},
	"birthDate" : function(obj,line){
		var splitByApos = line.split("'");
		if(splitByApos.length > 1)
			var name = line.split("'")[0];
		else
			var name = Object.keys(obj.people)[0];
		var dateString = _.str.trim(line.split(":")[1]);
		
		if(!obj.people)
			obj.people = {};
		if(obj.people[name])
			obj.people[name].birthday = dateString;
		else
			obj.people[name] = {};

		obj.people[name].birthday = dateString
	},
	"cityStateZip" : function(obj,line){
		var stateRegex = new RegExp(/\s[A-Z]{2}\s/);
		var stateInd = line.search(stateRegex);
		var state = _.str.trim(line.substring(stateInd, stateInd + 4));
		var city = _.str.trim(line.substring(0,stateInd));
		var zip = _.str.trim(line.substring(stateInd + 4));
		if(!obj.address)
			obj.address = {};

		obj.address.city = city.replace(",","");
		obj.address.state = state;
		obj.address.zip = zip;
	},
	"kids" : function(obj,line){
		var kids = line.split(',')
		_.each(kids, function(name){
			var santizedName = _.str.trim(name);
			santizedName = santizedName.replace('*',"");	
			if(!obj.people)	
				obj.people = {};	
			obj.people[santizedName] = {"name":santizedName};
		})
	}
}
module.exports = parser;
