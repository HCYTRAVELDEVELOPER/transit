<?php

if (isset($_GET["vista"])) {
    if ($_GET["vista"] == "nwvista") {
        require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
        if (!isset($_SESSION["usuario"])) {
            return;
        }
        echo "<script type='text/javascript' src='/nwproject/utilities/jquery/jquery.min.js' ></script>";
    }
}

function loadGrupos($id, $nwtablemaker) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $rta = "";

//    $ca->prepareSelect("nwforms_grupos a", "a.id,a.nombre,a.descripcion,a.columnas_inputs,a.visible", " a.id_form=:id and (select count(*) from nwforms_preguntas b where b.grupo=a.id and b.id_enc=:id)!=0 order by a.orden asc");
    $ca->prepareSelect("nwforms_grupos a", "a.id,a.nombre,a.descripcion,a.columnas_inputs,a.visible", " a.id_form=:id order by a.orden asc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        return "Error. " . $ca->lastErrorText();
    }
    $total = $ca->size();
    //en pruebas, se repite el id en los grupos... se inhabilita para credibanco
    if ($_SERVER["HTTP_HOST"] == "credibanco.gruponw.com" || $_SERVER["HTTP_HOST"] == "www.credibanco.gruponw.com" || $_SERVER["HTTP_HOST"] == "credibanco.loc" || $_SERVER["HTTP_HOST"] == "www.admincredibanco.gruponw.com" || $_SERVER["HTTP_HOST"] == "admincredibanco.gruponw.com") {
        $rta .= loadFormsPreguntas($id, $nwtablemaker, null);
        return $rta;
    } else {
        $load = false;
        if ($total == 0) {
            $load = true;
            $rta .= loadFormsPreguntas($id, $nwtablemaker, null);
        } else {
            for ($i = 0; $i < $total; $i++) {
                $r = $ca->flush();
                $visible = "";
                if ($r["visible"] == "NO") {
                    $visible = "groupNOVisible";
                }

                $rta .= "<div class='divGroupForm divGroupForm_{$r["id"]} {$visible}'>";
                $rta .= "<h2 class='titleGroupForm titleGroupForm_{$r["id"]}' >{$r["nombre"]}</h2>";
                if ($r["columnas_inputs"] != null && $r["columnas_inputs"] != "") {
                    $w = 100 / $r["columnas_inputs"];
                    $rta .= "<style>.divGroupForm_{$r["id"]} .divContainInput{width: {$w}%;}</style>";
                }
                if ($r["descripcion"] != null && $r["descripcion"] != "") {
                    $rta .= "<div class='descripcionGroupForm descripcionGroupForm_{$r["id"]}' >{$r["descripcion"]}</div>";
                }
                $rta .= loadFormsPreguntas($id, $nwtablemaker, $r["id"]);
                $rta .= "</div>";
            }
        }
    }
    if ($load == false) {
        $rta .= loadFormsPreguntas($id, $nwtablemaker, "0");
    }
    return $rta;
}

function loadFormsPreguntasValores($id, $tableData, $value, $order, $orderAscDesc) {
    $ruta = "/nwlib6/nwproject/modules/nwforms/srv/loadFormsPreguntasValores.php";
    $filename = $_SERVER["DOCUMENT_ROOT"] . $ruta;
    if (is_file($filename)) {
        ob_start();
        include $filename;
        return ob_get_clean();
    }
}

function loadFormsPreguntasValoresCheckBox($id, $type, $name, $idDiv, $class, $id_other, $title, $id_enc, $required, $data) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $rta = "";
    $ca->prepareSelect("nwforms_preguntas_valores", "*", " id_pregunta=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        $rta = "Error. " . $ca->lastErrorText();
        return;
    }

    $inputdat = "datainp='{$data["id"]}'";
    $typeData = "data-type='{$data["tipo"]}'";
    $revOrden = "data-revorden='{$data["rev_orden"]}'";
    $revLabel = "data-revlabel='{$data["rev_label"]}'";

    $total = $ca->size();
    if ($ca->size() > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $num = $i;
            $classCheck = "";
            if ($type == "checkbox") {
                $classCheck = " checkbox_input checkbox_activar checkbox_{$num}";
            }
            $rta .= "<div class='radio_nw'>";
            $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  datainp='{$id}' validations='{$data["validaciones"]}' sies_valor='{$data["sies_valor"]}' sies_efecto='{$data["sies_efecto"]}' sies_pregunta='{$data["sies_pregunta"]}'  type='{$type}' name='{$name}' id='{$idDiv}' check='{$num}' class='{$class}{$classCheck} inputdatanwcheckradio inputdatanwform{$id} inputdatanwform{$id}_{$i}' data-t='{$title}'  data-i='{$id_enc}' value='{$r["value"]}'  require='{$required}' /> ";
            $rta .= "<div class='containtextfo containtextfo_{$id} containtextfo_{$id}_{$i}'>{$r["nombre"]}</div> </div>";
        }
    }
    return $rta;
}

