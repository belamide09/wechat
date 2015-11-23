// Require modules
var express     =     require('express');
var multer      =     require('multer');
var app         =     express();
var mysql       =     require("mysql");
var http        =     require('http').Server(app);
var io          =     require("socket.io")(http);
var router      =     express.Router();
var getIP       =     require('ipware')().get_ip;
var requestIp   =     require('request-ip');
var dateFormat  =     require('dateformat');
var bodyParser  =     require('body-parser');
var upload      =     multer();

var days        = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
}

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

var User                  = require('./app/models/User');
var Conversation          = require('./app/models/Conversation');
var Friend                = require('./app/models/Friend');
var FriendRequest         = require('./app/models/FriendRequest');
var Post                  = require('./app/models/Post');
var Comment               = require('./app/models/Comment');
var Notification          = require('./app/models/Notification');

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

// for chat uploads
app.use(multer({ dest: './../app/webroot/uploads/',
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log( file.originalname + ' is starting ...' );
  },
  onFileUploadComplete: function (file) {
    console.log( file.fieldname + ' uploaded to  ' + file.path )
  }
}));


router.route('/messages/uploadPhoto')

.post(function(req,res) {

  res.header("Access-Control-Allow-Origin", "*");

  upload(req,res,function(err) {
    if( err ) {
      return res.end("0");
    } else {
      res.end(req.files['chatPhoto']['name']);
    }
  });

});

router.route('/posts/add')

.post(function(req,res) {

  res.header("Access-Control-Allow-Origin", "*");
  var data = req.body;


  if ( typeof(req.files['postPhoto']) != 'undefined' ) {
    upload(req,res,function(err) {
      Post.create({
        user_id       :   data['user_id'],
        text          :   data['text'],
        file          :   req.files['postPhoto']['name'],
        created_datetime: dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss"),
        created_ip    :   requestIp.getClientIp(req)
      }).done(function() {
        // Redirect to referer
        res.redirect(req.headers['referer']);
        res.end();
      })
    });
  } else {
    Post.create({
      user_id       :   data['user_id'],
      text          :   data['text'],
      created_datetime: dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss"),
      created_ip    :   requestIp.getClientIp(req)
    }).done(function() {
      // Redirect to referer
      res.redirect(req.headers['referer']);
      res.end();
    })
  }

});


router.route('/getNotifications/:user_id')

.get(function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  Notification.belongsTo(User, {
    constraints: false,
    foreignKey: 'user_id'
  });
  Notification.findAll({
    where: {
      user_id : req.params['user_id'],
      has_read: 0
    },
    include: [User]
  }).done(function(results) {

    res.render('notifications.html',{results:results});

  })

})


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
      created_datetime: dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
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
        where: { 
          recepient_id  : recepient_id,
          status        : 0
        },
        include: [{
          model: User,
          required: true
        }]
      }).then(function(results) {

      io.emit('return_friend_requests',{recepient_id:recepient_id,requests:results});
    
    });

  });

  socket.on('response_friend_request_evt',function(data) {

    FriendRequest.update({status: data['status']},{
      where: { id : data['friend_request_id'] }
    }).done(function() {

      if ( data['status'] == 1 ) {


        // Another syntax for save
        /*
          Friend.build({
            user_id           : data['user_id'],
            friend_id         : data['friend_id'],
            created_datetime  : new Date(),
            created_ip        : getIp(socket)
          }).save();
        */

        Friend.create({

          user_id           : data['user_id'],
          friend_id         : data['friend_id'],
          created_datetime  : dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
          created_ip        : getIp(socket)

        }).done(function() {

        Friend.create({
          user_id           : data['friend_id'],
          friend_id         : data['user_id'],
          created_datetime  : dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
          created_ip        : getIp(socket)
        }).done(function() {

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
      attributes: ['recepient_id','sender_id','message','file'],
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

  socket.on('add_comment',function(data) {
    var date  = new Date();
    var day   = date.getDay();
    var date  = dateFormat(date, "m/d/yyyy");
    date      = date + " (" + days[day] + ") " + dateFormat(new Date(), "hh:mm");
    data['created_datetime'] = date;
    Comment.create({

      post_id : data['post_id'],
      user_id : data['user_id'],
      comment : data['comment'],
      created_datetime: dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
      created_ip    :   getIp(socket)

    }).done(function() {
      io.emit('append_comment',data);
      io.emit('return_notification',{data:'success'});
    })

  });

  socket.on('add_notification',function(data) {

    Notification.create({

      post_id       : data['post_id'],
      user_id       : data['user_id'],
      type          : data['type'],
      has_viewed    : 0,
      has_read      : 0,
      created_datetime: dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
      created_ip    :   getIp(socket)
    
    }).done(function() {

      Notification.count({
        where: { 
          user_id     : data['user_id'],
          has_viewed  : 0
        }
      }).done(function(count) {

        io.emit('return_total_notification',{user_id:data['user_id'],count:count});

      })

    })

  })

  socket.on('view_all_notifications',function(user_id) {

    Notification.update({has_viewed:1},{
      where: { user_id : user_id }
    }).done(function() {
      io.emit('view_all_notifications',user_id);
    });

  });

});


/* Add new message */
var add_message = function (data,callback) {

  Conversation.create({

    sender_id     :   data['sender_id'],
    recepient_id  :   data['recepient_id'],
    message       :   data['message'],
    file          :   data['file'],
    created_datetime: dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"),
    created_ip    :   data['ip']

  }).done(function() {

    callback(true);

  })

}

function getIp(socket) {
  var socketId  = socket.id;
  var clientIp  = socket.request.connection.remoteAddress;
  return clientIp;
}

app.use('/', router);

http.listen(3000,function(){
  console.log("Listening on 3000");
});

