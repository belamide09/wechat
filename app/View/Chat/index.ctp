<script> 
	var my_id = "<?php echo $my_id; ?>";
	var my_name = "<?php echo $my_name; ?>"; 
	var my_photo = "<?php echo $my_photo; ?>"; 
	var friends = <?php echo json_encode($friends); ?>
</script>
<?php echo $this->element('chat_side_bar'); ?>
<?php echo $this->element('notification'); ?>


<form action="http://localhost:3000/messages/uploadPhoto" method="post" id="chat-file" enctype="multipart/form-data">
	<input type="text" class="message" name="message">
	<input type="file" class="file" name="chatPhoto" accept="image/.jpeg,.jpg,.png,.gif">
</form>
<?php echo $this->element('post_box')?>
<?php echo $this->element('posts')?>