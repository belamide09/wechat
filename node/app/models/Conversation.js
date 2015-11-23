var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;


module.exports = con.define('conversations', {

  sender_id			: 	seq.INTEGER,
  recepient_id		: 	seq.INTEGER,
  message 			: 	seq.STRING,
  file 				: 	seq.STRING,
  created_datetime	: 	seq.STRING,
  created_ip		: 	seq.STRING
},
{timestamps : false});