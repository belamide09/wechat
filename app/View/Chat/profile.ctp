<style>
#main-container {
	margin-top: 50px;
}
#profile-image {
	width: 250px;
	height: 220px;
	overflow: hidden;
	background: #fff;
}
#profile-image img {
	max-height: 100%;
	max-width: 100%;
}
.profile-name {
	font: 20px "Trebuchet" sans-serif;
}
.btn-friend,.btn-add-friend {
	border-radius: 3px;
 	margin: 1px 5px;
  background: #3b5998;
  color: #fff;
  padding: 5px;
  border: none;
  cursor: pointer;
}
.disabled {
	opacity: 0.7;
}
</style>
<script> 
	var my_id = "<?php echo $my_id; ?>";
	var my_name = "<?php echo $my_name; ?>"; 
	var friends = <?php echo json_encode($friends); ?>
</script>
<?php echo $this->element('chat_side_bar'); ?>
<?php //echo $this->element('notification'); ?>
<div id="main-container">
	<div id="profile-image">
		<center>
	 		<img src="/users/<?php echo $profile['User']['photo'];?>">
	 	</center>
	</div>
	<big> <a href="#" class="profile-name"> <?php echo $profile['User']['name']?> </a> </big>

	<?php 
		if ( !$is_friend && !$friend_request  && $profile['User']['id'] !== $my_id ) {
			echo $this->Form->button('Add Friend',array(
				'class' => 'btn-add-friend',
				'onclick' => 'sendFriendRequest('.$profile['User']['id'].')'
			));
		} if ( !$is_friend && $friend_request  && $profile['User']['id'] !== $my_id ) {
				echo $this->Form->button('Friend request sent...',array(
					'class' => 'btn-add-friend disabled',
					'disabled'
				));
		} if ( $is_friend && $profile['User']['id'] !== $my_id ) {
			echo $this->Form->button('Friend',array(
					'class' => 'btn-friend'
				));
		}
		?>
</div>