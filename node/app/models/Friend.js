var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;

var Friend = con.define('friends', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  user_id						: seq.INTEGER,
  friend_id					: seq.INTEGER,
  created_datetime	: seq.DATE(),
  created_ip				: seq.STRING
},
{timestamps : false});

module.exports = Friend;