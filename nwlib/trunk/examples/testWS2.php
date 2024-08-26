<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$client = new SoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));
//IMPRIME DATA DIRECTOR DE WS
//$res = $client->Lista_Items();
//print_r($res);
//return;
//$res = objToArrayDos($res);
//$xml_res = $res['Lista_ItemsResult']['any'];
//print_r($xml_res);
//return;
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

$res = $client->Lista_Items();
$b_res = objToArray($res);
$xml_res = simplexml_load_string($b_res['Lista_ItemsResult']['any']);
$b_xml = XML2Array($xml_res);
$b_xml = array($xml_res->getName() => $b_xml);
$b_xml = $b_xml['diffgram']['ReturnDS']['Table'];
echo "<h1>Total registros service: Lista_Items: " . count($b_xml) . "</h1>";
//print_r($b_xml);
//return;
//print_r($b_xml["Referencia"]);
//return;

if (count($b_xml) > 0) {
//    $table = "nc_filtros_productos";
//    $db = NWDatabase::database();
//    $ca = new NWDbQuery($db);
//    $b_xml["0"] = [];
//    $b_xml["1"] = [];
//    $b_xml["2"] = array();
//    $b_xml["2"]["Referencia"] = $b_xml["Referencia"];
//    $b_xml["2"]["Filtro_ID"] = $b_xml["Filtro_ID"];
//    $b_xml["2"]["Filtro_Cat_ID"] = $b_xml["Filtro_Cat_ID"];
//    $i = 0;


    $cats = array();
    $subcats = array();
    
    for ($i = 0; $i < count($b_xml); $i++) {
//    foreach ($b_xml as $ra) {
//        if ($i > 2) {
        if (isset($b_xml[$i])) {
            $ra = $b_xml[$i];
            
            //categorias nivel 1
            $cats[$ra["Filtro_ID"]] = array();
            $cats[$ra["Filtro_ID"]]["id"] = $ra["Filtro_ID"];
            $cats[$ra["Filtro_ID"]]["nombre"] = $ra["Tipo"];
            
            //categorias nivel 2
            $subcats[$ra["Filtro_Cat_ID"]] = array();
            $subcats[$ra["Filtro_Cat_ID"]]["id"] = $ra["Filtro_Cat_ID"];
            $subcats[$ra["Filtro_Cat_ID"]]["nombre"] = $ra["Descripcion"];
            $subcats[$ra["Filtro_Cat_ID"]]["id_filtro"] = $ra["Filtro_ID"];
            
            echo "arreglo[{$i}]:  <p>Referencia: " . $ra["Referencia"] . ". Tipo: {$ra["Tipo"]} Filtro_ID: " . $ra["Filtro_ID"] . ". Descripcion: {$ra["Descripcion"]} Filtro_Cat_ID: " . $ra["Filtro_Cat_ID"] . "</p>";
//        }
//        $ca->prepareInsert($table, "referencia_producto, filtro_id, filtro_cat_id");
//        $ca->bindValue(":referencia_producto", $ra["Referencia"]);
//        $ca->bindValue(":filtro_id", $ra["Filtro_ID"]);
//        $ca->bindValue(":filtro_cat_id", $ra["Filtro_Cat_ID"]);
//        if (!$ca->exec()) {
//            return "Error " . $ca->lastErrorText();
//        }
//        $i++;
        }
    }

    //categorías
    echo "<h1>Categorias nivel 1</h1>";
    foreach ($cats as $c) {
        print_r($c);
    }

    //categorías
    echo "<h1>Sub Categorias</h1>";
    foreach ($subcats as $cn) {
        print_r($cn);
    }
//    print_r($filtros);
//    $result = array_unique($b_xml[0]);
//    $result = array_unique($filtros);
//    print_r($result);
}
return;
print_r(count($b_xml));
print_r($b_xml);
break;
?>
