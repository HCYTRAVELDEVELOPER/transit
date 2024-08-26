<div class="div_buscar_in_contend_local">
    <div id="div_buscar_in_locales">
        <form action="#show_map" method="get" id="buscar_form">
            <input style=""
                   name="buscar_mapas" type="text"
                   value="Busca sitios" 
                   class="inputbox" id="buscar_mapas" 
                   onblur="if (this.value == '')
                               this.value = 'Busca sitios';" 
                   onfocus="if (this.value == 'Busca sitios')
                               this.value = '';" />
            <input class="input_search_locs" type="submit" />
        </form>
    </div>
</div>
<?php
if ($_GET["buscar_mapas_general"] != "") {
    include $_SERVER["DOCUMENT_ROOT"] . "/nwproject/php/modulos/nw_maps/buscar/resultados_general.php";
}
?>
