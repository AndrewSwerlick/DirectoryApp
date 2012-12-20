var should = require("should");
var DirectoryServer = require("../directoryServer.js");
var mocks = require('./httpMocks');
var contextFactory = require('../contextFactory.js');
var http = require('http');
var fs = require('fs');
var extend = require('node.extend');
var server = null;
var optTemplate = {
  host: '127.0.0.1',
  port: 1337
};
var nock = require('nock');
var Browser = require('zombie');


describe("Retrieving a member record", function(){
	before(function(done){
		server = new DirectoryServer(contextFactory).listen(1337, '127.0.0.1',done);
	})
	it("should return the member record html", function(done){
		var options = extend(optTemplate, {			  
			path: '/members/smith',
			method: 'GET'
		});		
		mocks.mockPath(options.path);
		var data = '';
		http.request(options, function(response){
			response.on('data', function(resData){
				data += resData;
			})
			response.on('end', function(){
				fs.readFile("./test/expectedHtml/smith_member.html",'utf-8',function(err,contents){
					data.replace(/\s+/g, ' ').should.equal(contents.replace(/\s+/g, ' '));
					done();
				});
			})
		}).end();
	});
	it("should make a put request to couchdb when posting a new note", function(done){
		var options = extend(optTemplate, {
			path: '/members/smith/notes',
			method: 'PUT'
		});		
		var mock = mocks.mockPath(options.path);
		var noteText = JSON.stringify({'text':'This is a note', 'date':'2012-01-01:T00:00:00'});		
		var request = http.request(options, function(res){
			mock.isDone();
			done();
		})
		request.write(noteText)
		request.end();
	});
	describe("executing client side script", function(done){
		var browser = new Browser();
		var loadPage = browser.visit("http://localhost:1337/members/smith");
		it("should have a note input", function(done){
			loadPage.then(function(){
				return browser.pressButton("#addNote")
			}).
			then(function(){
				console.log(browser.query("#noteInput"));
				browser.queryAll("#noteInput").length.should.equal(1);
			}).then(done, done);
		})
	});
	after(function(done){
		server.close(done);
	});
});