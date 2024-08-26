<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$p = $_POST;

$table = nwprojectOut::getTableByHash($p);

$fields = "";
$r = $p["fields"];
$total = count($r);
$id = "";
for ($i = 0; $i < $total; $i++) {
    if ($r[$i]["name"] == "id") {
        $id = $r[$i]["value"];
    } else {
        $name = $r[$i]["name"];
        $value = $r[$i]["value"];
        $fields .= $name;
        if ($i + 1 != $total)
            $fields .= ", ";
    }
}

if (isset($_SESSION["usuario"])) {
    $fields .= ",usuario";
}
if ($id == "") {
    $ca->prepareInsert($table, $fields);
} else {
    $ca->prepareUpdate($table, $fields, "id=:id");
    $ca->bindValue(":id", $id);
}
for ($i = 0; $i < $total; $i++) {
    $name = $r[$i]["name"];
    $value = $r[$i]["value"];
    $ca->bindValue(":{$name}", $value);
}
if (isset($_SESSION["usuario"])) {
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
}
if (!$ca->exec()) {
    echo "Error. " . $ca->lastErrorText();
    return;
}
echo "Enviado correctamente";
return true;