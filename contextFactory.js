var db = require('./db/deacondb.js');

module.exports = {
	buildContext: function(logStream){		
		var runningLog = [];

		return {	
			db : function () {				
				return db;
			},
			log: { 
				debug: function (data) {
					var string = JSON.stringify(data)
					runningLog.push(string);
					console.log(string);
				}, 
				flush: function(){
					// logStream.write("<div class='logs'>")
					// for(var item in runningLog){
					// 	logStream.write("<span>"+runningLog[item]+"</span>");
					// }
					// runningLog = [];
					// logStream.write("</div>")
				}
			}
		}
	}
}
