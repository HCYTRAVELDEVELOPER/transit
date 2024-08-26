<?php
$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

if (isset($_GET["ringow"])) {
    $a = Array();
    $a["terminal"] = "ALL";
    $a["noperfil"] = "NO";
    $a["where"] = " conectado='SI' and a.fecha_ultima_conexion >=:fecha_menor ";
    $a["order"] = "";
    $a["order"] .= "fecha_ultima_llamada_atendida asc,";
    $a["order"] .= "llamadas_atendidas desc,llamadas_linea asc,llamadas_en_cola asc,RAND()";
    $ops = soporte::consultaHistorialVisitas($a);
    print_r($ops);
    return;
}

$r = Array();
$r["header"] = "<div style='font-size:40px;'>Este es el header <img src='https://www.gruponw.com/imagenes/logoNW04_ss.jpg' /></div>";
$r["footer"] = "Este es el footer Number <span class='num'></span>";
$r["body"] = "este es el body";
for ($i = 0; $i < 1000; $i++) {
    $r["body"] .= "este es el body";
}
print nwMaker::printHeaderFooter($r);
?>
<style>
    @media print {
        .num {
            counter-reset: section;
        }
        .num:before {
            counter-increment: section;
            content: counters(section,".") " ";
        }
    }
</style>


