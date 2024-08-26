<style>
    body {
        overflow: hidden!important;
    }
</style>
<div class="div_crearCuenta_nws">
    <form id="formPedido">
        <div class="warep">
            <label>
                Nombre
            </label>
            <input type="text" id="nombre" name="nombre" class="nombre_crear" />
        </div>
        <div class="warep">
            <label>
                Email (Es tu usuario)
            </label>
            <input type="text" id="email" name="email" class="email_crear" />
        </div>
        <div class="warep">
            <label>
                Teléfono
            </label>
            <input type="text" id="telefono" name="telefono" class="telefono_crear" />
        </div>
        <div class="warep">
            <label>
                Documento
            </label>
            <input type="text" id="documento" name="documento" class="documento_crear" />
        </div>
        <div class="warep">
            <label>
                Contraseña
            </label>
            <input type="text" id="clave_registro" name="clave_registro" class="clave_registro" />
        </div>
    </form>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
        $(".nombre_crear, .email_crear, .clave_registro").keyup(function() {
            if ($(this).val() != "") {
                $(".error").fadeOut();
                return false;
            }
        });
        $(".email_crear").keyup(function() {
            if ($(this).val() != "" && emailreg.test($(this).val())) {
                $(".error").fadeOut();
                return false;
            }
        });
        document.getElementById('nombre').focus();
    });
</script>