function createInputsFor($cols) {
    $rta = "";
    $total = count($cols);
    for ($i = 0; $i < $total; $i++) {
        $rta .= createInputs($cols[$i]);
    }
    return $rta;
}

function createInputs($r) {
    if (!isset($r["id_parameter"])) {
        $r["id_parameter"] = "0";
    }
    if (!isset($r["id"])) {
        $r["id"] = "0";
    }
    if (!isset($r["texto_ayuda"])) {
        $r["texto_ayuda"] = "";
    }
    if (!isset($r["class"])) {
        $r["class"] = "inputdatanwform";
    }
    if (!isset($r["name_submit"])) {
        $r["name_submit"] = "";
    }
    if (!isset($r["requiredClass"])) {
        $r["requiredClass"] = "";
    }
    if (!isset($r["idDiv"])) {
        $r["idDiv"] = $r["name"];
    }
    if ($r["name_submit"] != "") {
        $r["name"] = $r["name_submit"];
    }
    $r["required"] = "NO";
    if ($r["requerido"] == "SI") {
        $r["required"] = "SI";
        $r["requiredClass"] = " <span class='requiredSpanNw'> *</span>";
    }
    $value = "";
    if (isset($r["value"])) {
        $value = $r["value"];
    }
    $visible = "";
    $visibleClass = "";
    if (isset($r["visible"])) {
//        if ($r["visible"] != false) {
//            $visible = "visible='" . $r["visible"] . "' ";
//            $visibleClass = " fieldNotVisible";
//        }
        if ($r["visible"] == "NO") {
            $visible = "visible='" . $r["visible"] . "' ";
            $visibleClass = " fieldNotVisible";
        }
    }
    $dataTable = null;
    if (isset($r["tabla_data_si_no"])) {
        if ($r["tabla_data_si_no"] == "SI") {
            if ($r["tabla_data"] != "") {
                $dataTable = $r["tabla_data"];
            }
        }
    }
    $class_required = "";
    if ($r["required"] == "SI") {
        $class_required = " required ";
    }
    $enabled = "";
    $disabled = "";
    if (isset($r["enabled"])) {
        if ($r["enabled"] == "false") {
            $enabled = " div_enabled_nwf";
            $disabled = " disabled";
        }
    }

    //caracteres mínimos y máximos
    $maxlength = "";
    $minlength = "";
    if (isset($r["car_min"])) {
        if ($r["car_min"] != "") {
            $minlength = "minlength='{$r["car_min"]}'";
        }
    }
    if (isset($r["car_max"])) {
        if ($r["car_max"] != "") {
            $maxlength = "maxlength='{$r["car_max"]}'";
        }
    }
//print_r($_SESSION);
    //valor por defecto de sesión
    if (isset($r["llenar_con_dato_de_session"])) {
        if ($r["llenar_con_dato_de_session"] != "") {
            if ($r["llenar_con_dato_de_session"] == "fecha_actual") {
                $value = date("Y-m-d");
            } else
            if (isset($_SESSION[$r["llenar_con_dato_de_session"]])) {
                $value = $_SESSION[$r["llenar_con_dato_de_session"]];
            }
        }
    }

    ///////////////comprueba el idioma
//    $idioma = nwproject::getIdioma();
    $idioma_native = false;
    $idioma = nwprojectOut::getIdioma();
    if (nwMaker::evalueData($idioma)) {
        $idioma_sql = nwprojectOut::getIdiomaNative($idioma);
        if ($idioma_sql != false) {
            $idioma_native = $idioma_sql["name_in_english"];
        }
    }

    $inputdat = "datainp='{$r["id"]}'";
    $typeData = "data-type='{$r["tipo"]}'";
    $revOrden = "data-revorden='{$r["rev_orden"]}'";
    $revLabel = "data-revlabel='{$r["rev_label"]}'";

    $rta = "";
    $rta .= "<div class='divContainInput divContainInput{$r["id"]} {$visibleClass} divContainInput_{$r["name_submit"]}'>";
    $rta .= "<div class='divContainInputIntern divContainInputIntern{$r["id"]}'>";
//    $rta .= "<p>";
    $rta .= "<label for='{$r["idDiv"]}'>";
    $label = $r["nombre"];
    $label = str_replace("_", " ", $label);
    $rta .= $label;
    $rta .= $r["requiredClass"];
//    $rta .= "</p>";
    $rta .= "</label>";
    if ($r["tipo"] == "uploader") {
//        $rta .= "<input type='file' name='{$r["name"]}'  id-div='{$r["idDiv"]}' />";
//        $rta .= "<input type='file' name='uploader_{$r["name"]}'  id-div='{$r["idDiv"]}' id='uploader_{$r["idDiv"]}' />";
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  type='file' name='uploader_{$r["idDiv"]}'  id-div='{$r["idDiv"]}' id='uploader_{$r["idDiv"]}' />";
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  noastericrequired='NO'  type='hidden' typeNwmaker='file' name='" . $r["idDiv"] . "' id='{$r["idDiv"]}' class='{$r["class"]} inputdatanwform{$r["id"]}' data-t='{$r["nombre"]}' {$class_required} {$enabled} $disabled   require='{$r["required"]}' data-i='{$r["id_parameter"]}' />";
        $rta .= "<div class='showImage showImageNwForm showImage{$r["idDiv"]} nameimgup_{$r["idDiv"]}'></div>";
        $rta .= "<p class='textholder_uploader'>{$r["texto_ayuda"]}</p>";
    } else
    if ($r["tipo"] == "textField" || $r["tipo"] == "email" || $r["tipo"] == "number" || $r["tipo"] == "stars") {
        $mode = "";
        $type = "text";
        if ($r["tipo"] == "email") {
            $mode = "mode='email'";
            $type = "email";
        } else
        if ($r["tipo"] == "number") {
            $mode = "mode='number'";
            $type = "number";
        }
        $classgeneric = "inputdatanwform{$r["id"]}";
        if ($r["tipo"] == "stars") {
            $visibleClass = " fieldNotVisibleStars";
            $rta .= "<div class='widgetStars widgetStars_{$classgeneric}'>";
            $rta .= "<span class='start_blob start_blob_1 start_blob_{$classgeneric}' data='1' data-input='$classgeneric'></span>";
            $rta .= "<span class='start_blob start_blob_2 start_blob_{$classgeneric}' data='2' data-input='$classgeneric'></span>";
            $rta .= "<span class='start_blob start_blob_3 start_blob_{$classgeneric}' data='3' data-input='$classgeneric'></span>";
            $rta .= "<span class='start_blob start_blob_4 start_blob_{$classgeneric}' data='4' data-input='$classgeneric'></span>";
            $rta .= "<span class='start_blob start_blob_5 start_blob_{$classgeneric}' data='5' data-input='$classgeneric'></span>";
            $rta .= "</div>";
        }
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  noastericrequired='NO' {$maxlength} {$minlength} {$mode} required {$visible}  placeholder='{$r["texto_ayuda"]}' type='{$type}' name='" . $r["name"] . "' id='{$r["idDiv"]}' class='{$r["class"]}{$visibleClass} {$r["name"]} {$classgeneric} {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}'  require='{$r["required"]}' data-i='{$r["id_parameter"]}' value='{$value}' />";
    } else
    if ($r["tipo"] == "textArea") {
        $rta .= "<textarea {$inputdat} {$typeData} {$revOrden} {$revLabel}  noastericrequired='NO' placeholder='{$r["texto_ayuda"]}' name='{$r["name"]}' id='{$r["idDiv"]}' class='{$r["class"]} {$r["name"]} inputdatanwform{$r["id"]}  {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}' require='{$r["required"]}' data-i='{$r["id_parameter"]}' >{$value}</textarea>";
    } else
    if ($r["tipo"] == "selectBox") {
        $order = "";
        $orderAscDesc = "";
        if (isset($r["orden_lista"])) {
            $order = $r["orden_lista"];
        }
        if (isset($r["orden_asc_desc"])) {
            $orderAscDesc = $r["orden_asc_desc"];
        }
        $rta .= "<select {$inputdat} {$typeData} {$revOrden} {$revLabel}  order='{$order}' order_asc='{$orderAscDesc}' noastericrequired='NO' placeholder='{$r["texto_ayuda"]}' validations='{$r["validaciones"]}' sies_valor='{$r["sies_valor"]}' sies_efecto='{$r["sies_efecto"]}' sies_pregunta='{$r["sies_pregunta"]}' name='{$r["name"]}' id='{$r["idDiv"]}' ref='{$r["id"]}' class='{$r["class"]} {$r["name"]} inputdatanwform{$r["id"]}  {$class_required}{$enabled} selectBox{$r["id"]} ' $disabled data-t='{$r["nombre"]}' require='{$r["required"]}' data-i='{$r["id_parameter"]}' >";
        $text_seleccione = "";
        if ($idioma_native == "english") {
            $text_seleccione = "Select";
        }
        $rta .= loadFormsPreguntasValores($r["id"], $dataTable, $value, $order, $orderAscDesc);
        $rta .= "</select>";
    } else
    if ($r["tipo"] == "radio" || $r["tipo"] == "checkbox") {
        $rta .= loadFormsPreguntasValoresCheckBox($r["id"], "{$r["tipo"]}", $r["name"], $r["idDiv"], $r["class"], $r["id"], $r["nombre"], $r["id_parameter"], $r["required"], $r);
    } else
    if ($r["tipo"] == "date" || $r["tipo"] == "dateField") {
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  value='{$value}' noastericrequired='NO' placeholder='{$r["texto_ayuda"]}' type='date' name='{$r["name"]}' id='{$r["idDiv"]}' class='{$r["class"]} inputdatanwform{$r["id"]}  {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}'  require='{$r["required"]}' data-i='{$r["id_parameter"]}' />";
    } else
    if ($r["tipo"] == "time") {
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  value='{$value}' noastericrequired='NO' placeholder='{$r["texto_ayuda"]}' type='time' name='{$r["name"]}' id='{$r["idDiv"]}' class='{$r["class"]} inputdatanwform{$r["id"]} {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}'  require='{$r["required"]}' data-i='{$r["id_parameter"]}' />";
    } else
    if ($r["tipo"] == "datetime") {
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  value='{$value}' noastericrequired='NO' placeholder='{$r["texto_ayuda"]}' type='datetime-local' name='{$r["name"]}' id='{$r["idDiv"]}' class='{$r["class"]} inputdatanwform{$r["id"]} {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}'  require='{$r["required"]}' data-i='{$r["id_parameter"]}' />";
    } else
    if ($r["tipo"] == "label") {
        $rta .= "<div type='divlabel' id='{$r["idDiv"]}' class='{$r["class"]} inputdatanwform{$r["id"]} ' data-t='{$r["nombre"]}'  data-i='{$r["id_parameter"]}' ></div>";
    } else {
        $rta .= "<input {$inputdat} {$typeData} {$revOrden} {$revLabel}  noastericrequired='NO' {$visible}  placeholder='{$r["texto_ayuda"]}' type='text' name='" . $r["name"] . "' id='{$r["idDiv"]}' class='{$r["class"]}{$visibleClass} {$r["name"]} inputdatanwform{$r["id"]} {$class_required} {$enabled}' $disabled  data-t='{$r["nombre"]}'  require='{$r["required"]}' data-i='{$r["id_parameter"]}' value='{$value}' />";
//        $rta .= "<img class='imgSpeach' onclick='startDictation(\"{$r["idDiv"]}\")' src='//i.imgur.com/cHidSVu.gif' />";
    }
    $rta .= "</div>";
    $rta .= "</div>";
    return $rta;
}

