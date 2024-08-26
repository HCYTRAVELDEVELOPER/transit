<?php

/*
  This call sends 2 messages to 2 different recipients.
 */

if (!isset($MJ_APIKEY_PUBLIC)) {
    echo "Error, missing MJ_APIKEY_PUBLIC";
    return false;
}
if (!isset($MJ_APIKEY_PRIVATE)) {
    echo "Error, missing MJ_APIKEY_PRIVATE";
    return false;
}
if (!isset($contacts)) {
    echo "Error, missing contacts";
    return false;
}
if (!isset($subject)) {
    echo "Error, missing subject";
    return false;
}
if (!isset($body)) {
    echo "Error, missing body";
    return false;
}
if (!isset($from_email)) {
    echo "Error, missing from_email";
    return false;
}
if (!isset($from_name)) {
    echo "Error, missing from_name";
    return false;
}

//require 'vendor/autoload.php';
//require $_SERVER['DOCUMENT_ROOT'] . '/nwlib6/nwproject/modules/emails_masivos/vendor/autoload.php';
require $_SERVER['DOCUMENT_ROOT'] . '/app/emails_masivos/vendor/autoload.php';

use \Mailjet\Resources;

$mj = new \Mailjet\Client($MJ_APIKEY_PUBLIC, $MJ_APIKEY_PRIVATE, true, ['version' => 'v3.1']);

$Messages = [];

for ($i = 0; $i < count($contacts); $i++) {
    $con = $contacts[$i];
    
    $s = $subject;
    $s = str_replace("{name}", $con["name"], $s);
    $s = str_replace("{email}", $con["email"], $s);
    $s = str_replace("[name]", $con["name"], $s);
    $s = str_replace("[email]", $con["email"], $s);
    
    $b = $body;
    $b = str_replace("{name}", $con["name"], $b);
    $b = str_replace("{email}", $con["email"], $b);
    $b = str_replace("[name]", $con["name"], $b);
    $b = str_replace("[email]", $con["email"], $b);
    
    $Messages2 = [
        'From' => [
            'Email' => $from_email,
            'Name' => $from_name
        ],
        'To' => [
            [
                'Email' => $con["email"],
                'Name' => $con["name"]
            ]
        ],
        'Subject' => $s,
        'TextPart' => $b,
        'HTMLPart' => $b
    ];
    array_push($Messages, $Messages2);
}

$body = [
    'Messages' => $Messages
];
$response = $mj->post(Resources::$Email, ['body' => $body]);
$response->success();
return $response->getData();
