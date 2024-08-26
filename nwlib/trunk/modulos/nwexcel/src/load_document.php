<?php

//include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
function loadDocument($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwexcel_files", "*", "id=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        return "Error . " . $ca->lastErrorText();
    }
    $rta = "";
    if ($ca->size() > 0) {
        $r = $ca->flush();
        $document = $r["texto"];
        $document = str_replace("<table class='axTable'>", "", $document);
        $document = str_replace("<table border='1'><tbody>", "", $document);
        $document = str_replace("<table border='1' class='axTable'>", "", $document);
        $document = str_replace("<table border=\"1\" class=\"axTable\">", "", $document);
        $document = str_replace("</table>", "", $document);
        $document = str_replace("<tbody>", "", $document);
        $document = str_replace("</tbody>", "", $document);
        $rta .= $document;
    }
    return $rta;
}

print loadDocument($_GET["id"]);
?>