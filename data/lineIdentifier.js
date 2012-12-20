var lineIdentifierFunctions = {
	"primaryNames" : function(ind, line){
		return ind == 0;
	},
	"phone" : function(ind, line){
		var phoneRegex = new RegExp(/\d{3}-\d{4}/)
		return line.match(phoneRegex)			
	},
	"streetaddress": function(ind,line){
		var addrRegex = new RegExp(/^\d.+?\s/)
		return line.match(addrRegex);
	},
	"statusReport" : function(ind,line){
		var statusRegex = new RegExp("pres. report status");
		return line.match(statusRegex);
	},
	"birthDate" : function(ind,line){
		var birthDateRegex = new RegExp("birth date");
		return line.match(birthDateRegex);
	},
	"cityStateZip" : function(ind,line,lasttype){
		if(lasttype && lasttype == "streetaddress")
			return true;
	},
	"kids" : function(ind, line, lasttype){
		if(lasttype && lasttype == "primaryNames")
			return true;
	}
}

var Identifier = 
	(function (){var c = function(){}
		c.prototype.identify = function(ind, line){
			if(typeof line === "undefined")
				return;
			for(type in lineIdentifierFunctions){
				var positiveId = lineIdentifierFunctions[type](ind, line, this.lasttype);
				if(positiveId){
					this.lasttype = type;
					break;
				}
			}
			return this.lasttype;
		}
		return c;
	}
)();

module.exports = Identifier;

