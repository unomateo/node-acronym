/*
var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200);
	res.write('hello');
		res.end();
}).listen(3000);

*/

var str = "this is a string";

str.forEach(function(letter){

console.log(letter);

})


for(var i = 0; i < 10; i++){

console.log(i);
}


console.log('test');


//io.sockets.on('connection', function(socket){
//	socket.emit('welcome', {'message': 'Welcome to my site'});
//});