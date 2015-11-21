<script> 
	var my_id = "<?php echo $my_id; ?>";
	var my_name = "<?php echo $my_name; ?>"; 
	var friends = <?php echo json_encode($friends); ?>
</script>
<?php echo $this->element('chat_side_bar'); ?>
<?php echo $this->element('notification'); ?>