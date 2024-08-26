<?php
if ($_GET["buscar_c"] != "") {
    $value = $_GET["buscar_c"];
} else {
    $value = "Busca Categorías";
}
$vale_input = $_GET["m"];
?>
<div class="div_buscar_in_contend_local">
    <div id="div_buscar_in_locales">
        <form action="/aplicaciones-web-empresas/inicio-2" method="get" id="buscar_form">
            <input type="hidden" name="m" value="<?php echo $vale_input ?>" />
            <input 
                name="buscar_c" type="text"
                value="<?php echo $value ?>"
                class="inputbox" id="buscar_c" 
                onblur="if (this.value == '')
                            this.value = '<?php echo $value ?>';" 
                onfocus="if (this.value == '<?php echo $value ?>')
                            this.value = '';" />
            <input class="input_search_locs" type="submit" value="Buscar" />
        </form>
    </div>
</div>

