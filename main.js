var contextFactory = require('./contextFactory.js');
var DirectoryServer = require('./directoryServer.js');

var server = new DirectoryServer(contextFactory);

server.listen(1337, '127.0.0.1');