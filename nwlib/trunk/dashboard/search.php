<?php

if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
global $id;
$id = $_GET["search"];
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function module() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $where = "  ";
    $campos = "c.nombre";
    $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $id, true);
    $sql = "select 
                    c.callback,
                    b.iconos_home,
                    c.nombre
                from permisos a
                join modulos b on (a.modulo = b.id)
                join menu c on (b.id=c.modulo)
                    where a.perfil = :perfil and a.consultar = true and b.empresa=:empresa" . $where;
    $ca->prepare($sql);

//    $ca->prepareSelect("menu", "*", $where);
    $ca->bindValue(":modulo", $id);
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":perfil", $_SESSION["perfil"]);
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
    echo "<h1 class='h1_title'>Resultados de su búsqueda</h1>";
    if ($ca->size() == 0) {
        echo "No hay resultados.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $part = explode("createMaster", $r['callback']);
        if ($part[0] != "") {
            if (isset($r["iconos_home"])) {
                if ($r["iconos_home"] != "0") {
                    $bg = " style='background-image: url(" . $r["iconos_home"] . ");' ";
                    $casSize = "imgContain";
                } else {
                    $bg = "";
                    $casSize = "";
                }
            } else {
                $bg = "";
                $casSize = "";
            }
            echo " <div id='contend_modules_div' class='contend_modules_div contend_modules_divSearch' 
                       onclick=\"parent.qxnw.main.openAnyFunction('{$r['callback']}');\">
                        <div class='img_contend_modules_div $casSize ' $bg ></div>
                        {$r['nombre']}
                             <div class='boxDownText'>{$r['nombre']}</div>
                    </div>";
        }
    }
}

module();
?>
