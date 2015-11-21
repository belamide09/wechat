var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');

exports.connection = con;


module.exports = con.define('users', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  name		: 	seq.STRING,
  photo		: 	seq.STRING()
},
{timestamps : false});