
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.group = function(req, res){
	var id = req.params.id;
	var groupName = lobbies[id];
	res.render('group', { gameName: groupName, groupId:id });
};
