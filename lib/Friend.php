<?php

class Friend {

	public static function getFriends() {
		$fields = array(
			'User.id',
			'User.name',
			'User.photo'
		);
		$joins 		= array(
			array(
				'table' => 'users',
				'alias' => 'User',
				'conditions' => 'User.id = Friend.friend_id'
			)
		);
		$conditions = array(
			'Friend.user_id' => $my_id
		);
		$users = $this->Friend->find('all',array(
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
	}
}