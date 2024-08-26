<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
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

global $id;
$id = "";
$tipo = "";
if (isset($_POST["id"])) {
    $id = $_POST["id"];
} else
if (isset($_GET["id"])) {
    $id = $_GET["id"];
} else {
    echo "Error con el id pasa";
    return;
}
if (isset($_POST["tipo"])) {
    $tipo = $_POST["tipo"];
} else
if (isset($_GET["tipo"])) {
    $tipo = $_GET["tipo"];
} else {
    echo "Error con el tipo pasa";
    return;
}

//$tipo = $_POST["tipo"];

function comentarios() {
    global $id;
    $where = " where 1=1 ";
//    if (isset($_POST["id"])) {
    $where .= " and a.id_relation=:id_relation";
//    }
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $sql = "select a.*,b.foto FROM nwtask_comments a
        left join usuarios b on (a.usuario=b.usuario) 
        " . $where;
    $ca->prepare($sql);
    $ca->bindValue(":id_relation", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta a los comentarios. file comments.php line 65 ";
        return;
    }
    if ($ca->size() == 0) {
        echo "";
        return;
    }
    if ($ca->size() != 0) {
        echo "<h2 class='title_comments_h2'>" . $ca->size() . " Comentarios</h2>";
    }
    for ($ii = 0; $ii < $ca->size(); $ii++) {
        $ca->next();
        $ra = $ca->assoc();
        echo "<div class='box_comment_user'>";
        echo "<b><a href='/profile/" . $ra["usuario"] . "'><img class='photo_post photo_post_mini' src='" . $ra["foto"] . "' />" . $ra["usuario"] . "</a> :</b>";
        echo $ra["comentario"];
        echo "<br /><span>" . $ra["fecha"] . "</span>";
        echo "</div>";
    }
}
?> 
<script type="text/javascript">
    $("#form_comment<?php echo $id ?>").validate({
        rules: {
            comentario: {
                required: true
            }
        },
        submitHandler: function() {
            commentInt(<?php echo $id ?>);
        }
    });
</script>
<div class="comments_bloq">
    <form id="form_comment<?php echo $id; ?>" name="form_comment" method="post"  action="javascript: commentInt(<?php echo $id ?>);">
        <input id="id_relation" name="id_relation" type="hidden" value="<?php echo $id ?>" />
        <input id="tipo" name="tipo" type="hidden" value="<?php echo $tipo ?>" />
        <input class="comment_input" id="comentario<?php echo $id; ?>" name="comentario" type="text" value="" />

        <input  type="submit" value="Comentar" class="buttonComentBox"/>
    </form>
</div>
<?php
comentarios();
?>