<?php

//include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
function loadQXNW() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nw_excel_list", "*", "id=:id");
    $ca->bindValue(":id", $_GET["id_qxnwlist"]);
    if (!$ca->exec()) {
        echo "Error . " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() > 0) {
        $ca->next();
        $r = $ca->assoc();
        $r["html"] = str_replace("th", "td", $r["html"]);
        return $r["html"];
//    $ca->prepareDelete("nw_excel_list", "id=:id");
//    $ca->bindValue(":id", $_GET["id_qxnwlist"]);
//    if (!$ca->exec()) {
//        echo "Error . " . $ca->lastErrorText();
//        return;
//    }
        ?>
        <script>
            $(document).ready(function() {
                complete_td();
            });
        </script>
        <?php

    }
}
print loadQXNW();
?>