var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;


var Post = con.define('posts', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  user_id			: 	seq.INTEGER,
  text				: 	seq.TEXT,
  file	 			: 	seq.STRING,
  created_datetime	: 	seq.STRING(),
  created_ip		: 	seq.STRING
},
{timestamps : false});
module.exports = Post;