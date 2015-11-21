<?php
$joins 		= array(
	array(
		'table' => 'users',
		'alias' => 'User',
		'conditions' => 'User.id = Friend.friend_id'
	)
);
$fields = array(
	'User.id',
	'User.name',
	'User.photo'
);
$conditions = array(
	'Friend.user_id' => $my_id
);
$users = ClassRegistry::init('Friend')->find('all',array(
	'joins' => $joins,
	'fields' => $fields,
	'conditions' => $conditions
	)
);
$friends = array();
foreach($users as $user) {
	$user = $user['User'];
	$friends[$user['id']] = array(
		'id' => $user['id'],
		'name' => $user['name'],
		'photo' => $user['photo']
	);
}
?>
<div class="chat-sidebar">
	<?php foreach($friends as $id => $friend):?>
		<div class="sidebar-name">
      <!-- Pass username and display name to register popup -->
      <a href="javascript:register_popup('<?php echo $id?>', '<?php echo $friend['name']?>');">
      		<?php echo $this->Html->image('/users/'.$friend['photo']); ?>
          <span><?php echo $friend['name']?></span>
      </a>
    </div>
  <?php endforeach; ?>
  <div>
    <center> <a href="<?php echo Router::url('/logout')?>"> Logout </a> </center>
   </div>
</div>