
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
		'Friend',
		'FriendRequest',
		'User'
	);

	private function getEmployeeInfo() {
		$data = array(
			'my_id' 		=> $this->Auth->user('id'),
			'my_name' 	=> $this->Auth->user('name')
		);
		return $data;
	}

	public function getFriends() {
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
		$total_friend_request = $this->countFriendRequest();
		$friends = $this->getFriends();
		$this->set(compact('total_friend_request'));
		$this->set(compact('friends'));
		$this->set($this->getEmployeeInfo());
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