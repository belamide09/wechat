var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;

var Comment = con.define('comments', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  post_id			: 	seq.INTEGER,
  user_id			: 	seq.INTEGER,
  comment 		: 	seq.STRING,
  created_datetime	: 	seq.DATE(),
  created_ip	: 	seq.STRING
},
{timestamps : false});

module.exports = Comment;