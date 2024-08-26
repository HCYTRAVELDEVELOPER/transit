<?php

function getInfoEmpresa() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $ca->prepareSelect("empresas", "logo", "id=:id");
    $ca->bindValue(":id", $si["empresa"]);
    if (!$ca->exec()) {
        NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
        return false;
    }
    return $ca->flush();
}

function createHtml() {
    $si = session::info();
    $emp = getInfoEmpresa();
    echo "<table>";
    $count1 = 1;
    $fileNum = 1;
    $total_rows = 99;
    $total_cols = 20;
    $row1 = 4;
    $col1 = 3;
    $rowEnc1 = 3;
    $colEnc1 = 1;
    $rwocolspan = 5;
    $rowEmpresa = 1;
    $colEmpresa = 8;
    if (isset($_GET["maxRows"]))
        $total_rows = $_GET["maxRows"];
    if (isset($_GET["maxCols"]))
        $total_cols = $_GET["maxCols"];
    for ($q = 0; $q < $total_rows; $q++) {
        echo "<tr>";
        $rowNum = $q + 1;
        for ($i = 0; $i < $total_cols; $i++) {
            $colNum = $i + 1;
            $text = "";
            $colspan = "";
            $css = "";
            if ($colNum == $colEmpresa && $rowNum == $rowEmpresa + 1) {
                $img = $emp["logo"];
                $text = "<div class='draggable resizable objectFloatAbsolute'><img src='{$img}' width='100%'  /></div>";
                $css = " style=' text-align: center;' ";
            }
            if ($colNum == $colEmpresa && $rowNum == $rowEmpresa) {
                $text = $si["nom_empresa"];
                $css = " style=' text-align: center; font-weight: bold;' ";
            }
            if ($colNum == $rowEnc1 - $fileNum && $rowNum == $colEnc1) {
                $text = "Creado por:";
                $css = " style=' font-weight: bold;' ";
            }
            if ($colNum == $rowEnc1 && $rowNum == $colEnc1) {
                $text = "{$si["nombre"]}";
                if (isset($si["apellido"])) {
                    $text .= "{$si["apellido"]}";
                }
            }
            if ($colNum == $rowEnc1 - $fileNum && $rowNum == $colEnc1 + $fileNum) {
                $text = "Fecha";
                $css = " style='font-weight: bold;' ";
            }
            if ($colNum == $rowEnc1 && $rowNum == $colEnc1 + $fileNum) {
                $text = "fecha_actual()";
            }
            if ($colNum == $col1 && $rowNum == $row1) {
                $text = $si["nom_empresa"];
                $colspan = " colspan='{$rwocolspan}' ";
                $css = " style='font-size: 16px; font-weight: bold; text-align: center; padding: 10px; ' ";
            }
            if ($colNum == $col1 + $count1 && $rowNum == $row1) {
                $css = " style=' display: none; ' ";
                if ($count1 < $rwocolspan - 1)
                    $count1++;
            }
            echo "<td{$colspan}{$css}>{$text}</td>";
        }
        echo "</tr>";
    }
    echo "</table>";
}

createHtml();
?>