var config = require('./dbconfig.json')
var nano = require('nano')(config.couch.server);
var db = nano.use(config.couch.db);
var extend = require('node.extend');

var designDoc = 
{
	"views":
	{
		"familyByName": {
      		"map": function(doc) {
        		emit(doc.family, doc);
      		}
  		}
    }
}

var deaconDb = { 
	setupDb : function(cb){
		db.get("_design/deacon", function (err, doc) {
			if(!err)
				designDoc._rev = doc._rev;
			db.insert(designDoc, "_design/deacon", cb);
		})
	},
	getMember : function(memberName, callback){
		var self = this;
		var nameAndInc = memberName.split("-");
		var name = nameAndInc[0].toUpperCase();
		var inc = 0;
		if(nameAndInc.length > 1)
			inc = nameAndInc[1];

		db.view("deacon","familyByName", {keys: [name]}, function (err, body) {
			if(err)	throw err
			
			var rows = body.rows;
			if(rows.length == 0){
				callback("no member found");
			}
			rows.sort(function(a, b){ return a.created - b.created });
			
			callback(undefined, rows[inc].value);
		});
	}
}

module.exports = extend(db, deaconDb);