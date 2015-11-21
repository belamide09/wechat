
<?php

echo $this->Form->create('User');
echo $this->Form->input('name',array(
	'placeholder' => 'Enter name',
	'required'
	)
);
echo $this->Form->input('username',array(
	'placeholder' => 'Enter username',
	'required'
	)
);
echo $this->Form->input('password',array(
	'placeholder' => 'Ente password',
	'required'
	)
);
echo $this->Form->end('Sign up');