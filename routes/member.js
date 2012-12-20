var events = require('events')
, sys = require('sys');

 var memberPage = function(req, res, params, splats, context){

 	var emitter = new events.EventEmitter();
	var self = this;
	var db = context.db();
	console.log(params);
	var nameAndInc = params.id.split("-");
	var name = nameAndInc[0].toUpperCase();
	var inc = 0;
	if(nameAndInc.length > 1)
		inc = nameAndInc[1];

	console.log(name);
	db.view("deacon","familyByName", {keys: [name]}, function (err, body) {
		if(err)	throw err
		
		var rows = body.rows;
		if(rows.length == 0){
			res.template("memberNotFound.ejs", {family: name});
			emitter.emit('done');
			return;
		}
		rows.sort(function(a, b){ return a.created - b.created });
		
		res.template("member.ejs", rows[inc].value, false);		
		emitter.emit('done');
	});
	return emitter;
}

module.exports = memberPage;