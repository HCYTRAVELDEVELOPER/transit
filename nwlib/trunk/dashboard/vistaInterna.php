<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$vn = master::getNwlibVersion();
require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$vn}/dashboard/srv/main.nw.php";

if (session_id() == "") {
    //  ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

global $id;
$id = $_GET["id"];
?>
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/dashboard/css/style_other.css" />

<style>
    .contend_modules_div<?php echo $_GET["id"]; ?>{
        background: #e7585e!important;
        color: #fff;
    }
</style>
<?php

function module() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $ca->prepareSelect("nw_modulos_grupos", "nombre", "id=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
    $ca->next();
    $r = $ca->assoc();
    echo "<h1>" . $r['nombre'] . "</h1>";
}

function modules($p, $id_module = false) {
    $configImg = $_SESSION["config_dashboard"];
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $rta = "";
    global $id;
    $id_con = $id;

    if ($id_module != false) {
        $id_con = $id_module;
    }

    $subConsult = "";
    $where = "  where 1=1 ";
    $where .= "  and a.perfil=:perfil and a.consultar=true and d.nivel=:nivel ";
    if (!isset($_SESSION["products"])) {
        $where .= " and d.empresa=:empresa ";
        $subConsult = "  and b.empresa=e.empresa";
    }
    $where .= " and b.grupo=:id  ";
//    $where .= " and e.pariente=:id ";

    $sql = "select DISTINCT
                    b.id, 
                    d.callback, 
                    b.nombre, 
                    b.iconos_home, 
                    d.nombre as nombre_menu,
                    d.nivel, 
                    e.parte, 
                    e.id as id_module
                from menu d
               left join permisos a on (d.modulo = a.modulo)
               left join modulos b on (a.modulo = b.id)
                join nw_modulos_grupos e on (b.grupo=e.id{$subConsult})
                   {$where} ";

    $ca->bindValue(":perfil", $_SESSION["perfil"]);
    $ca->bindValue(":id", $id_con);
    $ca->bindValue(":nivel", $p);
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->prepare($sql);
    if (!$ca->exec()) {
        return $ca->lastErrorText();
    }
    $total = $ca->size();
    if ($total == 0) {
        return false;
    }
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $part = explode("createMaster", $r['callback']);
//        if ($part[0] != "") {
        if ($r['callback'] != "") {
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

            $parte = "";
            $explodeParte = explode(".", $r["parte"]);
            $totalParte = count($explodeParte);
            if ($totalParte == 1) {
                $parte = $r["parte"];
                $execSlotInitial = "";
            } else {
                $parte = $explodeParte[0];
                $execSlotInitial = "parent.qxnw.main.openAnyFunction('{$r["callback"]}');";
            }

            ///////////////busco si es slot normal o createMaster//////////////
            $execSlotInitial = "parent.qxnw.main.openAnyFunction('{$r["callback"]}');";

            $searchCreateMaster = explode("createMaster:master,", $r["callback"]);
            if (isset($searchCreateMaster[1])) {
                $partsMaster = explode(",", $searchCreateMaster[1]);
                $method = "master";
                $table = "";
                $title = "";
                $allPermissions = "false";
                if (isset($partsMaster[0])) {
                    $table = $partsMaster[0];
                }
                if (isset($partsMaster[1])) {
                    $title = $partsMaster[1];
                }
                if (isset($partsMaster[2])) {
                    $allPermissions = $partsMaster[2];
                }
                $execSlotInitial = "parent.qxnw.main.openCreateMaster('$method', '$table', '$title', $allPermissions);";
            }

            $populate = "parent.qxnw.main.slotLoadModule('{$parte}', '{$r["id_module"]}');";
            if ($configImg["mostrar_menu_superior"] == "NO") {
                $populate = "";
//                $populate = "parent.qxnw.main.slotLoadModule(0, 0);";
            }

            $rta .= "<div class='boxModuleExe DivNivel" . $r['nivel'] . "'>
               <div id='contend_modules_div' class='contend_modules_div contend_modules_divInter ' onclick=\"$populate $execSlotInitial \">
               <div class='img_contend_modules_div $casSize ' $bg ></div>
             {$r['nombre_menu']}
                    <div class='boxDownText'>{$r['nombre_menu']}</div>
               </div>
                ";
            $rta .= "</div>";
        }
    }
    $rta .= "<div class='contend_specials contend_specialsIntern'  >" . modulosHome(false, $id_con) . "</div>";
    return $rta;
}

if ($id == 0 || $id == "0") {
    ///////////////////////////////////////////////FOTO / SALUDO / MÓDULOS MÁS USADOS / NOTICIAS ////////////////////////////////////
    getSaludoHomeUserAndNews();
    ?>
    <div class='contend_specials contend_specialsIntern'  >
        <?php
        print modulosHome(false, $id);
        ?>
    </div>
    <?php
} else {
    print getButtonModules($id, false, true);
}
?>