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
$dbd = NWDatabase::database();
$cau = new NWDbQuery($dbd);
$sqlu = "select * from terminales where url=:url order by id asc";
$cau->bindValue(":url", $_GET["MainUrl"]);
$cau->prepare($sqlu);
if (!$cau->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
if ($cau->size() == 0) {
    echo "<h3 class='no_found_contend'>La página que intenta ingresar no existe o no está disponible, lo sentimos.</h3>.";
    return;
}
$cau->next();
$arrayU = $cau->assoc();
?>
<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/css/user.css" />

<div class="enc_space_user">
    <div class="logo_space_user" style="background-image: url(<?php echo $arrayU["logo"]; ?>);">
        <img src="<?php echo $arrayU["logo"]; ?>" />
        <h1>
            <?php echo $arrayU["nombre"]; ?>
        </h1>
    </div>
    <div class="menu_space_user" style="display: none;">
        menú
    </div>
</div>
<?php
echo " <div class='galery_home'>";
include "src/galeria_polaris/galeria_polaris.php";
echo "</div>";
include "manuales.php";
?>
<script>
<!--
document.write(unescape("%3Cscript%20type%3D%22text/javascript%22%3E%0A%20%20%20%20galery_user%28%29%3B%0A%3C/script%3E"));
//-->
</script>