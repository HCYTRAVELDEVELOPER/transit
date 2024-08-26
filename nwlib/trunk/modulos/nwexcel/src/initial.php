    <?php

    function loadInitial() {
        $rta = "";
        $maxRows = 100;
        $maxCols = 20;
        if (isset($_GET["maxRows"]))
            $maxRows = $_GET["maxRows"];
        if (isset($_GET["maxCols"]))
            $maxCols = $_GET["maxCols"];
        for ($i = 0; $i < $maxRows; $i++) {
            $rta .= "<tr>";
            for ($a = 0; $a < $maxCols; $a++) {
                $rta .= "<td></td>";
            }
            $rta .= "</tr>";
        }
        return $rta;
    }
    print loadInitial();
    ?>