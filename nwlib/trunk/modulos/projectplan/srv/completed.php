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
<!--<form id="form_two" name="form_two">-->
<div class='form_box_left'>
    <div>
        <div class='div_list_new'>
            <label>Tipo</label>
            <?php
            echo $_POST["type"];
            ?>
            <select class='required' name='tipo' id='tipo'>
                <option value='tarea' <?php if($_POST["type"] == "tareas"){ echo "selected='selected'";} ?>>Tarea</option>
                <option value='adicional' <?php if($_POST["type"] == "adicionales"){ echo "selected='selected'";} ?>>Tarea Adicional</option>
                <option value='cita'>Cita</option>
                <option value='mensaje'>Mensaje / Recordatorio</option>
            </select>
            <label>Fecha de Entrega:</label> 
            <input type='date' id='fecha_final' name='fecha_final' class='required' value='<?php echo date("Y-m-d"); ?>'>
            <label>Hora</label>
            <input type='time' id="hora_final" name='hora' class='required' value='12:00'>
        </div>
    </div>
</div>
<div class="form_box_right">
    <div>
        <iframe src="/nwlib6/modulos/nw_tareas/includes/editor/editor1.php" name="SubHtmlEditor" id="SubHtmlEditor"
                width="100%" height="230px" scrolling="auto" frameborder="0">
        <p>Texto alternativo para navegadores que no aceptan iframes.</p>
        </iframe>
        <textarea id="observaciones" name="observaciones" class="required ckediot" style="display: none;"></textarea>
    </div>
    <div class="box_adjunte">
        <input id="adjunto" name="adjunto" class="adjunto" type="hidden" value="" />
        <iframe src="/nwlib6/modulos/nw_tareas/includes/upload_ajax/index.php" name="SubHtml"
                width="100%" height="240px" scrolling="auto" frameborder="0">
        <p>Texto alternativo para navegadores que no aceptan iframes.</p>
        </iframe>
    </div>
</div>
<input id="ingresar" type="submit" value="enviar" style="display: none;"/>
<!--</form>-->