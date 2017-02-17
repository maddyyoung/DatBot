<!DOCTYPE html>
<?php
	require_once 'requirements.php';
?>
<html>
<head>
	<meta charset=”UTF-8”>
	<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,400i,700" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css.css"/>
	<title>here come datbot!!!!!!</title>
	<script type="text/javascript" src="jquery-3.1.1.js"></script>
	<script src="stickyNav.js"></script>
</head>
<body>
<div id="commandWrapper">
	<?php
		include 'headerAndNavBar.php';
	?>
	<div id="command">
	<?php
		if (isset($_GET["command"])){
			$comm = $_GET["command"];
			if ($comm){
				$command = $commandsCollection->findOne(['commandName' => $comm]);
				echo '<h1>!'.strtoupper($command['commandName']).'</h1>';
				echo '<p>'.htmlspecialchars($command['syntax']).'</p>';
				echo '<p>'.$command['desc'].'</p>';
			}	
		} 

	?>
	</div>
</div>
</body>
</html>