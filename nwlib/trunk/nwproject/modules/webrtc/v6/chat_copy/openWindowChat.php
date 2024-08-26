<?php

$url = $_GET["url"];
$url = str_replace("{", "", $url);
$url = str_replace("}", "", $url);
echo "Redireccionando a " . $url;
header("Location: $url");
end();
