var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;

var Notification = con.define('notifications', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  post_id						: seq.INTEGER,
  user_id     			: seq.INTEGER,
  type   						: seq.INTEGER,
  has_viewed        : seq.BOOLEAN,
  has_read          : seq.BOOLEAN,
  created_datetime	: seq.STRING,
  created_ip 				: seq.STRING
},
{timestamps : false});

module.exports = Notification;