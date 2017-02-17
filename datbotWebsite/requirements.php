<?php
	require 'D:\xampp\php\vendor\autoload.php';
	$mongo = new MongoDB\Client("mongodb://localhost:27017");
	$db = $mongo->selectDatabase("datbotdb");
	/*$collections = $db->listCollections();
	foreach ($collections as $coll) {
    	var_dump($coll);
	}*/
?>