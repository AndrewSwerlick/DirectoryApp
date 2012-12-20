var Parser = require('../data/parser.js');
var should = require('should');
describe('Parser', function(){
	describe("Parsing a single entry", function(){
		var testString = 
			"SMITH, Bob & Kelly\n"+
			"3513 Gallup Road\n"+
			"Cincinnati OH 45239\n"+
			"789-1253\n"+
			"Bob's pres. report status: Active Member\n"+
			"Kelly's pres. report status: Active Member\n"+
			"Bob's birth date: 09/07\n"+
			"Kelly's birth date: 01/02\n";
			var parser = new Parser();
			var parserResults = parser.parseStringToObj(testString);
			var expectedObject ={
				"family" : "SMITH",
				"people":{
						"Bob":{
							"name":"Bob", 
							"active" : true,
							"birthday" : "09/07"
						},
						"Kelly":{
							"name": "Kelly", 
							"active" : true,
							"birthday" : "01/02"
						}
				},
				"address": {
					"street" :"3513 Gallup Road",
					"city" : "Cincinnati",
					"state" : "OH",
					"zip" : "45239"
				},
				"phone" : "513-789-1253"			
			}
		it('should extract people and details', function(){				
			parserResults.people.should.eql(expectedObject.people)
		})
		it('should extract the family name', function(){
			parserResults.family.should.eql(expectedObject.family);
		})
		it('should extract the address', function(){
			parserResults.address.should.eql(expectedObject.address)
		})
		it('should extract the phone', function(){
			parserResults.phone.should.be.eql(expectedObject.phone)
		})
	})
	describe("Parsing a more complex entry", function(){
		var testString = 
		"JONES, Anne & Jordan*\n"+
		"Sarah, Micheal, Val, Aaron\n"+
		"6987 Roxboro Drive\n"+
		"Mason OH 45040\n"+
		"756-9725\n"+
		"Anne's pres. report status: Active Member\n"+
		"Jordan's pres. report status: Non-Member\n"+
		"Sarah's pres. report status: Non-Member\n"+
		"Micheal's pres. report status: Non-Member\n"+
		"Val's pres. report status: Non-Member\n"+
		"Aaron's pres. report status: Non-Member\n"+
		"Anne's birth date: 11/18\n"+
		"Sarah's birth date: 08/08/1991\n"+
		"Micheal's birth date: 05/07/1985\n"+
		"Val's birth date: 06/16/1980\n"+
		"Aaron's birth date: 12/23/1997";
		var parser = new Parser();
		var parserResults = parser.parseStringToObj(testString);			
		var expectedObject = {
			"family" : "JONES",
			"people" : {
				"Anne" :{
					"name" : "Anne",
					"active" : true,
					"birthday" : "11/18"
				},
				"Jordan" :{
					"name" : "Jordan",
					"active" : false,
				},
				"Sarah":{
					"name":"Sarah",
					"active":false,
					"birthday":"08/08/1991"
				},
				"Micheal":{
					"name":"Micheal",
					"active":false,
					"birthday":"05/07/1985"
				},
				"Val":{
					"name":"Val",
					"active":false,
					"birthday":"06/16/1980"
				},
				"Aaron":{
					"name":"Aaron",
					"active":false,
					"birthday":"12/23/1997"
				}
			},
			"address" : {
				"street" : "6987 Roxboro Drive",
				"city" : "Mason",
				"state" : "OH",
				"zip" : "45040"
			},
			"phone": "513-756-9725"
		}
		it("should produce expected object", function(){
			parserResults.should.eql(expectedObject);
		})
	})
	describe("Parsing a one person entry", function(){
		var testString = 
		"YOUNG, Sam\n" +
		"8435 Fairfield Lane\n" +
		"Cincinnati, OH 45231\n" +
		"737-5685\n" +
		"pres. report status: Inactive Member\n" +
		"birth date: 12/23\n";
		var parser = new Parser();
		var parserResults = parser.parseStringToObj(testString);
		var expectedObject = {
			"family":"YOUNG",
			"people":{
				"Sam":{
					"name":"Sam",
					"active":false,
					"birthday" : "12/23"
				}
			},
			"address":{
				"street": "8435 Fairfield Lane",
				"city" : "Cincinnati",
				"state": "OH",
				"zip":"45231"
			},
			"phone":"513-737-5685"
		};
		it("should produce expected object", function(){
			parserResults.should.eql(expectedObject);
		})
	})
	describe("Parsing a file", function(){
		var expectedObject ={
				"family" : "CHASE",
				"people":{
						"Bob":{
							"name":"Bob", 
							"active" : true,
							"birthday" : "12/07"
						},
						"Kelly":{
							"name": "Kelly", 
							"active" : true,
							"birthday" : "10/02"
						}
				},
				"address": {
					"street" :"3523 Gallup Road",
					"city" : "Cincinnati",
					"state" : "OH",
					"zip" : "45239"
				},
				"phone" : "513-123-5643"			
			};
		var parser = new Parser();		
		var filePath = "./data/testDirectory.txt";
		it("should return 7 records", function(done){
			parser.parseFileToRecords(filePath, function(result){
				result.length.should.equal(7);
				done();
			});
		})
		it("should have a 1st record with the SMITH family", function(done){
			parser.parseFileToRecords(filePath, function(result){
				var record = result[0];
				record.family.should.equal("SMITH");
				done();
			})
		})
		it("should have a 2nd record matching expectedObject", function(done){
			parser.parseFileToRecords(filePath, function(result){
				var record = result[1];
				console.log(record.address);
				record.should.eql(expectedObject);
				done();
			})
		})
	})
});