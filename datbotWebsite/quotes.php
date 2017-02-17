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
	<div id = "pageContent">
	<?php
		$quotesCollection = $db->selectCollection("quotes");
		$count = 0;
		
		if (isset($_GET["quotee"])){
			$quotee = htmlspecialchars($_GET["quotee"]);
			if ($quotee){
				echo '<h1>Quotes from '.$quotee.'</h1>';
				$quotes = $quotesCollection->find(['quotees' => $quotee]);
				foreach ($quotes as $quote){
					echo '<ul class="contentList">';
					$count++;
					for ($i = 0; $i < sizeof($quote['contentLines']); $i++){
						echo '<li class="listItem">'.htmlspecialchars($quote['contentLines'][$i]).'</li>';
					}
					echo '</ul>';
				}
				if ($count == 0){
					echo '<p>No quotes available for this user</p>';
				}
			}	
		} 

	?>
	<div id="formDiv">
	<form action = "quotes.php" method = "GET">
		<span id="name">Search for Quotes:</span><br /> 
		<input type = "text" name = "quotee" id="input"/>
		<br />
		<input type = "submit" id="button"/>
	</form>
	</div>
	</div>
</div>

</body>
</html>