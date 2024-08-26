<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$client = new SoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));

//function objToArray($obj = false) {
//    if (is_object($obj))
//        $obj = get_object_vars($obj);
//    if (is_array($obj)) {
//        return array_map(__FUNCTION__, $obj);
//    } else {
//        return $obj;
//    }
//}
//
//function XML2Array(SimpleXMLElement $parent) {
//    $array = array();
//    foreach ($parent as $name => $element) {
//        ($node = & $array[$name]) && (1 === count($node) ? $node = array($node) : 1) && $node = & $node[];
//        $node = $element->count() ? XML2Array($element) : trim($element);
//    }
//    return $array;
//}

$res = $client->Lista_Inventario();
$b_res = objToArray($res);
$xml_res = simplexml_load_string($b_res['Lista_InventarioResult']['any']);
$b_xml = XML2Array($xml_res);
$b_xml = array($xml_res->getName() => $b_xml);
$b_xml = $b_xml['diffgram']['ReturnDS']['Table'];
echo "<h1>Total registros service Lista_Inventario: " . count($b_xml) . "</h1>";
//print_r($b_xml);
//return;
if (count($b_xml) > 0) {
//    $table = "nc_filtros_productos";
//    $db = NWDatabase::database();
//    $ca = new NWDbQuery($db);
    $i = 0;
    foreach ($b_xml as $ra) {
        print_r($ra);
        print_r("<br />");
//        if ($i > 3) {
//            echo "<p>" . $ra["Ref_ITEM"] . " " . $ra["Descripcion_ID"] . " " . $ra["Desc_tecnica"] . "</p>";
//        }
//        $ca->prepareInsert($table, "referencia_producto, filtro_id, filtro_cat_id");
//        $ca->bindValue(":referencia_producto", $ra["Referencia"]);
//        $ca->bindValue(":filtro_id", $ra["Filtro_ID"]);
//        $ca->bindValue(":filtro_cat_id", $ra["Filtro_Cat_ID"]);
//        if (!$ca->exec()) {
//            return "Error " . $ca->lastErrorText();
//        }
        $i++;
    }
}
return;
print_r(count($b_xml));
print_r($b_xml);
break;
?>
