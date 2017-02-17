<!DOCTYPE html>
<?php
	require_once 'requirements.php';
?>
<html>
<head>
	<meta charset=”UTF-8”>
	<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,400i,700" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css.css?"<?php echo time(); ?>/>
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
	<?php
		$karmaCollection = $db->selectCollection("karmaReasons");
		$count = 0;
		
		if (isset($_GET["item"])){
			$item = htmlspecialchars(strtoupper($_GET["item"]));
			if ($item){
				echo '<h1>Reasons for '.$item.'</h1>';
				
				$reasons = $karmaCollection->find(['name' => $item, 'change' => 1]);
				echo '<h3>Karma Increased</h3>';
				echo '<ul class="contentList">';
				foreach ($reasons as $reason){
					$count++;
					echo '<li class="listItem">'.$reason['reason'].'</li>';
				}	
				if ($count == 0){
					echo '<li class="listItem">No reasons available</li>';
				}
				echo '</ul>';

				$count = 0;
				$reasons = $karmaCollection->find(['name' => $item, 'change' => -1]);
				echo '<h3>Karma Decreased</h3>';
				echo '<ul class="contentList">';
				foreach ($reasons as $reason){
					$count++;
					echo '<li class="listItem">'.$reason['reason'].'</li>';
				}
				if ($count == 0){
					echo '<li class="listItem">No reasons available</li>';
				}
				echo '</ul>';

				$count = 0;
				$reasons = $karmaCollection->find(['name' => $item, 'change' => 0]);
				echo '<h3>Karma Unchanged</h3>';
				echo '<ul class="contentList">';
				foreach ($reasons as $reason){
					$count++;
					echo '<li class="listItem">'.$reason['reason'].'</li>';
				}
				if ($count == 0){
					echo '<li class="listItem">No reasons available</li>';
				}
				echo '</ul>';
			}	
		}

	?>

	<div id="formDiv">
	<form action = "karma.php" method = "GET">
		<span id="name">Search for Karma Reasons:</span><br /> 
		<input type = "text" name = "item" id="input"/>
		<br />
		<input type = "submit" id="button"/>
	</form>
	</div>
	</div>
</div>

</body>
</html>