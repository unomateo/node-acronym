
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , user    = require('./routes/user')
  , http    = require('http')
  , fs      = require('fs')
  , answers = require('answers')
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
app.use(express.cookieParser('D78H87KJANWDJ'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var users = [];
var rounds = null;
var totalUsers = 2;
var started = false;
var lobbies = ['lobby1', 'lobby2'];

app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/group/:id', function(req, res){
	var id = req.params.id;
	var groupName = lobbies[id];
	res.render('group', { gameName: groupName, groupId:id });
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket){
	
	socket.join('testRoom');
	socket.username = 'matt';
console.log(Object.keys(socket.manager.rooms).length);

	socket.on('joinedGame', function(data){
		user.game = data.gameName;
		io.sockets.emit('updateUserList', {user:user, connectionType:'add'});
	});
	
	io.sockets.emit('newUserList', {userList:users});
	
	// New user has joined
	socket.on('addUser', function(name){
		
		user.username = name;
		
		console.log(user.username);
	
		socket.username = name;
		console.log(name + " has joined");
		if(users.indexOf(name) < 0){
			users.push(user);
			io.sockets.emit('updateUserList', {user:users, connectionType:'add'});
		}
	});
	
	socket.on('gameLobbyRequest', function(){
		socket.emit('gameLobbies', {gameLobbies:lobbies});
	});


	socket.on('disconnect', function(){
		console.log(socket.username + " has disconnected");
		var index = users.indexOf(socket.username);
		users.splice(index, 1);
		io.sockets.emit('updateUserList', {user:socket.username, connectionType:'delete'});
	});
});


