var events = require('events')


module.exports = function(req, res, params, splats, context){
 	var emitter = new events.EventEmitter();

	context.log.debug(params);
	res.write("done");
	setTimeout(function() {
		emitter.emit('done');
	},5)

	return emitter;
}