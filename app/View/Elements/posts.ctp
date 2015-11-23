<div id="posts">
	<?php foreach($posts as $post): ?>
	<?php
		$post_id 	= $post['Post']['id'];
		$name 		= $post['User']['name'];
		$photo 		= $post['User']['photo'];
		$created 	= date('m/d/Y (D) H:i',strtotime($post['Post']['created_datetime']));
		$description 	= $post['Post']['text'];
		$file 		= $post['Post']['file'];
		$comments = $post['Comment'];
	?>
	<div class="post" id="post<?php echo $post_id; ?>">
		<?php 
			echo $this->Form->hidden('',array(
				'class' => 'post-id',
				'value' => $post_id
				)
			);
			echo $this->Form->hidden('',array(
				'class' => 'author-id',
				'value' => $post['Post']['user_id']
				)
			);
		?>
		<table>
			<tr>
				<td>
				 	<div class="users-image">
				 		<img src="users/<?php echo $photo; ?>">
				 	</div>
				</td>
				<td>
					<div class="name">
						<?php echo $name; ?> <br>
						<span class="time"> <?php echo $created; ?> </time>
					</div>
				</td>
			</tr>
		</table>
		<div class="description">
			<?php if ( !empty($file)) :?>
				<img src="uploads/<?php echo $file?>"><br>
			<?php endif; ?>
			<?php echo $description?>
		</div>
		<div class="comment-box">
			<table>
				<tr>
					<td> 
						<div class="image"><img src="users/<?php echo $my_photo?>"> </div>
					</td>
					<td> <input type="text" class="txt-comment" placeholder="Enter comment"> </td>
				</tr>
			</table>
		</div>
		<div class="comments">
			<?php foreach($comments as $comment): ?>
			<?php $created 	= date('m/d/Y (D) H:i',strtotime($comment['Comment']['created_datetime'])); ?>
			<div class="comment">
				<table>
					<tr>
						<td>
						 	<div class="users-image">
						 		<img src="users/<?php echo $comment['User']['photo']?>">
						 	</div>
						</td>
						<td>
							<div class="name">
								<?php echo $comment['User']['name']?> <br>
								<div class="comment">
									<?php echo $comment['Comment']['comment']?>
								</div>
								<span class="time"> <?php echo $created; ?> </time>
							</div>
						</td>
					</tr>
				</table>
		</div>
		<?php endforeach; ?>
	</div>
	</div>
	<?php endforeach; ?>
</div>