var mocks = require('./mocks.json');

module.exports = 
{
	mockPath: function(path)
	{
		var nock = require('nock');
		var requestMocks = mocks[path];
		var mock = nock("http://localhost:5984");
		console.log(requestMocks);
		requestMocks.forEach(function(m){
			mock[m.method](m.path,m.body)
				.reply(m.status, m.response);
			if(m.body == "*")
				mock.filteringRequestBody(function(path) {
            		return "*";
          		});
		});
		return mock;
	}
}