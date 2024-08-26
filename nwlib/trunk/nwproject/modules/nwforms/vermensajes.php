<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
 
function loadMain() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $id = $_GET["id"];
    $ca->prepareSelect("nwforms_enc", "*", "id=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error " . $ca->lastErrorText();
        return;
    }
    $ca->next();
    $r = $ca->assoc();
    echo "<h1>{$r["nombre"]}</h1>";
    loadRespuestasUserCampos($id);
    loadRespuestasEnc($id);
}

function loadRespuestasEnc($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwforms_respuestas_users_enc", "id,fecha", "id_enc=:id order by fecha desc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            echo "<tr>";
            echo "<td>{$r["fecha"]}</td>";
            loadRespuestasUser($r["id"]);
            echo "</tr>";
        }
    }
}

function loadRespuestasUser($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwforms_respuestas_users", "*", "enc_user=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error " . $ca->lastErrorText();
        return;
    }
    $respuestas = "";
    $total = $ca->size();
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $d = $r["respuesta"];
            $e = explode("/imagenes/", $d);
            if (isset($e[0])) {
                if ($e[0] == "") {
                    if ($d != "") {
                        $d = "<a href='{$d}' target='_BLANK'>" . str_replace("/imagenes/", "", $d) . "</a>";
                    }
                }
            }
            $respuestas .= "<td>{$d}</td>";
        }
//        echo "<tr>";
        echo $respuestas;
//        echo "</tr>";
    }
}

function loadRespuestasUserCampos($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwforms_preguntas", "*", "id_enc=:id order by orden asc ");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error " . $ca->lastErrorText();
        return;
    }
    $campos = "";
    $total = $ca->size();
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $campos .= "<th>{$r["nombre"]}</th>";
        }
        echo "<tr>";
        echo "<th>date</th>";
        echo $campos;
        echo "</tr>";
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
            body {
                position: relative;
                margin: 0;
                padding: 0;
                font-size: 12px;
                font-family: arial;
                background: #fff;
            }
            .contenedor{
                position: relative;
                margin: 0;
                padding: 10px;
                background: #fff;
                height: 100%;
            }
            table {
                position: relative;
                margin: 0;
                padding: 0;
                width: 100%;
                border-collapse: collapse;
                border: 1px solid #ccc;

            }
            th {
                position: relative;
                margin: 0;
                padding: 10px;
                font-size: 14px;
                text-transform: uppercase;
            }
            td {
                position: relative;
                margin: 0;
                padding: 5px;
                /*text-transform: uppercase;*/
            }
            .img{
                position: relative;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="contenedor">
            <table border='1'>
                <?php
                loadMain();
                ?>
            </table>
        </div>
    </body>
</html>