function traeColsFormOffline($id) {
    $rta = "";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwforms_preguntas", "id, tipo,name_submit,requerido", " id_enc=:id order by orden asc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        return "Error. " . $ca->lastErrorText();
    }
    $total = $ca->size();
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $r = $ca->flush();
            $name = $r["tipo"] . $r["id"];
            if ($r["name_submit"] != null && $r["name_submit"] != "")
                $name = $r["name_submit"];
            $rta .= "  {
            name: '{$name}',
            field: '{$name}',
            unique: false
        },
            ";
        }
    }
    return $rta;
}

function loadFormsPreguntas($id, $nwtablemaker, $grupo) {
    $rta = "";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    if ($id != "0" && $id != "newrecord") {
        $where = "id_enc=:id ";
        if ($grupo != null) {
            $where .= " and grupo=:grupo";
        }
        $where .= " order by orden asc";
        $ca->prepareSelect("nwforms_preguntas", "id,texto_ayuda,tipo,name_submit,nombre,requerido,tabla_data_si_no,tabla_data,car_min,car_max,llenar_con_dato_de_session,sies_valor,sies_efecto,sies_pregunta,validaciones,visible,orden_lista,orden_asc_desc,rev_orden,rev_label", $where);
        $ca->bindValue(":id", $id);
        if ($grupo != null) {
            $ca->bindValue(":grupo", $grupo);
        }
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $total = $ca->size();
        if ($total == 0) {
            $rta .= "";
        }
        for ($i = 0; $i < $total; $i++) {
            $r = $ca->flush();
            $r["id"] = $r["id"];
            $r["id_parameter"] = $id;
            $r["texto_ayuda"] = $r["texto_ayuda"];
            $r["class"] = "inputdatanwform";
            $r["name_submit"] = $r["name_submit"];
            $r["idDiv"] = "inputnw" . $i;
            //IMPORTANTES
            $r["tipo"] = $r["tipo"];
            $r["name"] = $r["tipo"] . $r["id"];
            $r["nombre"] = $r["nombre"];
            $r["requerido"] = $r["requerido"];
            $r["car_min"] = $r["car_min"];
            $r["car_max"] = $r["car_max"];
            $r["llenar_con_dato_de_session"] = $r["llenar_con_dato_de_session"];
            $r["orden_lista"] = $r["orden_lista"];
            $r["orden_asc_desc"] = $r["orden_asc_desc"];
            $rta .= createInputs($r);
        }
    } else {
        $driver = $db->getDriver();
        $database = $db->getDatabaseName();
        ///CONSULTA IMPORTANTE COMENTADA ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $nameIsNull = "";
        if ($driver == "MYSQL") {
            $sql = "
                SELECT
                    cols.column_name,
                    cols.data_type,
                    cols.is_nullable,
                    cols.character_maximum_length,
                    cols.column_comment as description
                FROM INFORMATION_SCHEMA.COLUMNS cols
                WHERE table_schema=:schema AND table_name=:table
                ORDER BY ordinal_position;";
        } else {
            //PARA EXTRAER COMENTARIOS DE TABLA PSQL
//             $ca->prepare("select obj_description('public.{$nwtablemaker}' ::regclass) as COLUMN_COMMENT");
            $sql = "SELECT cols.column_name,cols.is_nullable,
                cols.data_type,
                cols.character_maximum_length,
                (select pg_catalog.col_description(oid, cols.ordinal_position::int)
                from pg_catalog.pg_class c
                where c.relname = cols.table_name
                ) as description
                FROM information_schema.columns cols
            WHERE 
                cols.table_name =:table
                order by cols.ordinal_position;";
//            $sql = "SELECT cols.*,
//                (select pg_catalog.col_description(oid, cols.ordinal_position::int)
//                from pg_catalog.pg_class c
//                where c.relname = cols.table_name
//                ) as description
//                FROM information_schema.columns cols
//            WHERE 
//                cols.table_name =:table
//                order by cols.ordinal_position;";
            $nameIsNull = "is_nullable";
        }
        $ca->prepare($sql);
        $ca->bindValue(":table", $nwtablemaker);
        $ca->bindValue(":schema", $database);
        if (!$ca->exec()) {
            echo "No se pudo error:" . $ca->lastErrorText();
            return;
        }
        for ($ii = 0; $ii < $ca->size(); $ii++) {
            $ca->next();
            $tb = $ca->assoc();
//            $r["id"] = "new_master";
            $r["id"] = $id;
            $r["tipo"] = "textField";
            $r["name"] = $tb["column_name"];
            $r["nombre"] = $tb["column_name"];
            $r["requerido"] = "SI";
            if (isset($tb["$nameIsNull"])) {
                if ($tb["$nameIsNull"] == "YES") {
                    $r["requerido"] = "NO";
                }
            }
//            print_r($tb);
//            type,table or class.method,visible,required,mode,label,filtro(true or false)
            //ESTRAE EL PRIMER VALOR PARA COMPROBAR EL TIPO DE CAMPO
            $descExploit = explode(",", $tb["description"]);
            if (isset($descExploit[0])) {
                $r["tipo"] = $descExploit[0];
                /////////////////////////////////////////////////EXTREAE LA TABLA DEL SELECTBOX
                if (isset($descExploit[1])) {
                    if ($descExploit[0] == "selectBox") {
                        $r["tabla_data_si_no"] = "SI";
                        $r["tabla_data"] = $descExploit[1];
                    }
                }
            }
            //CREA UNA VARIABLE QUE DETERMINA QUE SE PUEDE MOSTRAR EL CAMPO SIEMPRE EN ERROR = 0
            $error = 0;
            //COMPRUEBA QUE EXISTA UN TERCER VALOR QUE EN CASO DE SER 0 NO MUESTRA EL CAMPO
            if (isset($descExploit[2])) {
                //EN CASO DE SER 0 NO MUESTRA EL CAMPO
                if ($descExploit[2] == 0) {
                    $error = 1;
                }
            }
            $r["visible"] = false;
            if ($r["name"] == "id") {
                $error = 0;
//                $r["visible"] = "SI";
                $r["visible"] = "true";
                $r["requerido"] = "NO";
            }

            if ($error == 0) {
                $rta .= createInputs($r);
            }
        }
    }
    return $rta;
}

