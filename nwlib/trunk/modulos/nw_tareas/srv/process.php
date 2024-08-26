<?php

header('Access-Control-Allow-Origin: *');

$callback = isset($_GET['callback']) ? preg_replace('/[^a-z0-9$_]/si', '', $_GET['callback']) : false;
header('Content-Type: ' . ($callback ? 'application/javascript' : 'application/json') . ';charset=UTF-8');

if (isset($_REQUEST['tag']) && $_REQUEST['tag'] != "") {
    $tag = $_REQUEST['tag'];
    $json = array();

    if ($tag == 'connection') {
        $json['success'] = 'success';
        $json = json_encode($json);

        echo $callback ? "$callback($json)" : $json;
    }
}
?>