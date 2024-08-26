<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_config.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/class/pageClass.php';
?> 
<script type="text/javascript">
    $(document).ready(function() {
        $("#form_login").validate();
    });
</script>
<?php
$db = NWDatabase::database();
$ca = new NWDbQuery($db);

//$sql = "select * from paginas where id=:id";
$sql = "select * from paginas where id=2";

if (!isset($_POST["pagina"])) {
    echo "No puede entrar a esta parte de la pagina.";
    return;
}

$ca->prepare($sql);
$ca->bindValue(":id", $_POST["pagina"]);

if (!$ca->exec()) {
    echo "No se pudo consultar el nombre de la página";
    return;
}

if ($ca->size() == 0) {
    echo "No se encontró la página. ";
    return;
}

$ca->next();

$pagina = $ca->assoc();

$pagina["num_pag"] = $_POST["pagina"];

$referencia = $pagina["num_pag"];
?>
<div id="div_login_consultas" style="width: 180px; ">
    <?php
    if (isset($_POST["variable"])) {
        ?>
        <center>
            <h4>Zona exclusiva para distribuidores</h4>
        </center>
        <br />
        <?php
    }

    if ($_POST['uss'] != "") {
        ?>
        <fieldset>
            <p><img alt="cuenta" src="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/nwproject/imagenes/cuenta1.png"/>Sesión iniciada</p>
            <br />
            <a href="http://<?php echo $_SERVER["HTTP_HOST"] . "/" . $nc_cfg["carpeta"] . "/" . $pagina["nombre"] . "-" . $pagina["num_pag"] . "?mi_espacio"; ?>" style="cursor: pointer; margin-left: 5px; text-decoration: underline; color: blue;">
                <img alt="arrow"  src="/nwproject/imagenes/arrow.png"/>
                Ir a mi espacio
            </a>
            <br />
            <a href="http://<?php echo $_SERVER["HTTP_HOST"]; ?>" style="cursor: pointer; margin-left: 5px; text-decoration: underline; color: blue;">
                <img alt="arrow"  src="/nwproject/imagenes/arrow.png"/>
                Home
            </a>
            <br />
            <br />
            <center>
                <strong style="font-size: 12px; text-align: center;"><?php echo $nc_cfg["texto_login"]; ?></strong>
            </center>
        </fieldset>
        <?php
    } else {
        $nom_pagina = "";

        $nom_pagina = NWPages::nombre_pagina($_POST["pagina"]);
        ?>
        <div id="general_index">
            <form id="form_login_two" name="form_login_two" method="post" action="none.php">
                <?php if (isset($_POST["variable"])) { ?>
                    <input id="in_referer" name="in_referer" type="hidden" value="<?php echo $_POST["referer"]; ?>"/>
                <?php } ?>
                <fieldset>
                    <legend>
                        <p><img alt="cuenta" src="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/nwproject/imagenes/cuenta1.png"/> Iniciar sesión</p>
                    </legend>
                    <div id="datos" title="Cuadro de diálogo">
                        <table>
                            <tr>
                                <td>
                                    ID
                                </td> 
                                <td>
                                    <input size="8" name="usuario" tabindex="1" id="usuario" type="text" class="required"/>
                                </td>

                                <td rowspan="2">
                                    <input name="ingresar" id="ingresar" class="btn curve send_data_login_two" value="Login" tabindex="3" type="submit" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Pass
                                </td>
                                <td>
                                    <input size="8" name="clave" id="clave" type="password" tabindex="2" class="required input_all"/>
                                </td>
                            </tr>

                            <?php if ($nc_cfg["seguridad"] == "SI") { ?>
                                <tr>
                                    <td colspan="2" >
                                <center>
                                    <img id="captcha" src="/nwlib/securimage/securimage_show.php" alt="CAPTCHA Image"/>
                                </center>
                                </td>
                                </tr>
                                <tr>
                                    <td>

                                    </td>
                                    <td align="left">
                                        <a href="" class="link-reload"><span style="font-size: 11px; text-decoration: underline; color: blue;">Recargar</span>
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="font-size: 11px;">
                                        Texto en la imagen:
                                    </td>
                                    <td>
                                        <input type="text" tabindex="3" size="9" name="captcha_code"  maxlength="4" autocomplete="off" class="required"/>
                                    </td>
                                </tr>

                                <?php
                            }
                            ?>

                            <?php if ($nc_cfg["crear_cuentas"] == "SI") { ?>
                                <tr>
                                    <td colspan="3" >
                                <center>
                                    <a href="#" class="lnk_crear" style="font-size: 11px; color: #0000FF;">Cree su cuenta</a>
                                </center>
                                </td>
                                </tr>
                            <?php } ?>

                            <?php if ($nc_cfg["recordar_clave"] == "SI") { ?>
                                <tr>
                                    <td colspan="3" >
                                <center>
                                    <a href="#" class="lnk_olvido" style="font-size: 11px; color: #0000FF;">¿Olvidó su usuario o contraseña?</a>
                                </center>
                                </td>
                                </tr>
                            <?php } ?>

                        </table>
                    </div>
                </fieldset>
            </form>
        </div>
        <?php
    }
    ?>
</div>