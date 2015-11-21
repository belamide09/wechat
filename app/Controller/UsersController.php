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
class UsersController extends Controller {
	public $useTable = 'User';
	public $components = array(
    'Session',
    'Auth'
	);
	public $uses = array(
		'User'
	);
	public function beforeFilter() {
		$this->Auth->allow(array('signup'));
		parent::beforeFilter();
	}
	public function signup() {
		if ( $this->request->is('post') ) {
			$data 		= $this->request->data['User'];
			$password = Security::hash($data['password'], NULL, TRUE);

			$data = array('User' => array(
				'name' 			=> $data['name'],
				'username' 	=> $data['username'],
				'password' 	=> $password
				)
			);
			if ( $this->User->save($data) ) {
				return $this->redirect('/');
			} else {
				$this->set('errors',$this->User->validationError);
			}
		}
	}
	public function login() {
		if ( $this->request->is('post') ) {
			$password = Security::hash($this->request->data['User']['password'], NULL, TRUE);
			$conditions = array(
				'User.username' => $this->request->data['User']['username'],
				'User.password' => $password
			);
			$user = $this->User->find('first',array('conditions' => $conditions));
			if ( isset($user['User']) ) {
				$this->Auth->login($user['User']);
				return $this->redirect('/home');
			} else {
				$error = 'Incorrect username and password';
				$this->set(compact('error'));
			}
		}
	}

	public function logout() {
		$this->autoRender = false;
		$this->Auth->logout();
		return $this->redirect('/');
	}
	
}
