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
	<div id="pageContent">
		<h1>Aliases</h1>
		<ul class="aliasList">
		<?php
			$aliasCollection = $db->selectCollection("aliases");
			$aliases = $aliasCollection->find();
			foreach ($aliases as $alias){
				echo '<li class="aliasName">!' . strtolower($alias['name']);
				echo '<ul class="aliasList"><li class="aliasDesc">!'.$alias['command'].'</li></ul>';
				echo '</li>';
			}	
		?>
		</ul>
	</div>
</div>
</body>
</html>