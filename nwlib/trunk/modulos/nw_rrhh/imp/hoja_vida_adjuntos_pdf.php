<?php
require_once dirname(__FILE__) . '/../rpcsrv/_mod.inc.php';

$where = "";
if (isset($_GET["id"])) {
    $where .= " where id = " . $_GET["id"];
}
$query = pg_exec("select * FROM rh_empleados " . $where);
$r = pg_fetch_array($query);
//print_r($r);
$noen = "<p style='color: red;'>Registro no encontrado</p>";

$where = "";
if (isset($_GET["id"])) {
    $where .= " where id_hv = " . $_GET["id"];
}
$query = pg_exec("select * FROM rh_experiencia_laboral " . $where);
$el = pg_fetch_array($query);

//MAESTROS
$where = "";
if (isset($r["hv"])) {
    $where .= " where id = " . $r["hv"];
}
$query = pg_exec("select * FROM rh_hoja_vida " . $where);
$hv = pg_fetch_array($query);

$where = "";
if (isset($r["ciudad"])) {
    $where .= " where id = " . $r["ciudad"];
}
$query = pg_exec("select * FROM ciudades " . $where);
$ciudad = pg_fetch_array($query);

$where = "";
if (isset($r["zona_asignada"])) {
    $where .= " where id = " . $r["zona_asignada"];
}
$query = pg_exec("select * FROM rh_zonas " . $where);
$zona = pg_fetch_array($query);

$where = "";
if (isset($r["departamento"])) {
    $where .= " where id = " . $r["departamento"];
}
$query = pg_exec("select * FROM departamentos " . $where);
$depto = pg_fetch_array($query);

$where = "";
if (isset($r["nivel_educativo"])) {
    $where .= " where id = " . $r["nivel_educativo"];
}
$query = pg_exec("select * FROM rh_niveles_educativos " . $where);
$niveduca = pg_fetch_array($query);

$where = "";
if (isset($r["profesion"])) {
    $where .= " where id = " . $r["profesion"];
}
$query = pg_exec("select * FROM rh_profesiones " . $where);
$profesion = pg_fetch_array($query);

$where = "";
if (isset($r["conocimientos"])) {
    $where .= " where id = " . $r["conocimientos"];
}
$query = pg_exec("select * FROM rh_conocimientos " . $where);
$conocimientos = pg_fetch_array($query);

$where = "";
if (isset($r["nivel_conocimientos"])) {
    $where .= " where id = " . $r["nivel_conocimientos"];
}
$query = pg_exec("select * FROM rh_nivel_conocimientos " . $where);
$nivelconocimientos = pg_fetch_array($query);


