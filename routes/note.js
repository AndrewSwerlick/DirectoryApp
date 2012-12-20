var events = require('events');

var notes = function(req, res, params, splats, context){
 	var emitter = new events.EventEmitter();
 	var db = context.db();
	var handlers = {
		'PUT' : function(req, res, params, splats, context){
			var note = '';
			req.on('data', function(chunk) {
		      note += chunk;
		    });
    
		    req.on('end', function() {
				db.getMember(params.id, function(err, member){
					if(!member.notes)
						member.notes =[];
					member.notes.push(JSON.parse(note));
					db.insert(member, function(err, body){
						res.statusCode = 200;
						res.end();
					});
				});
			});
		}
	}
	handlers[req.method](req, res, params, splats, context);
	return emitter;
}

module.exports = notes;