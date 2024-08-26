<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
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
}

include "../../config_img.php";
include "../../cryp.php";
$cl_v = 54750;

if (isset($_POST["terminal_uss"])) {
    $terminal = $_POST["terminal_uss"];
    $user = $_SESSION["usuario"];
    $empresa = $_SESSION["empresa"];
    echo  "ter: $terminal";
    echo  " user : $user";
} else {
    $id_pas = $_POST["id"];
    encript::decode($id_pas, $cl_v);
    $decode_script = encript::$string;  //valor desencriptado

    $id_c = $decode_script;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $sql = "select * from man_enc where id=:id_post";
    $ca->bindValue(":id_post", $id_c);
    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda. ";
        //  return;
    }
    if ($ca->size() == 0) {
        echo "<h3 class='no_found_contend'>No hay información que mostrar.</h3>.";
        echo "<a class='' href='javascript:history.back()' >Volver</a>";
        //return;
    }
    $ca->next();
    $array = $ca->assoc();
    $empresa = $array["empresa"];
    $terminal = $array["terminal"];
    $user = $_SESSION["usuario"];
}
?>
<div class="box_info_popup">
    <form class="form_edit" id="form_edit" name="form_edit" method="post">
        <input name="id" type="hidden" value="<?php echo $array["id"]; ?>" >
        <input name="usuario" type="hidden" value="<?php echo $user; ?>" >
        <input name="empresa" type="hidden" value="<?php echo $empresa; ?>" >
        <input name="terminal" type="hidden" value="<?php echo $terminal; ?>" >
        <input name="imagen" type="hidden" value="<?php echo $array["imagen"]; ?>" >
        <h3>
            Título:
            <input name="nombre" type="text" value="<?php echo $array["nombre"]; ?>" >
        </h3>
        <br />
        <strong>
            Descripción General: 
        </strong>
        <br />
        <textarea type="text"  name="descripcion" >
            <?php echo $array["descripcion"]; ?>
        </textarea>
        <br />
        <strong>
            Objetivo General: 
        </strong>
        <br />
        <textarea type="text"  name="objetivo">
            <?php echo $array["objetivo"]; ?>
        </textarea>
        <br />
        <strong>
            Público? 
        </strong>
        <br />
        <select  name="publico">
            <option value="SI" <?php
            if ($array["publico"] == "SI") {
                echo "selected='selected'";
            };
            ?> >SI</option>
            <option value="NO" <?php
            if ($array["publico"] == "NO") {
                echo "selected='selected'";
            };
            ?> >NO</option>
        </select>
        <div>
            <input id="save" type="button" value="Guardar">
            <input id="Bcerrar" type="button" value="Cancelar">
        </div>
    </form>

</div>
<div id="close_bg"></div>
<script type="text/javascript">
    $("#save").click(function() {
        FormEditM();
    });
    $(document).ready(function() {
        $('#close').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
        $('#close_bg').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
        $('#Bcerrar').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
    });
</script>


