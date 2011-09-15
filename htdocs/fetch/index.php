<?php

define('URL_INFO', 'http://gatherer.wizards.com/Handlers/InlineCardSearch.ashx?nameFragment=%s&cacheBust=%s');
define('URL_IMAGE', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=%s&type=card');

//$card_name = $_POST['card_name'];
$card_name = urlencode($_GET['card_name']);

if (!$card_name) {
	echo '[error] card_name is required';
	exit;
}

// Fetch the card ID
$url = sprintf(URL_INFO, $card_name, time());
$data = file_get_contents($url);
$json = json_decode($data);

if (count($json->Results) === 0) {
	echo '[error] no match for ' . $card_name;
	exit;
}

$result = $json->Results[0];
$id = $result->ID;

// Use the ID to find the image URL
$image_url = sprintf(URL_IMAGE, $id);

// Output our data
header('Content-type: application/json');
echo json_encode((object) array(
	'id' => $id,
	'name' => $result->Name,
	'text' => $result->Snippet,
	'imageURL' => $image_url
));
