<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//$link = "<a href='/'>hola</a> que pasa a ver <h1><a href='/inicio'>dos</a></h1> pero por favor claro que <a href='http://www.eltiempo.com'>si</a> o no <a href='http://nwp5.loc/inicio'>sé</a>";
//$u = nwMaker::getHref($link);
//$t = count($u);
//$lang = "/en";
//foreach ($u as $key => $value) {
//    $pos = strrpos($value, "http");
//    $poshost = strrpos($value, $hostname);
//    if ($value === "/") {
//        $link = str_replace('href="/"', 'href="' . $lang . '/"', $link);
//        $link = str_replace("href='/'", "href='" . $lang . "/'", $link);
//    } else
//    if ($pos === false) {
//        $link = str_replace($value, $lang . $value, $link);
//    }
//}
//echo "changed: " . $link . "<br />";
//return;

$text = '<h1>Hola</h1> <div>amigo, <strong style="font-size: 20px;">que pasa</strong></div>';
$langOrigin = "es";
$langTranslate = "en";

//$rest = substr("es-CO", 0, 2);
//echo $rest;
//return;

$tr = nwprojectOut::nwTranslate($text, $langOrigin, $langTranslate, function($r) {
            if (isset($r["error"])) {
                echo $r["error"];
                return;
            }
            echo "<br />CALLBACK " . $r["source"];
            echo "<br />CALLBACK " . $r["translation"];
        });
//if (isset($tr["error"])) {
//    echo $tr["error"];
//    return;
//}
//echo $tr["source"];
//echo "<br />";
//echo $tr["translation"];
