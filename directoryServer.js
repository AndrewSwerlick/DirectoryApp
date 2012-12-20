var http=require("http")
, ejs = require('ejs')
, Templar = require('templar')
, templarOptions = { engine: ejs, folder: './templates', cache:false}
, router = require('./router.js')
, domain = require('domain');

var DeaconServer = function(contextFactory){

	return http.createServer(function (req, res) {
		var requestDomain = domain.create();
		requestDomain.on("error", function(error){
			res.write(JSON.stringify(error));
			res.end();
		})
		requestDomain.run(function(){
			var context = contextFactory.buildContext(res);
	  		res.template = Templar(req, res, templarOptions);
	  		var route = router.match(req.url);
			route.fn(req, res, route.params, route.splats, context)
			.on('done', function(){
				context.log.flush();
				res.end();
			});
		});
	});
}

module.exports = DeaconServer;