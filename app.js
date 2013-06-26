
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , user    = require('./routes/user')
  , http    = require('http')
  , fs      = require('fs')
  , path    = require('path');

var app = express();
var port = 3000;


// all environments
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var users = [];
var rounds = null;
var answers = null;
var totalUsers = 3;

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket){

	console.log('New connection attempt');
	io.sockets.emit('newUserList', {userList:users});

	socket.on('addUser', function(name){
	socket.username = name;
	console.log(name + " has joined");
	users.push(name);
		// add the new user to the user list
		io.sockets.emit('updateUserList', {user:name, connectionType:'add'});

		// if there are 3 people, start the game
		if(users.length > 2){
			io.sockets.emit('startGame', {data:"starting Game"});
		} else {
			io.sockets.emit('waitingMessage', {data:"Waiting for " + (totalUsers - users.length).toString() + " more players to join..."});
		}
		

	});

	socket.on('disconnect', function(){
		console.log(socket.username + " has disconnected");
		var index = users.indexOf(socket.username);
		users.splice(index, 1);
		io.sockets.emit('updateUserList', {user:socket.username, connectionType:'delete'});
	});
});

function getQuestions(){

}
