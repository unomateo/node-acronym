
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.groups = function(req, res){
  res.render('groups', { title: 'Groups' });
};
