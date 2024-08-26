
<?php
if ($_GET["buscar"] != "") {
    $value = $_GET["buscar"];
} else {
    $value = "Busca Manuales";
}
?>
<div class="div_buscar_in_contend_local">
    <div id="div_buscar_in_locales">
        <form action="/aplicaciones-web-empresas/inicio-2" method="get" id="buscar_form">
            <input  list="dias"
                name="buscar" type="text"
                value="<?php echo $value ?>"
                class="inputbox" id="buscar" 
                onblur="if (this.value == '')
                            this.value = '<?php echo $value ?>';" 
                onfocus="if (this.value == '<?php echo $value ?>')
                            this.value = '';" />
            <datalist id="dias">
        <option value="Lunes" />
        <option value="Martes" />
        <option value="Miércoles" />
        <option value="Jueves" />
        <option value="Viernes" />
        <option value="Sábado" />
        <option value="Domingo" />
    </datalist>
            <input class="input_search_locs" type="submit" value="Buscar" />
        </form>
    </div>
</div>

