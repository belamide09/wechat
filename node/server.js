// Require modules
var express     =     require('express');
var app         =     express();
var mysql       =     require("mysql");
var http        =     require('http').Server(app);
var io          =     require("socket.io")(http);
var router      =     express.Router();
var getIP       =     require('ipware')().get_ip;
var bodyParser  =     require('body-parser');

app.set('views', __dirname + '\\app\\view\\');
app.engine('html', require('ejs').renderFile);


var connected   = {};

var seq = require('sequelize');

// set connection
var con = new seq('wechat', 'root', '');


app.get("/",function(req,res){

  // Displaying welcome message into node index
  res.send("Welcome to node");

});

var User             = require('./app/models/User');
var Conversation     = require('./app/models/Conversation');
var Friend           = require('./app/models/Friend');
var FriendRequest    = require('./app/models/FriendRequest');

var clients = [];

// Access socket io event using routes very helpful in future
router.route('/getFriendRequest')

.get(function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    
    // Count all friend request
    FriendRequest.count().then(function(count) { 
  
    io.emit('return_friend_requests',count);
    res.send(count);
  
  });

});


/*  This is auto initiated event when Client connects to Your Machine.  */
io.on('connection',function(socket) {


  clients.push(getIp(socket));
  console.log( clients );

  socket.on('disconnect', function() {

    clients.splice(clients.indexOf(getIp(socket)), 1);
    console.log(clients);

  });

  socket.on('friend_request_evt',function(data) {

    // Add new friend request
    FriendRequest.create({

      userId        :   data['sender_id'],
      recepient_id  :   data['recepient_id'],
      status        :   0,
      created_datetime: new Date(),
      created_ip      : getIp(socket)

    }).done(function() {

      // Count all friend request
      FriendRequest.count({
        where: { 
          recepient_id  : data['recepient_id'],
          status        : 0
        }
      }).then(function(count) { 
      
        io.emit('append_friend_request',{recepient_id:data['recepient_id'],count:count});
      
      });

    })


  });

  socket.on('get_friend_requests',function(recepient_id) {
    
    FriendRequest.belongsTo(User, {
      constraints: false,
      foreignKey: 'userId'
    });

    FriendRequest.findAll({
        attributes: [
          ['id','request_id'],
          'friend_requests.recepient_id',
          'friend_requests.userId',
          'User.name'
        ],
        where: { recepient_id: recepient_id },
        include: [{
          model: User,
          required: true
        }]
      }).then(function(results) {

      io.emit('return_friend_requests',{recepient_id:recepient_id,requests:results});
    
    });

  });

  socket.on('response_friend_request_evt',function(data) {

    FriendRequest.update({status: data['status']},
    {
    
      where: { id : data['friend_request_id'] }
    
    }).done(function() {

      if ( data['status'] == 1 ) {


        // Another syntax for save
        /*
          Friend.create({
            user_id           : data['user_id'],
            friend_id         : data['friend_id'],
            created_datetime  : new Date(),
            created_ip        : getIp(socket)
          });
        */

        Friend.build({

          user_id           : data['user_id'],
          friend_id         : data['friend_id'],
          created_datetime  : new Date(),
          created_ip        : getIp(socket)

        }).save().done(function() {

        Friend.build({
          user_id           : data['friend_id'],
          friend_id         : data['user_id'],
          created_datetime  : new Date(),
          created_ip        : getIp(socket)
        }).save().done(function() {

        FriendRequest.count({
          where: { 
              recepient_id  : data['user_id'],
              status        : 0
            }
          }).done(function(count) { 
            
            io.emit('append_friend_request',{recepient_id:data['user_id'],count:count});
          
          });

        });

        })

      } else {

        FriendRequest.count({
          where: { 
            recepient_id  : data['user_id'],
            status        : 0
          }
        }).then(function(count) { 
        
          io.emit('append_friend_request',{recepient_id:data['user_id'],count:count});
        
        });

      }

    });

  });

  socket.on('message_add_evt',function(data) {

    data['ip']    = getIp(socket);

    add_message(data,function(res) {
      if ( res ) {
        io.emit('append_message',data);
      } else {
        io.emit('error');
      }
    });

  });

  socket.on('get_messages',function(data) {

    Conversation.findAll({
      attributes: ['recepient_id','message'],
      where: {

        $or :[
          {
            sender_id: data['sender_id'],
            recepient_id: data['recepient_id']
          },
          {
            recepient_id: data['sender_id'],
            sender_id: data['recepient_id']
          }
        ]


      },
      limit:30,
      order : [
        ['id','asc']
      ]
    }).done(function(err, results) {
      if ( err ) {
        io.emit('return_messages',{partner_id:data['partner_id'],sender_id:data['sender_id'],messages: err });
      } else {
        io.emit('return_messages',{partner_id:data['partner_id'],sender_id:data['sender_id'],messages: results });
      }
    });

  });

});


/* Add new message */
var add_message = function (data,callback) {

  

  Conversation.create({
    sender_id     :   data['sender_id'],
    recepient_id  :   data['recepient_id'],
    message       :   data['message'],
    created_datetime: new Date(),
    created_ip    :   data['ip']
  })
  callback(true);

}

function getIp(socket) {
  var socketId  = socket.id;
  var clientIp  = socket.request.connection.remoteAddress;
  return clientIp;
}

app.use('/', router);

http.listen(8080,function(){
  console.log("Listening on 8080");
});

