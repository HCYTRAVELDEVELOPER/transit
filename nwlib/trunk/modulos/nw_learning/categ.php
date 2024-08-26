<?php
if (!function_exists("GetSQLValueString")) {

    function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);
        switch ($theType) {
            case "text":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "long":
            case "int":
                $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                break;
            case "double":
                $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                break;
            case "date":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "defined":
                $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                break;
        }
        return $theValue;
    }

}
$manual_get_ok = $_GET["m"];
encript::decode($manual_get_ok, $cl_v);
$decode_script = encript::$string;
$decode_manual = $decode_script;
//$decode_manual = base64_decode($manual_get_ok);


$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$sqll = "select * from man_enc where id=:id";
$cb->prepare($sqll);
$cb->bindValue(":id", $decode_manual);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta.";
    // return;
}
if ($cb->size() == 0) {
    echo "No se han encontrado datos";
    // return;
}
$cb->next();
$ra_man = $cb->assoc();
if ($ra_man["publico"] == "NO") {
    if (session_id() == "") {
        session_start();
    }
    if (!isset($_SESSION["cedula"])) {
        if (!isset($_SESSION["usuario"])) {
            include "login_no_autoriced.php";
            return;
        }
    } else
    if (isset($_SESSION["cedula"])) {
        session_destroy();
    }
}
?>
<div class="enc_man_category">
    <div class="padding_interno">
        <h1 class="h1_full_text">
            <?php echo $ra_man["nombre"]; ?>
        </h1>
        <div class='box_float_right'>
            <a class='button_volver' href='javascript:history.back()'>
                Volver
            </a>
        </div>
        <div class="show_data_man">
            <strong>
                Descripción General
            </strong>
            <p>
                <?php echo $ra_man["descripcion"]; ?>
            </p>
        </div>
        <div class="show_data_man">
            <strong>
                Objetivo General
            </strong>
            <p>
                <?php echo $ra_man["objetivo"]; ?>
            </p>
        </div>
    </div>
    <div class="clear"></div>
</div>
<div class="div_table_contends">
    <h3 class="h3_title_box">
        Tabla de Contenido
    </h3>
    <div class="busqueda">
        <?php
        include "buscar_categs.php";
        ?>    
    </div>
    <ul class="list_manual">
        <?php
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select * from man_categorias where man=:manual order by id asc";
        $ca->bindValue(":manual", $decode_manual);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda.";
            return;
        }
        if ($ca->size() == 0) {
            echo "<h3 class='no_found_contend'>No hay categorias que mostrar. Seleccione otro manual.</h3>.";
            echo "<a class='' href='javascript:history.back()' >Volver</a>";
            //return;
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $array = $ca->assoc();

            $e = new encript;
            $tem = $e->encode($array["id"], $cl_v);
            $code_script = encript::$string; // valor encriptado

            encript::decode($tem, $cl_v);
            $decode_script = encript::$string; // valor desencriptado

            $url_object = $url_gen . "?cat=" . $code_script;
            ?>
            <li class="list_manualas_men select_<?php echo $array["id"] ?>">
                <div class="text_flour">
                    <h3>
                        <a href="<?php echo $url_object; ?>">
                            <?php echo $array["nombre"]; ?>
                        </a>
                    </h3>
                    <div class="box_dos_categ">
                        <p>
                            <strong>Progreso:</strong>
                        </p>
                        <p>
                            0%
                        </p>
                    </div>
                </div>
            </li>
            <?php
        }
        ?>
    </ul>
    <div class="clear"></div>
</div>