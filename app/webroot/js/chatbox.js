
var socket = io.connect('http://localhost:3000');
var selected_friend = {};


//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

var popup_arr = {};

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
    delete popup_arr[id];
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);

            $("#" + id).remove();
            
            calculate_popups();
            
            return;
        }
    }   
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 220;
    
    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }
    
    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name)
{
    selected_friend = {'id':id,'name':name};
    popup_arr[id] = name;
    for(var iii = 0; iii < popups.length; iii++)
    {   
        //already registered. Bring it to front.
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
        
            popups.unshift(id);
            
            calculate_popups();
            
            
            return;
        }
    }            
    
    var element = '<div class="popup-box chat-popup" id="'+ id +'">';
    element = element + '<div class="popup-head">';
    element = element + '<div class="popup-head-left"><a class="chat-friend-name" href="/profile/'+id+'" target="_">'+ name +'</a></div>';
    element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
    element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div><input type="text" class="chat-textbox">';
    element = element + '<a class="btn btn-primary btn-xs btn-upload-file"><span class="glyphicon glyphicon-picture"></span></a>';
    element = element + '</div>';

    $("body").append(element);
    $("#" + id + ".popup-box .chat-textbox").keypress(sendMessage);

    $(".btn-upload-file").click(function() {

        $("#chat-file input").click();

    });

    popups.unshift(id);
            
    calculate_popups();

    var data = {partner_id:id,partner_name:name,sender_id:my_id,recepient_id:id};
    socket.emit('get_messages',data);
    
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    
    display_popups();

    
}

socket.on('append_message',function(data) {
    
    if ( (data['sender_id'] == my_id && typeof(friends[data['recepient_id']]) != 'undefined') || 
         (data['recepient_id'] == my_id && typeof(friends[data['sender_id']]) != 'undefined')  ) {
        var id = data['sender_id'];
        if ( data['sender_id'] == my_id ) {
            id = data['recepient_id'];
        }
        if ( typeof(popup_arr[id]) != 'undefined' ) {
            var message = data['sender_name'] + " : ";
            if ( data['file'] != "" ) {
                message += '<br><img src="/wechat/uploads/' + data['file'] + '"><br>';
            }
            message += data['message']+"<br>";
            $("#" + id + " .popup-messages").append(message);
        } else {
            register_popup(id, friends[id]['name']);
        }
    }

});

socket.on('return_messages',function(data) {

    if ( data !== null ) {

        var messages = data['messages'];
        if ( data['sender_id'] == my_id && typeof(friends[data['partner_id']]) != 'undefined'  ) {

            var id = data['partner_id'];
            if ( typeof(friends[id]) != 'undefined' ) {
                var container = $("#" + id + " .popup-messages");
                container.html("");
                var messages_list = "";
                for(var x in messages) {
                    var name = messages[x]['recepient_id'] == my_id ? my_name : name;
                    messages_list += my_name + " : ";
                    if ( messages[x]['file'] != "" ) {
                        messages_list += '<br><img src="/wechat/uploads/' + messages[x]['file'] + '"><br>';
                    }
                    messages_list += messages[x]['message']+"<br>"
                }
                container.html(messages_list);
                var scroll_height = container.prop("scrollHeight") - container.prop("clientHeight");
                container.scrollTop(scroll_height);
            }
        }
    }

});


function sendMessage(evt) {
    if ( evt.keyCode === 13 ) {

        var container   = $(this).closest('.popup-box');
        var msg_container = $(this).closest('.chat-textbox');
        var msg = msg_container.val();
        var id          = container.attr('id');

        if ( $("#chat-file .file")[0].files.length > 0 ) {

            var confirmation = confirm('Would you like to send this uploaded file?');
            if ( confirmation == true ) {

                $("#chat-file .message").val(msg);

                $("#chat-file").ajaxSubmit({
                    error: function(xhr) {
                        $("#chat-file .file").val("");
                        console.log( xhr.status );
                    },
                    success: function(response) {

                        $("#chat-file .file").val("");
                        if ( response != "0" ) {
                            var data = {sender_name:my_name,sender_id:my_id,recepient_id:id,message:msg};
                            data['file'] = response;
                            socket.emit('message_add_evt',data);
                            msg_container.val("");
                        }
                    }
                });

            }


        } else if ( msg != "" ) {
            var data = {sender_name:my_name,sender_id:my_id,recepient_id:id,message:msg};
            data['file'] = '';
            socket.emit('message_add_evt',data);
            msg_container.val("");

        }


    }
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);