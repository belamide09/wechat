

<?php

if ( isset($error) ) {
	echo "<big><span style='color:red;'>$error</span></big>";
}
echo $this->Form->create('User');
echo $this->Form->input('username',array(
	'placeholder' => 'Enter username',
	'required'
	)
);
echo $this->Form->input('password',array(
	'placeholder' => 'Enter password',
	'required'
	)
);
echo $this->Form->end('Log in');
echo $this->Html->link('Sign up',array(
	'controller' => 'users',
	'action' => 'signup'
	)
);