function loadFormsMain($idForm, $nwtablemaker) {
    $rta = "";
    if ($idForm != "0" && $idForm != "false" && $idForm != "alf" && $idForm != "createFormByTable" && $idForm != "editFormByTable") {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = master::clean($idForm);
        $offline = "NO";
        $ca->prepareSelect("nwforms_enc", "*", " id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            $rta = "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $offline = $r["offline"];
    } else {
        $r = array();
        $r["id"] = $idForm;
        $r["nombre"] = "";
        $r["submit_externo"] = "SI";
        $r["funcion_submit_externo"] = "funcSavForm";
        $offline = "NO";
        $r["offline_usar_consulta"] = "NO";
        $r["codigo_libre"] = "";
        $r["ancho_maximo"] = "";
        $r["privado"] = "";
        $r["url_redireccion_final"] = "";
    }
    $action = "NO";
    $action_data = "";
    if (isset($r["submit_externo"])) {
        if ($r["submit_externo"] == "SI" && $r["funcion_submit_externo"] != "") {
            $action = $r["submit_externo"];
            $action_data = $r["funcion_submit_externo"];
        }
    }
    $tableDb = "nwform{$idForm}";
    $css = "style='";
    if ($r["ancho_maximo"] != null & $r["ancho_maximo"] != "") {
        $css .= "max-width:" . $r["ancho_maximo"] . "px;";
    }
    $css .= "'";
    if ($r["codigo_libre"] != null & $r["codigo_libre"] != "") {
        $rta .= $r["codigo_libre"];
    }
    if ($r["privado"] == "SI") {
        if (!isset($_SESSION["usuario"])) {
            if ($r["tipo_login"] == "user_pass") {
                header('Location: /nwlib6/nwproject/modules/nw_user_session/index.php');
            } else
            if ($r["tipo_login"] == "user") {
                header("Location: /nwlib6/nwproject/modules/nw_user_session/index.php?loginUserOnly=true&urlRedirect=/nwlib6/nwproject/modules/nwforms/index.php;que;form;igual;{$idForm};ampt;vista;igual;nwvista");
            }
        }
    }
    $btnreCAPTCHA = "";
    if (isset($r["activar_reCAPTCHA"])) {
        if ($r["activar_reCAPTCHA"] === "SI") {
            $rta .= "<script src='https://www.google.com/recaptcha/api.js'></script>";
            $_SESSION["sitekey_reCAPTCHA"] = $r["sitekey_reCAPTCHA"];
            $_SESSION["secretKey_reCAPTCHA"] = $r["secretKey_reCAPTCHA"];
            $btnreCAPTCHA = "<div class='g-recaptcha' data-sitekey='" . $r["sitekey_reCAPTCHA"] . "'></div>";
        }
    }

    $funcion_submit_final = "";
    if (isset($r["funcion_submit_final"])) {
        if ($r["funcion_submit_final"] != null && $r["funcion_submit_final"] != "" && $r["funcion_submit_final"] != "0") {
            $funcion_submit_final = " data-sub-end='" . $r["funcion_submit_final"] . "' ";
        }
    }

    $rta .= "<form {$funcion_submit_final} offline='{$offline}' data-db='{$tableDb}' enctype='multipart/form-data' id='nwform' class='nwform nwformnumber_{$idForm}' data-i='{$idForm}' data-action='{$action}' 
                   data-action-func='{$action_data}' data-consult='{$r["offline_usar_consulta"]}' {$css} url-redirect='{$r["url_redireccion_final"]}' >";
    $rta .= "<div class='containerInternNwForm'>";
    $rta .= "<h2 class='titlePrincipalNwForm'>{$r["nombre"]}</h2>";
    //FUNCIONALIDAD OFFLINE
    if (isset($r["offline"])) {
        if ($r["offline"] == "SI") {
            $rta .= "<script id='myscript' type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/offline.js' ></script>";
            $rta .= "<script id='myscript' type='text/javascript' src='/nwproject/structure/js/nwdb.js' ></script>";

            if (isset($r["css_offline"])) {
                if ($r["css_offline"] == "SI") {
                    $rta .= "  <link href='/nwlib6/nwproject/modules/nwforms/css/styleOffline.css' rel='stylesheet' type='text/css' />";
                }
            }
            $fieldsForm = traeColsFormOffline($r["id"]);
            $rta .= "<script>  var columns = [{$fieldsForm}];</script>";
            $rta .= "<script>startDB('bd{$idForm}nwproject5{$r["version_db"]}', '{$tableDb}', columns, {$r["version_db"]});</script>";
            $rta .= "<div class='containOfflineAll'>";
            $rta .= "<div class='containOfflineAllButtons'>";
            $rta .= "<button type='button' data-db='{$tableDb}' class='loadTableDb'>Cargar Historial</button>";
            $rta .= "<button type='button'  class='newRegistroNwForm'>Crear nuevo registro</button>";
            $rta .= "<button type='button'  data-db='{$tableDb}' class='nwSync' data-url='{$r["url_php_sincronizar"]}' >Sincronizar</button>";
            $rta .= "</div>";
            $rta .= "<table id='elementsList' class='elementsList' ></table>";
            $rta .= "</div>";
        }
    }
//FIN OFFLINE
    $rta .= "<div class='containFormFields' >";

    //CREA COLUMNAS DIRECTAS SIN CONSULTAS SOLO LE PASA EL ARRAY DE ARRAYS 
    if ($idForm == "false") {
        $rta .= loadGrupos("0", $nwtablemaker);
    } else
    if ($idForm == "createFormByTable") {
        $rta .= loadFormsPreguntas("newrecord", $nwtablemaker, null);
    } else
    if ($idForm == "alf") {
        $rta .= createInputsFor($nwtablemaker);
    } else {
        $rta .= loadGrupos($r["id"], $nwtablemaker);
    }

    $rta .= $btnreCAPTCHA;

    $createNext = false;
    $rta .= "<div class='divSendNwForm'>";
    if (isset($r["id_form_atras"])) {
        if ($r["id_form_atras"] != null && $r["id_form_atras"] != "" && $r["id_form_atras"] != "0") {
            $createNext = true;
            $rta .= "<input type='button' id='sendNwForm' class='btnNwForm backNwForm_{$idForm}' data-i='{$idForm}' data-next='{$r["id_form_atras"]}' value='Atrás'  />";
        }
    }
    if (isset($r["id_form_siguiente"])) {
        if ($r["id_form_siguiente"] != null && $r["id_form_siguiente"] != "" && $r["id_form_siguiente"] != "0") {
            $createNext = true;
            $rta .= "<input type='button' id='sendNwForm' class='btnNwForm nextNwForm_{$idForm}' data-i='{$idForm}' data-next='{$r["id_form_siguiente"]}' value='Siguiente'  />";
        }
    }
    if ($createNext === false) {
        $rta .= "<input type='button' id='sendNwForm'  class='btnNwForm sendNwForm_{$idForm}' data-i='{$idForm}' value='Enviar'  />";
    }
    if ($idForm == "createFormByTable") {
        $rta .= "<input type='button' id='cancelNwFormMaster' value='Cancelar'  />";
    }
    $rta .= "</div>";
    $rta .= "</div>";
    $rta .= "</div>";
    $rta .= "</form>";
    return $rta;
}
