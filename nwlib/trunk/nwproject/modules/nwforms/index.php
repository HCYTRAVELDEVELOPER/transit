<?php

if (isset($paramObject)) {
    if ($paramObject != 0 || $paramObject != "") {
        $parametrosObjeto = explode("&", $paramObject);
        if (isset($parametrosObjeto[0])) {
            $paramOne = explode("=", $parametrosObjeto[0]);
            $_GET["form"] = $paramOne[1];
        }
        if (isset($parametrosObjeto[1])) {
            $paramOne = explode("=", $parametrosObjeto[1]);
            $nwtablemaker = $paramOne[1];
        }
    }
}
include 'main.php';
