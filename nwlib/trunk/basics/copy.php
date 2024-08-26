<?php

if (!isset($_GET["product"])) {
    return;
}
if (!isset($_GET["key"])) {
    return;
}
if ($_GET["key"] !== "1019029476") {
    return;
}
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
nwMaker::checkSession();

$product = $_GET["product"];
//$product = 9; //taskenter
//$product = 8; //ringow
$table = "pv_clientes";
if ($product === "8" || $product === "6" || $product === "11") {
    $table = "usuarios";
}
$usuario = "usuario_cliente";
$updateusersprincipal = false;
$updateusercode = true;

if ($table === "usuarios") {
    $usuario = "usuario";
}
echo "<h1>UPDT</h1>";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);
$cd = new NWDbQuery($db);
$ca->prepareSelect("terminales a left join paises b on(a.pais=b.id)", "a.id,a.usuario,b.alias", " 1=1");
if (!$ca->exec()) {
    return "Error. " . $ca->lastErrorText();
}
echo "terminales: " . $ca->size() . "<br />";
if ($ca->size() > 0) {
    for ($i = 0; $i < $ca->size(); $i++) {
        $r = $ca->flush();
//        $cb->prepareSelect($table, "*", " account_code_activation IS NULL and terminal=:terminal");
        $cb->prepareSelect($table, "*", "terminal=:terminal");
        $cb->bindValue(":terminal", $r["id"]);
        if (!$cb->exec()) {
            echo "Error. " . $cb->lastErrorText();
        }
        if ($cb->size() > 0) {
            echo "PRINCIPAL " . $r["usuario"] . "----<br />";
            for ($ia = 0; $ia < $cb->size(); $ia++) {
                $rr = $cb->flush();
                if ($ia === 0) {
                    if ($updateusersprincipal) {
                        $cc->prepareUpdate($table, "usuario_principal", "terminal=:terminal");
                        $cc->bindValue(":terminal", $r["id"]);
                        $cc->bindValue(":id", $rr["id"]);
                        $cc->bindValue(":usuario_principal", $r["usuario"]);
                        if (!$cc->exec()) {
                            echo "Error. " . $cc->lastErrorText();
                        }
                    }
                }
                $cons = "";
                $date = "";
                if ($updateusercode) {
                    $rr["clave"] = $rr["email"];
                    $rr["email_principal"] = $r["usuario"];
                    $rr["pais_all_data"] = Array();
                    $rr["pais_all_data"]["alias"] = $r["alias"];
                    $serv = nwMaker::crearCuentaAPI($rr, $product);
//                    $serv = nwMaker::consumeServiceLady($rr, $product);
                    $rta = json_decode($serv, true);
                    $cons = $rta["codigo_activacion"];
                    $date = $rta["fecha_expiracion"];
                    $cd->prepareUpdate($table, "account_code_activation,account_date_expiration", "id=:id");
                    $cd->bindValue(":account_code_activation", $cons);
                    $cd->bindValue(":account_date_expiration", $date);
                    $cd->bindValue(":id", $rr["id"]);
                    if (!$cd->exec()) {
                        $db->rollback();
                        echo "Error. " . $cd->lastErrorText();
                        return false;
                    }
                }
                echo "terminal: {$r["usuario"]} " . $rr["{$usuario}"] . " code active:{$cons} expire: {$date} <br />";
            }
        }
    }
}

