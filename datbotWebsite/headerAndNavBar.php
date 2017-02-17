

<div id="header">
	<h1>HERE COME DATBOT!!!!!!</h1>
	<p>o shit waddup!</p>
</div>

<?php
	$commandsCollection = $db->selectCollection("commands");
	$commands = $commandsCollection->find();
?>
	<ul id="navList">
		<li class="mainItem"><a href="index.php" class="navLink">Home</a></li>
		<div class="dropdown">
			<li class="mainItem">General Commands</li>
				<ul class="dropdown-content">
				<?php
					$genComm = $commandsCollection->find(['type' => 'General']);
					foreach ($genComm as $comm){
						$name = $comm['commandName'];
						echo '<li><a href="command.php?command='.$name.'">!' . $name . '</a></li>';
					}
				?>
				</ul>
		</div>
		<div class="dropdown">
			<li class="mainItem">Alias Commands</li>
			<ul class="dropdown-content">
			<?php
				$aliasComm = $commandsCollection->find(['type' => 'Alias']);
				foreach ($aliasComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="dropdown">
			<li class="mainItem">Karma Commands</li>
			<ul class="dropdown-content">
			<?php
				$karmaComm = $commandsCollection->find(['type' => 'Karma']);
				foreach ($karmaComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
		<div class="dropdown">
			<li class="mainItem">Quote Commands</li>
			<ul class="dropdown-content">
			<?php
				$quoteComm = $commandsCollection->find(['type' => 'Quote']);
				foreach ($quoteComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>	
		<div class="dropdown">
			<li class="mainItem">Time Commands</li>
			<ul class="dropdown-content">
			<?php
				$timeComm = $commandsCollection->find(['type' => 'Time']);
				foreach ($timeComm as $comm){
					$name = $comm['commandName'];
					echo '<li><a href="command.php?command='.$name.'">!' . $name . '</a></li>';
				}
			?>
			</ul>
		</div>
	</ul>
