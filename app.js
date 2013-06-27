
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
app.get('/groups', routes.groups);
app.get('/add_group', user.list);

var users = [];
var rounds = null;
var totalUsers = 2;

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket){

	console.log('New connection attempt');
	io.sockets.emit('newUserList', {userList:users});

	// New user has joined
	socket.on('addUser', function(name){
	socket.username = name;
	console.log(name + " has joined");
	users.push(name);
		// add the new user to the user list
		io.sockets.emit('updateUserList', {user:name, connectionType:'add'});

		// if there are 3 people, start the game
		if(users.length >= totalUsers){
			// make the acronym, eventually this will be randomized
			var acronym = ['a', 't', 'n'];
			//make the round object
			round = {
				'acronym':acronym,
				'complete':[]
			};

			io.sockets.emit('startGame', {message:"starting Game", 'round':round});
		} else {
			io.sockets.emit('waitingMessage', {data:"Waiting for " + (totalUsers - users.length).toString() + " more players to join..."});
		}
	});

	socket.on("submitAnswer", function(answer){
		//console.log(data);
		//Answers.answer.push(data);
		answers.add(answer);
		console.log(answers.getCount());
		if(answers.getCount() >= users.length){
			io.sockets.emit('startVote', answers.getAnswers());
		}
	});

	socket.on('disconnect', function(){
		console.log(socket.username + " has disconnected");
		var index = users.indexOf(socket.username);
		users.splice(index, 1);
		io.sockets.emit('updateUserList', {user:socket.username, connectionType:'delete'});
	});
});


