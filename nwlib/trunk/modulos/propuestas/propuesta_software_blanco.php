<div id="contenedor1">
    <?php
    encabezado_principal();
    ?>
    <div id="contenedor2">
        <h1 class="title1">
            <?php echo $r["titulo"] ?>
            <p>
                PROPUESTA TÉCNICA Y ECONÓMICA 
            </p>
        </h1>
        <br />
        <br />
        <p style="color: #555;margin: 0;font-size: 14px;">
            <strong>Bogotá D.C.</strong><br />
        </p>
        <br />
        <h2 style="color: #555;">
            Señores: <?php echo $prd["nombre"] ?>
            <br />
            At: <?php echo $prd["nombre_contacto"] ?>

        </h2>
        <br /><br /><br /><br />
        <div class="img1">
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.jpg" />
        </div>
    </div>
</div>
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <p>Reciba un  Cordial Saludo:</p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial  para la implementación, desarrollo y sostenimiento de una plataforma 
                informática  que involucra el diseño y programación de su proyecto de <strong><?php echo $r["titulo"] ?></strong>. No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
            <div class="bloque1">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.jpg" style="float: left;width: 400px;" />
                <h1>
                    <?php echo $r["titulo"] ?>
                </h1>
                <p>
                    <?php echo $r["descripcion_general"] ?>
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Base de datos:
                </h1>
                <p>
                    PostgreSQL 9.1 - Oracle - SQLite - MYSQL - SQL Server

                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Librerías:
                </h1>
                <p>
                    QXNW, NWLIB
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Lenguaje Servidor:
                </h1>
                <p>
                    PHP 5
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Lenguaje Cliente:
                </h1>
                <p>
                    Javascript, HTML5 y CSS3
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    OS Sugerido:
                </h1>
                <p>
                    Linux Server
                    - Windows Server
                </p>
            </div>
        </div>
    </div>
</div>
<!-- INICIO DE UNA PÁGINA -->
<?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$wheree = " where id_propuesta=:id_propuesta";
$sqla = "select * FROM propuestas_hojas " . $wheree . " order by orden asc";
$cb->prepare($sqla);
$cb->bindValue(":id_propuesta", $id_propuesta);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta. ";
    return;
}
if ($cb->size() == 0) {
    echo "";
}
for ($ii = 0; $ii < $cb->size(); $ii++) {
    $cb->next();
    $rr = $cb->assoc();
    echo "<div id='contenedor1'>";
    encabezado();
    echo "<div id='contenedor2'>";
    echo "<div class='bloques_text_center'>";
    echo "<div class='bloques_textos'>";
    echo "<h1>Módulos</h1>";
    echo $rr["texto"];
    echo "</div>";
    echo "</div>";
    echo "</div>";
    echo "</div>";
}
?>
<?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$wheree = " where id=:id_propuesta";
$sqla = "select *,func_concepto(producto,'productos') as nom_producto FROM propuestas" . $wheree . " order by id asc";
$cb->prepare($sqla);
$cb->bindValue(":id_propuesta", $id_propuesta);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta. ";
    return;
}
if ($cb->size() == 0) {
    echo "";
}
$propuesta = $cb->flush();
if (isset($propuesta["tarifa"]) && $propuesta["tarifa"] != "") {
    $wheree = " where id_enc=:id_propuesta";
    $sqla = "select * FROM tarifas_propuestas_det" . $wheree . " order by id asc";
    $cb->prepare($sqla);
    $cb->bindValue(":id_propuesta", $id_propuesta);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    $tarifas = $cb->assocAll();
    if (count($tarifas) > 0) {
        echo $abre_contenedor1;
        encabezado();
        echo "<div id='contenedor2'>";
        echo "<div class='bloques_text_center'>";
        echo "<div class='bloques_textos'>";
        echo '<div style="width: 800px;margin: auto;"><p style="text-align: center;">&nbsp;</p>';
        echo '<p style="text-align: center;"><strong>Paquete de Servicios</strong></p>';
        echo '<p style="text-align: center;">&nbsp;</p>';
        echo '<table cellspacing="10" class="tablePrecios" style="height:1px;width:800px;">';
        echo '<tbody><tr><th rowspan="' . count($tarifas) + 1 . '"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;</span></th>';
        echo '<th style="width: 80px;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
        echo '<th><span style="color:#000000;">% de Ahorro</span></th>';
        echo '<th style="width: 600px;"><span style="color:#000000;">Valor Unidad </span></th></tr>';
        for ($i = 0; $i < count($tarifas); $i++) {
            echo '<tr><td style="text-align: center; width: 400px;">' . $tarifas[$i]["rango_inicial"] . '- ' . $tarifas[$i]["rango_final"] . '</td>
			<td style="text-align: center;">0%</td>
			<td style="text-align: center;">$ 2.039 COP</td></tr>';
        }
        echo '</tbody></table><p>&nbsp;</p>';
        echo "</div>";
        echo "</div>";
        echo "</div>";
        echo $cierra_contenedor1;
    }
}
?>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
            <p><img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/logos_clientes.png" /></p>
            <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
                <a href="https://www.gruponw.com/clientes" style="color: blue; " target="_blank">https://www.gruponw.com/clientes</a>
            </p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php
            include "foot_prices.php";
            ?>
            <div class="bloques_textos ">
                <h1>
                    NETWOODS, ESPECIALISTAS EN SOFTWARE Y DISEÑO WEB
                </h1>
                <p>
                    Nos  especializamos por crear páginas web y software de muy alta calidad,  
                    conservando unos estrictos parámetros de diseño para la comodidad de todos  nuestros clientes. 
                    Nuestra meta es la absoluta satisfacción de nuestros  usuarios en cualquiera de nuestras líneas de productos. 
                    Contamos con personal  altamente calificado, quienes no son sólo programadores; 
                    también poseen formas  de ver el diseño de software como un arte.  
                </p>
            </div>

            <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
                Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
                <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
            <div class="bloques_textos ">
                <p>Visite  nuestra página Web para enterarse de otras características que tienen nuestros  productos.<br />
                    <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                        <?php echo $emp["web"]; ?>
                    </a>
                </p>
                <p>Cordialmente,</p>
                <br />
                <?php
                $query = pg_exec("select a.id, a.usuario,b.firma, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
                        where a.id =" . $_GET["id"]);
                $user = pg_fetch_array($query);

                if (isset($user["firma"])) {
                    if ($user["firma"] != "") {
                        echo "<strong><img src='http://www.netwoods.net" . $user["firma"] . "' width='150' /></strong><br />";
                    }
                }
                echo "<strong>" . $user["nombre"] . "</strong><br />";
                echo "<strong>" . $user["cargo"] . "</strong><br />";
                echo "<span>E-mail: " . $user["email"] . "</span><br />";
                echo "<span>Móvil: " . $user["celular"] . "</span><br />";
                ?>
                <span>
                    Teléfono: <?php echo $emp["telefono"]; ?>
                </span>
                <br />
                <span>
                    <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                        <?php echo $emp["web"]; ?>
                    </a>
                </span>
                <br />
                <strong>
                    <?php echo $emp["razon_social"]; ?>
                </strong><br />
                <span>Fecha de Creación: <?php echo $fecha_final ?></span>
                <br />
                <?php
                $nummes = $nummes - 1;
                ?>
                <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

