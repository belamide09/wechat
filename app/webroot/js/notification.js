var container = null;
var visible_friend_request = false;
$(document).ready(function() {
    
    $(".notificationLink").click(function() {
        visible_friend_request = false;
        container = $(this).parent();
        container.find(".notificationContainer").fadeToggle(300);
        return false;
    });

    //Document Click hiding the popup 
    $(document).click(function() {
        if ( container != null ) {
            visible_friend_request = true;
            container.find(".notificationContainer").hide();
        }
    });
    $(".btn-add-friend").click(function() {
        $(this).attr('disabled');
        $(this).attr('class','btn-add-friend disabled');
        $(this).html('Friend request sent...');
        return false;
    })

    $("#friend_request .notificationLink").click(function() {
        socket.emit('get_friend_requests',my_id);
    })

    socket.on('return_friend_requests',function(data) {

        console.log(data);
        if ( data !== null && data['recepient_id'] == my_id) {
            var requests = data['requests'];

            var container = "<div class='request-container'>";
                container += "<table>";
            for(var x in requests) {
                var request = requests[x]['user'];
                container += "<tr>";
                container += "<td><div class='image'><center><img src='/users/" + request['photo'] + "'></center></div></td>";
                container += "<td><a href=''>" + request['name'] + "</a></td>";
                container += "<td><input type='hidden' value='"+ requests[x]['request_id'] +"' class='id'><a href='' class='btn-accept'>Accept</a></td>";
                container += "<td><input type='hidden' value='"+ requests[x]['request_id'] +"' class='id'><a href='' class='btn-reject'>Reject</a></td>";
                container += "</tr>";
            }
            container += "</table></div>";
            $("#friend_request .notificationsBody").html(container);
            $(".btn-accept").click(function() {
                var container = $(this).parent().parent();
                var id = container.find('.id').val();

                var data = {};
                data['friend_request_id'] = id;
                data['status']      = 1;
                data['user_id']     = my_id;
                data['friend_id']   = request['id'];


                socket.emit('response_friend_request_evt',data);
                container.fadeOut();


                return false;
            })

            $(".btn-reject").click(function() {
                 var container = $(this).parent().parent();
                var id = container.find('.id').val();

                var data = {};
                data['friend_request_id'] = id;
                data['status']      = 2;
                data['user_id']     = my_id;
                data['friend_id']   = request['id'];


                socket.emit('response_friend_request_evt',data);
                container.fadeOut();


                return false;
            })
        }


    });

    socket.on('append_friend_request',function(data) {

        if ( data !== null ) {
            if ( data['recepient_id'] == my_id) {
                $("#friend_request .notification_count").html(data['count']);
            }
        }

    });

});


function sendFriendRequest(user_id) {

    var data                = {};
    data['sender_id']       = my_id;
    data['recepient_id']    = user_id; 
    socket.emit('friend_request_evt',data);

    setTimeout(function(){
        location.reload();
    }, 500);   

}