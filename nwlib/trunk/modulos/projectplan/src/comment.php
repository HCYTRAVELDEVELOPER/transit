<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    ?>
    <script>
        iniciarSesion();
    </script>
    <?php
    return;
}
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
?>
<script type="text/javascript">
    function envia_dato(p) {
        $(".adjunto").val(p);
    }
    function envia_datos_editor(p) {
        $(".ckediot").val(p);
    }
</script>
<div class="form_box_right">
    <div>
        <iframe src="/nwlib/modulos/nw_tareas/includes/editor/editor1.php" name="SubHtmlEditor" id="SubHtmlEditor"
                width="100%" height="230px" scrolling="auto" frameborder="0">
        <p>Texto alternativo para navegadores que no aceptan iframes.</p>
        </iframe>
        <textarea id="observaciones" name="observaciones" class="required ckediot" style="display: none;"></textarea>
    </div>
    <div class="box_adjunte">
        <input id="adjunto" name="adjunto" class="adjunto" type="hidden" value="" />
        <iframe src="/nwlib/modulos/nw_tareas/includes/upload_ajax/index.php" name="SubHtml"
                width="100%" height="240px" scrolling="auto" frameborder="0">
        <p>Texto alternativo para navegadores que no aceptan iframes.</p>
        </iframe>
    </div>
</div>
<input id="ingresar" type="submit" value="enviar" style="display: none;"/>
<!--</form>-->