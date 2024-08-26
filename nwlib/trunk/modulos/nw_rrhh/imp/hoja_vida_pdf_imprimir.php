<?php
require_once dirname(__FILE__) . '/../rpcsrv/_mod.inc.php';

$where = "";
if (isset($_GET["id"])) {
    $where .= " where id = " . $_GET["id"];
}
$query = pg_exec("select * FROM rh_hoja_vida " . $where);
$r = pg_fetch_array($query);
//print_r($r);
$noen = "<p class='no_encontrado'>Registro no encontrado</p>";

$where = "";
if (isset($_GET["id"])) {
    $where .= " where id_hv = " . $_GET["id"];
}
$query = pg_exec("select * FROM rh_experiencia_laboral " . $where);
$el = pg_fetch_array($query);

//MAESTROS
$where = "";
if (isset($r["estado"])) {
    $where .= " where id = " . $r["estado"];
}
$query = pg_exec("select * FROM rh_estado_hv " . $where);
$estado = pg_fetch_array($query);

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
                color: #999;
                text-transform: uppercase;
                background: #eee;
            }
            .no_encontrado{
                color: firebrick;
                opacity: 0.3;
                font-weight: bold;
                font-size: 10px;
            }
            #contenedor{
                position: relative;
                margin: auto;
                width: 900px;
                height: auto;
                max-width: 900px;
                min-width: 900px;
                overflow: hidden;
                background: #fff;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            #contenedor h2 {
                color: firebrick;
            }
            #contenedor table{
                border-collapse: collapse;
                border-radius: 10px;
                overflow: hidden;
                width: 100%;
            }
            #contenedor td{
                border: 1px solid #e6e6e6;	
                padding: 7px;
            }
            #contenedor th{
                text-align:left;
                border: 1px solid #e6e6e6;
                padding: 8px;
                text-transform: none;
            }
        </style>
    </head>
    <body>
        <div id="contenedor">
            <img src="<?php echo $empresa["logo"]; ?>" style="float: left; margin-bottom: 10px; max-width: 200px;" />
            <h1 style="float: right;right: 10px;position: relative;">
                Hoja de Vida N°<?php echo $r["id"]; ?>
            </h1>
            <table>
                <tr>
                    <td colspan="2">
                        <h2>Datos Básicos</h2>
                    </td>
                    <td style="text-align: center;">
                        Estado: 
                        <?php
                        if ($r["estado"] == null) {
                            echo $noen;
                        } else
                        if ($r["estado"] == 1) {
                            echo "<strong style='color: green;'>" . $estado["nombre"] . "</p>";
                        } else
                        if ($r["estado"] == 2) {
                            echo "<strong style='color: yellow;'>" . $estado["nombre"] . "</p>";
                        } else
                        if ($r["estado"] == 3) {
                            echo "<strong style='color: red;'>" . $estado["nombre"] . "</p>";
                        }
                        else
                            echo $estado["nombre"];
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Nombres y Apellidos</th>
                    <th>Cédula</th>
                    <th>Fecha de Nacimiento</th>
                </tr>
                <tr>
                    <td><?php
                        echo $r["nombre"];
                        echo " " . $r["nombre_dos"];
                        echo " " . $r["apellido_uno"];
                        echo " " . $r["apellido_dos"]
                        ?></td>
                    <td>
                        <?php
                        if ($r["cedula"] == null) {
                            echo $noen;
                        } else {
                            echo $r["cedula"];
                        }
                        ?>
                    </td>
                    <td>        
                        <?php
                        if ($r["fecha_nacimiento"] == null) {
                            echo $noen;
                        } else {
                            echo $r["fecha_nacimiento"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Correo Personal</th>
                    <th>N° Teléfono</th>
                    <th>N° Celular</th>
                </tr>
                <tr>
                    <td>         
                        <?php
                        if ($r["correo_corporativo"] == null) {
                            echo $noen;
                        } else {
                            echo $r["correo_corporativo"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["numero_telefonico"] == null) {
                            echo $noen;
                        } else {
                            echo $r["numero_telefonico"];
                        }
                        ?>
                    </td>
                    <td>         <?php
                        if ($r["numero_residencia"] == null) {
                            echo $noen;
                        } else {
                            echo $r["nombre_contacto_emergencia"];
                        }
                        ?></td>
                </tr>
                <tr>
                    <th colspan="2">Contacto de Emergencias</th>
                    <th>N° Teléfono de Emergencias</th>
                    <th></th>
                </tr>
                <tr>
                    <td colspan="2">
                        <?php
                        if ($r["nombre_contacto_emergencia"] == null) {
                            echo $noen;
                        } else {
                            echo $r["nombre_contacto_emergencia"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["numero_contacto_emergencia"] == null) {
                            echo $noen;
                        } else {
                            echo $r["numero_contacto_emergencia"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Género</th>
                    <th>Estado Civíl</th>
                    <th>RH	</th>
                    <th></th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["sexo"] == null) {
                            echo $noen;
                        } else {
                            echo $r["sexo"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["estado_civil"] == null) {
                            echo $noen;
                        } else
                        if ($r["estado_civil"] == "CASADO" & $r["sexo"] == "FEMENINO") {
                            echo "Casada";
                        } else {
                            echo $r["estado_civil"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["rh"] == null) {
                            echo $noen;
                        } else {
                            echo $r["rh"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h3>Adjunto, hoja de vida</h3>
                        <?php
                        $adjunto_image = str_replace("/var/www/huawei/", "", $r["hv_adjunto"]);
                        $adjunto_image_name = str_replace("imagenes", "", $adjunto_image);
                        if ($r["hv_adjunto"] == null) {
                            echo "No hay adjuntos disponibles";
                        }
                        else
                            echo "<a href='$adjunto_image' target='_blank'>
                                Nombre: <br /> " . $adjunto_image_name . " <br />Clic para descargar!
                                    </a>";
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Datos de Ubicación</h2>
                    </td>
                </tr>
                <tr>
                    <th>Municipio</th>
                    <th>Zona</th>
                    <th>Departamento</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["ciudad"] == null) {
                            echo $noen;
                        } else {
                            echo $ciudad["nombre"];
                        }
                        ?>
                    </td>
                    <td>         
                        <?php
                        if ($r["zona_asignada"] == null) {
                            echo $noen;
                        } else {
                            echo $zona["nombre"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["departamento"] == null) {
                            echo $noen;
                        } else {
                            echo $depto["nombre"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <strong>Dirección Residencia:</strong> 
                        <?php
                        if ($r["direccion_residencia"] == null) {
                            echo $noen;
                        } else {
                            echo $r["direccion_residencia"];
                        }
                        ?></td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Familiares</h2>
                    </td>
                </tr>
                <tr> 
                    <td colspan="3">
                        <table width="100%">
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Edad</th>
                                <th>Sexo</th>
                                <th>Tipo Documento</th>
                                <th>N° documento</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($_GET["id"])) {
                                $where .= " where id_hv = " . $_GET["id"];
                            }
                            $sql = "select * FROM rh_datos_familiares " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrrrr = pg_fetch_array($queryy)) {
                                // print_r($rrrrr);
                                ?>
                                <tr>
                                    <td>
                                        <?php
                                        if ($rrrrr["nombre"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["nombre"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["tipo"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["tipo"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["edad"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["edad"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["sexo"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["sexo"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["tipo_doc"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["tipo_doc"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["documento"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["documento"];
                                        }
                                        ?>
                                    </td>
                                </tr>
                            <?php } ?>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Datos Profesionales</h2>
                    </td>
                </tr>
                <tr>
                    <th>Nivel Educativo</th>
                    <th>Profesión</th>
                    <th>Conocimientos</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["nivel_educativo"] == null) {
                            echo $noen;
                        } else {
                            echo $niveduca["nombre"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["profesion"] == null) {
                            echo $noen;
                        } else {
                            echo $profesion["nombre"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["conocimientos"] == null) {
                            echo $noen;
                        } else {
                            echo $conocimientos["nombre"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Nivel de Conocimientos</th>
                    <th>Certificado de Alturas</th>
                    <th>Fecha Certificado de Alturas</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["nivel_conocimientos"] == null) {
                            echo $noen;
                        } else {
                            echo $nivelconocimientos["nombre"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["certificado_alturas"] == null) {
                            echo $noen;
                        } else {
                            echo $r["certificado_alturas"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["fecha_vence_cert_alturas"] == null) {
                            echo $noen;
                        } else {
                            echo $r["fecha_vence_cert_alturas"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Licencia de Conducción</th>
                    <th>Fecha Vencimiento Licencia</th>
                    <th>Categoría Licencia</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["licencia_conduccion"] == null) {
                            echo $noen;
                        } else {
                            echo $r["licencia_conduccion"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["fecha_vence_lic_conduccion"] == null) {
                            echo $noen;
                        } else {
                            echo $r["fecha_vence_lic_conduccion"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["licencia_conducir_categoria"] == null) {
                            echo $noen;
                        } else {
                            echo $r["licencia_conducir_categoria"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Licencia de conducción adjunta:</h3>
                        <?php
                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $r["adjunto_licencia"]);
                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                        if ($r["adjunto_licencia"] == null) {
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
                        $adjunto_image_alt = str_replace("/var/www/huawei/", "", $r["adjunto_cert_alturas"]);
                        $adjunto_image_alt_name = str_replace("imagenes", "", $adjunto_image_alt);
                        if ($r["adjunto_cert_alturas"] == null) {
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
                    <td colspan="3">
                        <h2>Conocimientos</h2>
                        <table width="100%">
                            <tr>
                                <th>Conocimiento</th>
                                <th>Nivel de Conocimiento</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($_GET["id"])) {
                                $where .= " where id_asociado = " . $_GET["id"];
                            }
                            $sql = "select *,func_concepto(conocimientos, 'rh_conocimientos') as nom_conocimientos, func_concepto(nivel_conocimientos, 'rh_nivel_conocimientos')as nom_nivel_conocimientos
                                FROM rh_conocimientos_empleados " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrrrr = pg_fetch_array($queryy)) {
                                // print_r($rrrrr);
                                ?>
                                <tr>
                                    <td>
                                        <?php
                                        if ($rrrrr["conocimientos"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["nom_conocimientos"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["nivel_conocimientos"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["nom_nivel_conocimientos"];
                                        }
                                        ?>
                                    </td>
                                </tr>
                            <?php } ?>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Experiencia Laboral</h2>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <strong>Años de experiencia: </strong>
                        <?php
                        if ($r["anos_experiencia"] == null) {
                            echo $noen;
                        } else {
                            echo $r["anos_experiencia"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h3>Registro de Empresa, experiencia</h3>
                    </td>
                </tr>
                <tr> 
                    <td colspan="3">
                        <table width="100%">
                            <tr>
                                <th>Empresa</th>
                                <th>Estado</th>
                                <th>Cargo</th>
                                <th>Jefe</th>
                                <th>Teléfono</th>
                                <th>País</th>
                                <th>Ciudad</th>
                                <th>Fecha Inicial</th>
                                <th>Fecha Final</th>
                                <th>Logros</th>
                                <th>adjunto</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($_GET["id"])) {
                                $where .= " where id_hv = " . $_GET["id"];
                            }
                            $sql = "select *, func_concepto(estado, 'rh_experiencia_laboral_estados') as nom_estado FROM rh_experiencia_laboral " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrrrr = pg_fetch_array($queryy)) {
                                // print_r($rrrrr);
                                ?>
                                <tr>
                                    <td>
                                        <?php
                                        if ($rrrrr["empresa_laboral"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["empresa_laboral"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["estado"] == null) {
                                            echo $noen;
                                        } else
                                        if ($rrrrr["estado"] == 1) {
                                            echo "<span style='color:green;'>" . $rrrrr["nom_estado"] . "</span>";
                                        } else {
                                            echo $rrrrr["nom_estado"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["cargo"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["cargo"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["jefe_inmediato"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["jefe_inmediato"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["telefono_empresa"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["telefono_empresa"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["pais"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["pais"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["ciudad"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["ciudad"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["fecha_ingreso"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["fecha_ingreso"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["fecha_salida"] == null) {
                                            echo "<span style='color: green;'>A la fecha</span>";
                                        } else {
                                            echo $rrrrr["fecha_salida"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if ($rrrrr["observaciones"] == null) {
                                            echo $noen;
                                        } else {
                                            echo $rrrrr["observaciones"];
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $rrrrr["adjunto"]);
                                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                                        if ($rrrrr["adjunto"] == null) {
                                            echo "No hay adjuntos disponibles";
                                        }
                                        else
                                            echo "$adjunto_image_pro_name <br />
                                                <img src='$adjunto_image_pro' width='100px' height='100px' /><br />
                                                  <a href='$adjunto_image_pro' target='_blank'>Descargar.</a>";
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

<script type="text/javascript" language="javascript">

            window.print();

        </script>