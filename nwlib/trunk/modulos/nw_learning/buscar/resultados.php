<?php
if (!function_exists("GetSQLValueString")) {

    function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);
        switch ($theType) {
            case "text":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "long":
            case "int":
                $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                break;
            case "double":
                $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                break;
            case "date":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "defined":
                $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                break;
        }
        return $theValue;
    }

}
?>
<div class='list_manual'>
    <h1 class="h1_full_text">
        Resultado de su búsqueda <?php echo $_GET["buscar"]; ?>
    </h1>
    <p>
        Seleccione el manual a explorar
    </p>
    <ul class="ul_contend_flours">
        <?php
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($_GET["MainUrl"] != "") {
            $sql = "select * from man_enc where publico='SI' and terminal=:terminal order by id asc";
            $ca->bindValue(":terminal", $arrayU["id"]);
        } else {
            $where = " ";
            $fields = "a.nombre,a.descripcion,a.objetivo,b.nombre,b.descripcion,c.nombre";
            $where .= " and ";
            $where .= NWDbQuery::sqlFieldsFilters($fields, $_GET["buscar"], true);
            $sql = "select a.nombre,a.descripcion,a.objetivo,a.id,a.terminal,a.imagen,func_concepto(terminal, 'terminales') as nom_terminal
                from man_enc a
                 LEFT  join man_categorias b on (b.man=a.id)
                 LEFT  join terminales c on (a.terminal=c.id)
                 where 1=1 " . $where . " group by a.nombre,a.descripcion,a.objetivo,a.id,a.terminal,a.imagen order by id asc";
        }
        
        $ca->prepare($sql);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            return;
        }
        if ($ca->size() == 0) {
            echo "<h3 class='no_found_contend'>No hay manuales que mostrar</h3>.";
            //return;
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $array = $ca->assoc();
            $manual_id_encrypt = base64_encode($array["id"]);

            $e = new encript;
            $tem = $e->encode($array["id"], $cl_v);
            $code_script = encript::$string; // valor encriptado

            encript::decode($tem, $cl_v);
            $decode_script = encript::$string;  //valor desencriptado

            $max_name = 30;
            $max_descp = 100;

            if (strlen($array["nombre"]) >= $max_name) {
                $text_name = substr($array["nombre"], 0, $max_name) . "...";
            } else {
                $text_name = substr($array["nombre"], 0, $max_name);
            }

            if (strlen($array["descripcion"]) >= $max_descp) {
                $text_descrip = substr($array["descripcion"], 0, $max_descp) . "...";
            } else {
                $text_descrip = substr($array["descripcion"], 0, $max_descp);
            }

            if ($array["imagen"] == "") {
                $imagen = "/nwproject/php/modulos/nwcommerce/images/espacio_imagen_producto300x300.jpg";
            } else {
                ?>
                <?php
                $imagen = $ruta_phpthumb . $url_enl_pr_los . $array["imagen"] . "&h=260";
                ?>
                <?php
            }
            ?>
            <li class="list_manualas_men select_<?php echo $array["id"] ?>">
                <div id="bookshelf" class="bookshelf">
                    <div class="figura_man">
                        <div class="book booked<?php echo $code_script ?>" style="background-image: url(<?php echo $imagen ?>);" onclick="javascript:open_details('<?php echo $code_script ?>')"></div>
                        <div class="detalles_manu detalles<?php echo $code_script ?>">
                            <div class="cerrar_equis equis<?php echo $code_script ?>"><a href="javascript:close_details('<?php echo $code_script ?>')">x</a></div>
                            <h3>
                                <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" > 
                                    <?php echo $text_name; ?>
                                </a>
                            </h3>
                            <p>
                                <?php echo $text_descrip; ?>
                            </p>
                            <a class="button_red_dos button_bottom" href="<?php echo $url_gen . "?m=" . $code_script; ?>">
                                Ingresar
                            </a>
                        </div>
                        <div class="links_manual">
                            <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" >Ingresar </a>
                            <a class="details_button_m mmm_<?php echo $code_script ?>" href="javascript:open_details('<?php echo $code_script ?>')" >Detalles</a>
                        </div>
                        <div class="text_flour">
                            <h1>
                                <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" > 
                                    <?php echo $text_name; ?>
                                </a>
                            </h1>
                            <p>
                                <?php
                                $dbb = NWDatabase::database();
                                $ca_u = new NWDbQuery($dbb);
                                $sqlu = "select * from terminales where id=:terminal";
                                $ca_u->bindValue(":terminal", $array["terminal"]);
                                $ca_u->prepare($sqlu);
                                if (!$ca_u->exec()) {
                                    echo "No se pudo realizar la consulta de la búsqueda. ";
                                    // return;
                                }
                                if ($ca_u->size() == 0) {
                                    
                                } else {
                                    $ca_u->next();
                                    $arrayUs = $ca_u->assoc();
                                    echo "<a href='http://" . $_SERVER['HTTP_HOST'] . "/" . $arrayUs["url"] . "' >" . substr($arrayUs["nombre"], 0, 100) . "</a>";
                                }
                                ?>
                            </p>
                        </div>
                    </div>
                </div>
            </li>
            <?php
        }
        ?>
    </ul>
</div>