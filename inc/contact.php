<?php
	require 'class.phpmailer.php';

	if(!$_GET['name']){ 
		echo json_encode(array(
			'success' => 0,
			'errorCode' => 1,
			'message' => 'No name provided'
		)); 
		
		return;  
	} 
	if(!$_GET['email']){  
		echo json_encode(array(
			'success' => 0,
			'errorCode' => 2,
			'message' => 'No email address provided'
		)); 
		
		return;  
	} 
	if(!$_GET['message']){ 
		echo json_encode(array(
			'success' => 0,
			'errorCode' => 3,
			'message' => 'No message provided'
		)); 
		
		return;  
	} 

	if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*$/i", $_GET['email'])) {  
		echo json_encode(array(
			'success' => 0,
			'errorCode' => 2,
			'message' => 'No email address provided'
		)); 
		
		return;  
	}

	$mail = new PHPMailer();
	#$mail->IsSendmail();
	$mail->SetFrom($_GET['email'], $_GET['name']);


	/* Update the following 2 lines in order to receive mail from the contact form... */
	$mail->AddAddress('effekthemes@gmail.com', 'Your Name');
	$mail->Subject = 'Contact form submission';
	

	$message = "Phone: " . $_GET['phone'] . "<br /><br />" . $_GET['message'];
	$messageAlt = "Phone: " . $_GET['phone'] . "\r\n\r\n" . $_GET['message'];

	$mail->MsgHTML($message);
	$mail->AltBody = $messageAlt;

	if(!$mail->Send()) {

		echo json_encode(array(
			'success' => 0,
			'errorCode' => 4,
			'message' => $mail->ErrorInfo
		)); 
		
		return;  	
	} else {

		echo json_encode(array(
			'success' => 1,
			'message' => "We'll be in touch real soon!"
		)); 
		
		return;  	
	}
?>