$query = pg_exec("select * FROM empresas");
$empresa = pg_fetch_array($query);
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Hoja de Vida</title>

        <style type="text/css">
            body{
                position: relative;
                margin: 0;
                padding: 0;
                font-family: Arial;
                font-size: 12px;
                color: #555;
                text-transform: uppercase;
            }
            #contenedor{
                position: relative;
                margin:auto;
                width:900px;
                height: 1000px;	
            }
            #contenedor table{
                border-collapse: collapse;
            }
            #contenedor td{
                border: 1px solid #ccc;	
                padding: 2px;
            }
            #contenedor th{
                text-align:left;
                border: 1px solid #ccc;
                padding: 3px;
            }
        </style>
    </head>
    <body>
        <div id="contenedor">
            <img src="<?php echo $empresa["logo"]; ?>" style="float: left; margin-bottom: 10px; width: 80px;" />
            <h1 style="float: right;">
                Adjuntos
            </h1>
            <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <th>Nombres y Apellidos</th>
                    <th>Cédula</th>
                    <th>N° Celular</th>
                    <th>Correo Personal</th>
                    <th>N° Teléfono</th>
                </tr>
                <tr>
                    <td><?php
                        echo $hv["nombre"];
                        echo " " . $hv["nombre_dos"];
                        echo " " . $hv["apellido_uno"];
                        echo " " . $hv["apellido_dos"]
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($hv["cedula"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["cedula"];
                        }
                        ?>
                    </td>
                    <td>        
                        <?php
                        if ($hv["numero_residencia"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["numero_residencia"];
                        }
                        ?>
                    </td>
                    <td>         
                        <?php
                        if ($hv["correo_corporativo"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["correo_corporativo"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($hv["numero_telefonico"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["numero_telefonico"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <h2>Hoja de vida</h2>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h3>Adjunto, hoja de vida</h3>
                        <?php
                        $adjunto_image = str_replace("/var/www/huawei/", "", $hv["hv_adjunto"]);
                        $adjunto_image_name = str_replace("imagenes", "", $adjunto_image);
                        if ($hv["hv_adjunto"] == null) {
                            echo "No hay adjuntos disponibles";
                        }
                        else
                            echo "<a href='$adjunto_image' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_name . " <br />Clic para descargar!
                                    </a>";
                        ?>
                    </td>
                    <td>
                        <h3>Licencia de conducción adjunta:</h3>
                        <?php
                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $hv["adjunto_licencia"]);
                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                        if ($hv["adjunto_licencia"] == null) {
                            echo "No hay adjuntos disponibles";
                        }
                        else
                            echo "<a href='$adjunto_image_pro' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_pro_name . " <br />Clic para descargar!
                                    </a>";
                        ?>
                    </td>
                    <td>
                        <h3>Certificado de alturas, adjunto:</h3>
                        <?php
                        $adjunto_image_alt = str_replace("/var/www/huawei/", "", $hv["adjunto_cert_alturas"]);
                        $adjunto_image_alt_name = str_replace("imagenes", "", $adjunto_image_alt);
                        if ($hv["adjunto_cert_alturas"] == null) {
                            echo "No hay adjuntos disponibles";
                        }
                        else
                            echo "<a href='$adjunto_image_alt' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_alt_name . " <br />Clic para descargar!
                                    </a>";
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <h2>Herramientas</h2>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <table width="100%">
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Marca</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                                <th>Adjunto</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($r["id"])) {
                                $where .= " where id_empleado = " . $r["id"];
                            }
                            $sql = "select * FROM rh_herramientas_empleado " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrr = pg_fetch_array($queryy)) {
                                //print_r($rrr);
                                ?>
                                <tr>
                                    <td>
                                        <?php echo $rrr["equipo"]; ?>
                                    </td>
                                    <td>         
                                        <?php echo $rrr["tipo"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["marca"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["cantidad"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["estado"]; ?>
                                    </td>
                                    <td>
                                        <?php
                                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $rrr["adjunto"]);
                                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                                        if ($rrr["adjunto"] == null) {
                                            echo "No hay adjuntos disponibles";
                                        }
                                        else
                                            echo "<a href='$adjunto_image_pro' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_pro_name . " <br />Clic para descargar!
                                    </a>";
                                        ?>
                                    </td>
                                </tr>
                                <?php
                            }
                            ?>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <h2>Certificados de Educación</h2>
                    </td>
                </tr>
                <tr>
                    <th colspan="5">Adjunto</th>
                </tr>
                <?php
                $where = "";

                if (isset($r["hv"])) {
                    $where .= " where id_asociado = " . $r["hv"] . "and tipo='CERTIFICADOS_EDUCACION'";
                }
                $sql = "select * FROM rh_adjuntos " . $where;
                $queryy = pg_exec($sql);
                while ($rrrr = pg_fetch_array($queryy)) {
                    // print_r($rrrr);
                    ?>
                    <tr>
                        <td colspan="5">
                            <?php
                            $adjunto_image_pro = str_replace("/var/www/huawei/", "", $rrrr["adjunto"]);
                            $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                            if ($rrrr["adjunto"] == null) {
                                echo "No hay adjuntos disponibles";
                            }
                            else
                                echo "<a href='$adjunto_image_pro' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_pro_name . " <br />Clic para descargar!
                                    </a>";
                            ?>
                        </td>
                    </tr>
                    <?php
                }
                ?>
                <tr>
                    <td colspan="5">
                        <h3>Adjuntos de experiencia laboral</h3>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <table width="100%">
                            <tr>
                                <th>Empresa</th>
                                <th>Cargo</th>
                                <th>Fecha</th>
                                <th>Ciudad</th>
                                <th>Adjunto</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($r["hv"])) {
                                $where .= " where id_hv = " . $r["hv"];
                            }
                            $sql = "select * FROM rh_experiencia_laboral " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrrrr = pg_fetch_array($queryy)) {
                                // print_r($rrrrr);
                                ?>

                                <tr>
                                    <td>
                                        <?php echo $rrrrr["empresa_laboral"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrrrr["cargo"]; ?>
                                    </td>
                                    <td>
                                        Desde <?php echo $rrrrr["fecha_ingreso"]; ?> 
                                        Hasta <?php echo $rrrrr["fecha_salida"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrrrr["ciudad"]; ?>
                                    </td>
                                    <td>
                                        <?php
                                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $rrrrr["adjunto"]);
                                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                                        if ($rrrrr["adjunto"] == null) {
                                            echo "No hay adjuntos disponibles";
                                        }
                                        else
                                            echo "<a href='$adjunto_image_pro' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_pro_name . " <br />Clic para descargar!
                                    </a>";
                                        ?>
                                    </td>
                                </tr>
                            <?php } ?>

                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
