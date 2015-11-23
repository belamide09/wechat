
<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Controller', 'Controller');
App::uses('Security', 'Utility');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class ChatController extends Controller {
	public $components = array(
		'Auth',
    'Session'
	);
	public $uses = array(
		'Comment',
		'Friend',
		'FriendRequest',
		'Notification',
		'Post',
		'User'
	);

	private function getEmployeeInfo() {
		$data = array(
			'my_id' 		=> $this->Auth->user('id'),
			'my_name' 	=> $this->Auth->user('name'),
			'my_photo'  => $this->Auth->user('photo')
		);
		return $data;
	}

	private function getPosts($id) {
		$friends = $this->Friend->find('list',array(
			'fields' => array('Friend.friend_id'),
			'conditions' => array(
				'Friend.user_id' => $id
			))
		);
		$friends[] = $id;
		$conditions = array(
			'OR' => array(
				'Post.user_id' => $friends
			)
		);
		$posts = $this->Post->find('all',array(
			'conditions' => $conditions
			)
		);
		for($x = 0 ; $x < count($posts) ; $x++) {
			$post = $posts[$x];
			$post_id = $post['Post']['id'];
			$comments = $this->Comment->find('all',array(
				'conditions' => array(
					'Comment.post_id' => $post_id
				),
				'order' => array('Comment.id' => 'DESC')
				)
			);
			$posts[$x]['Comment'] = $comments;
		}
		return $posts;
	}

	private function getFriends() {
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
			'Friend.user_id' => $this->Auth->user('id')
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
		return $friends;
	}

	public function index() {
		$posts = $this->getPosts($this->Auth->user('id'));
		$total_notifications = $this->countNotifications();
		$total_friend_request = $this->countFriendRequest();
		$friends = $this->getFriends();
		$this->set(compact('total_notifications'));
		$this->set(compact('total_friend_request'));
		$this->set(compact('friends'));
		$this->set(compact('posts'));
		$this->set($this->getEmployeeInfo());
	}

	public function countNotifications() {
		$conditions = array(
			'Notification.user_id' => $this->Auth->user('id'),
			'Notification.has_viewed' => 0
		);
		$total = $this->Notification->find('count',array(
			'conditions' => $conditions
			)
		);
		return $total;
	}

	public function countFriendRequest() {
		$conditions = array(
			'FriendRequest.recepient_id' => $this->Auth->user('id'),
			'FriendRequest.status' => 0
		);
		$total = $this->FriendRequest->find('count',array(
			'conditions' => $conditions
			)
		);
		return $total;
	}

	public function profile($id = '') {
		$profile = $this->User->findById($id);
		$friends = $this->getFriends();
		$conditions = array(
			'Friend.user_id' => $this->Auth->user('id'),
			'Friend.friend_id' => $id
		);
		$is_friend = $this->Friend->find('first',array(
			'conditions' => $conditions
			)
		);
		$conditions = array(
			'FriendRequest.userId' => $this->Auth->user('id'),
			'FriendRequest.recepient_id' => $id,
			'FriendRequest.status' => 0
		);
		$friend_request = $this->FriendRequest->find('first',array(
			'conditions' => $conditions
			)
		);
		$is_friend = isset($is_friend['Friend']) ? true : false;
		$this->set(compact('is_friend'));
		$this->set(compact('friend_request'));
		$this->set(compact('profile'));
		$this->set(compact('friends'));
		$this->set($this->getEmployeeInfo());
	}
}