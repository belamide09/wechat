<?php
/**
 *
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
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = __d('cake_dev', 'CakePHP: the rapid development php framework');
$cakeVersion = __d('cake_dev', 'CakePHP %s', Configure::version())
?>
<!DOCTYPE html>
<html>
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $cakeDescription ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->meta('icon');

		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
		echo $this->Html->css('chatbox');
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('notification');
    echo $this->Html->css('post');
    echo $this->Html->script('jquery-1.10.2');
    echo $this->Html->script('jquery.form.min');
    echo $this->Html->css('bootstrap.min');
    echo $this->Html->script('http://localhost:3000/socket.io/socket.io.js');
    echo $this->Html->script('bootstrap');
    echo $this->Html->script('jquery-1.10.2');
    echo $this->Html->script('bootstrap.min');
    echo $this->Html->script('chatbox');
    echo $this->Html->script('notification');
    echo $this->Html->script('post');
	?>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.51/jquery.form.min.js"></script>
</head>
<body>
	<?php echo $this->fetch('content'); ?>
</body>
</html>
