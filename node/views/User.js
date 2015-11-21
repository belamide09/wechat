var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;


module.exports = con.define('users', {
  name		: 	seq.STRING,
  photo		: 	seq.STRING()
  
},
{timestamps : false});