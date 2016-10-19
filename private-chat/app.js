var express = require('express'),
     app = express();

var port = process.env.PORT || 8888 ;
var io = require('socket.io').listen(app.listen(port));

require('./config')(app, io);
require('./routes')(app,io);

console.log('项目运行在  http://localhost:'+port) ;