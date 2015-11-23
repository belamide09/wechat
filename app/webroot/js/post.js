


$(document).ready(function() {

	$("#browsePostPhoto").click(function() {

		$("#postPhoto").click();

	})

	$(".post .txt-comment").keypress(function(e) {

		if ( e.keyCode == 13 ) {

			var container = $(this).closest('.post');
			var data = {};
			data['post_id'] 			= container.find('.post-id').val();
			data['user_id'] 			= my_id;
			data['comment'] 			= $(this).val();
			data['sender_name'] 	= my_name;
			data['sender_photo'] 	= my_photo;

			socket.emit('add_comment',data);
			
			$(this).val("");

			if ( container.find('.author-id').val() != my_id ) {

				var notification 				= {};
				notification['post_id']	= container.find('.post-id').val();
				notification['user_id']	= container.find('.author-id').val();
				notification['type'] 		= 2;

				socket.emit('add_notification',notification);

			}

		}

	})

	$(".btn-viewed-notifications").click(function() {

		socket.emit('view_all_notifications',my_id);
		var url = socket.io.uri + "/getNotifications/" + my_id;
		$.get(url,function(data) {
			$("#notifications .notificationsBody").html("")
			$("#notifications .notificationsBody").html(data);
		});

	})

})

socket.on('append_comment',function(data) {

	var comment = '<div class="comment">';
	comment += '<table>';
	comment += '<tr><td>';
	comment += '<div class="users-image">';
	comment += '<img src="users/'+data['sender_photo']+'">';
	comment += '</div></td>';
	comment += '<td><div class="name">';
	comment += data['sender_name']+'<br>';
	comment += '<div class="comment">'+data['comment'] + '</div>';
	comment += '<span class="time"> ' + data['created_datetime'] + '</time>';
	comment += '</div></td>';
	comment += '</tr></table></div>';
	$("#post" + data['post_id']+" .comments").prepend(comment);

});

socket.on('return_total_notification',function(data) {

	if ( data['user_id'] == my_id ) {
		$("#notifications .notification_count").html(data['count']);
	}

});

socket.on('view_all_notifications',function(user_id) {

	if ( user_id == my_id ) {
		$("#notifications .notification_count").html("0");
	}

})