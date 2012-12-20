var mocks = require('./mocks.json');
var nock = require('nock');

module.exports = 
{
	mockPath: function(path)
	{
		var requestMocks = mocks[path];
		var mock = nock("http://localhost:5984");
		requestMocks.forEach(function(m){
			mock.post(m.path,m.body).reply(m.status, m.response);
		});
		return mock;
	}
}