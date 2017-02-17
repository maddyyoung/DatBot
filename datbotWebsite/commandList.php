<!DOCTYPE html>
<?php
	require_once 'requirements.php';
	
?>
<html>
<head>
	<meta charset=”UTF-8”>
	<link rel="stylesheet" type="text/css" href="css.css"/>
	<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,400i,700" rel="stylesheet">
	<title>here come datbot!!!!!!</title>
	<script type="text/javascript" src="jquery-3.1.1.js"></script>
	<script src="stickyNav.js"></script>
</head>
<body>

<div id ="wrapper">
<?php
	include 'headerAndNavBar.php';
?>
	<div id = "commandListContent">
		<div class="commands">
			<h2>General Commands</h2>
			<ul>
			<?php
				$genComm = $commandsCollection->find(['type' => 'General']);
				foreach ($genComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'" class="commandLink">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="commands">
			<h2>Time Commands</h2>
			<ul>
			<?php
				$timeComm = $commandsCollection->find(['type' => 'Time']);
				foreach ($timeComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'" class="commandLink">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="commands">
			<h2>Alias Commands</h2>
			<ul>
			<?php
				$aliasComm = $commandsCollection->find(['type' => 'Alias']);
				foreach ($aliasComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'" class="commandLink">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="commands">
			<h2>Quote Commands</h2>
			<ul>
			<?php
				$quoteComm = $commandsCollection->find(['type' => 'Quote']);
				foreach ($quoteComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'" class="commandLink">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="commands">
			<h2>Karma Commands</h2>
			<ul>
			<?php
				$karmaComm = $commandsCollection->find(['type' => 'Karma']);
				foreach ($karmaComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'" class="commandLink">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="alias">
			<h2 id="aliasTitle"><a href="aliases.php" id="aliasLink">Aliases</a></h>
		</div>
	</div>
</div>

</body>
</html>