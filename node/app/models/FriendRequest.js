var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;

var FriendRequest = con.define('friend_requests', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  userId						: seq.INTEGER,
  recepient_id			: seq.INTEGER,
  status 						: seq.INTEGER,
  created_datetime	: seq.DATE(),
  created_ip 				: seq.STRING
},
{timestamps : false});

module.exports = FriendRequest;