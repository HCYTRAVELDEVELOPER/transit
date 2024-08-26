<style>
    body {
        overflow: hidden!important;
    }
</style>
<div class="box_info_popup">
    <form id="form_login">
        <div class="warep">
            <label>
                Correo
            </label>
            <input type="text" id="usuario" class="usuario_login" name="usuario" />
        </div>
        <div class="warep">
            <label>
                Contraseña
            </label>
            <input type="password" id="clave" class="clave_login" name="clave" />
        </div>
    </form>
    <div class="button_login" >
        <div class="lnk_crear" >
            Cree su cuenta
        </div>
        <div class="lnk_olvido" >
            ¿Olvidó su usuario o contraseña?
        </div>
    </div>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
        $(".usuario_login, .clave_login").keyup(function() {
            if ($(this).val() != "") {
                $(".error").fadeOut();
                $("#respuesta").remove();
                return false;
            }
        });
        $(".usuario_login").keyup(function() {
            if ($(this).val() != "" && emailreg.test($(this).val())) {
                $(".error").fadeOut();
                  $("#respuesta").remove();
                return false;
            }
        });
        $(".lnk_crear").click(function() {
            formCrearCuenta();
        });
        document.getElementById('usuario').focus();
    });
</script>

