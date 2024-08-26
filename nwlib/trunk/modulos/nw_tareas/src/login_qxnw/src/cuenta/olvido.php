<?
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_config.php';
?>
<script type="text/javascript">
    $(document).ready(function() {
        $("#form_cuenta").validate();
    });

    function intentar() {
        $("#div_recuperar").show();
        $("#div_no_recuperado").hide('slow');
    }
    
    function direccion(pagina){
        alert(pagina);
        location.href=pagina
    }
    
    function cerrar_olvido() {
        $("#div_crear_cuenta").hide('slow');
    }
</script>
<div id="div_recuperar">
    <div style="background-color: #<?= $nc_cfg["color_carrito"]; ?>; 
         height: 20px; text-align: center; padding: 10px; color: white; font-size: 14px;">Recupera tus datos
        <!--<div style="text-decoration: underline; font-size: 14px; text-align: right; margin-top: -20px;">
            <a href="javascript: cerrar_olvido()">
                Cerrar <img src="/nwproject/includes/jBasket/fly-to-basket/images/delete.png" ></img>
            </a>
        </div>-->
    </div>
    <form id="form_recuperar" name="form_recuperar" action="javascript: recuperar()">
        <table>
            <tr>
                <td>
                    <br />
                </td>
            </tr>
            <tr>
                <td>
                    <h3>Ingrese el correo electrónico que tiene registrado:</h3>
                </td>
                <td>
                    <input id="correo_recuperar" name="correo_recuperar" type="text" class="required"/>
                </td>
            </tr>

            <? if ($nc_cfg["seguridad"] == "SI") { ?>
                <tr>
                    <td colspan="2" >
                <center>
                    <img id="captcha_crear" src="/nwlib/securimage/securimage_show.php" alt="CAPTCHA Image"/>
                </center>
                </td>
                </tr>
                <tr>
                    <td colspan="2" align="left"><a href="" class="link-reload">
                            <a class="link-reload" href="javascript: reload_captcha()" style="font-size: 11px"><center>Recargar</center></a>
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="font-size: 11px;" colspan="2">
                <center>
                    Texto en la imagen:
                    <input type="text" tabindex="3" size="9" name="captcha_code_olvido" id="captcha_code_olvido"  maxlength="4" autocomplete="off" class="required"/>
                </center>
                </td>
                </tr>
            <? } ?>

                <tr>
                    <td>
                        <br />
                    </td>
                </tr>
            <tr>
                
                <td colspan="2">
            <center>
                <input type="submit" value="Recuperar" />
            </center>
            </td>
            </tr>
        </table>

    </form>
    <br>
    <h4 style="font-size: 12px; color: #464646">Servicio de recuperación de contraseñas</h4>
    <hr />
    <br />
</div>

<div id="div_recuperado" style="display: none;">
    <br />
    <div style="background-color: coral; height: 20px; text-align: center; padding: 10px;">Su usuario y clave han sido enviadas al correo ingresado.
        <!--<div style="text-decoration: underline; font-size: 14px; text-align: right; margin-top: -20px;">
            <a href="javascript: cerrar_olvido()">
                Cerrar <img src="/nwproject/includes/jBasket/fly-to-basket/images/delete.png" ></img>
            </a>
        </div>-->
    </div>
    <br>
    <br>
    <strong style="color: #464646; font-size: 12px;" >Si no encuentra el correo en su bandeja de entrada, pruebe en la carpeta de correo no deseado.</strong>
    <hr />
    <br>
    <br>
</div>

<div id="div_no_recuperado" style="display: none;">
    <h3>El correo ingresado no se encuentra registrado.</h3>
    <input type="button" id="mostrar_recuperar" name="mostrar_recuperar" value="Intentar nuevamente" onclick="intentar()"/>
    <br>
    <br>
</div>