<h1>
    Citas del Mes
</h1>
<ul>
    <?php

    function getMonthDays($Month, $Year) {
        //Si la extensión que mencioné está instalada, usamos esa.
        if (is_callable("cal_days_in_month")) {
            return cal_days_in_month(CAL_GREGORIAN, $Month, $Year);
        } else {
            //Lo hacemos a mi manera.
            return date("d", mktime(0, 0, 0, $Month + 1, 0, $Year));
        }
    }

    function loadMeetingsMonth($date, $d) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwreu_enc a left join nwreu_asistentes b on(a.id=b.reunion) ", "a.*", "b.asistente_mail=:usuario and a.fecha=:fecha order by hora asc");
        $ca->bindValue(":usuario", $si["email"]);
        $ca->bindValue(":fecha", $date);
        if (!$ca->exec()) {
            echo "Error: " . $ca->lastErrorText();
            return;
        }
        $total = $ca->size();
        if ($total == 0) {
            if ($date > date("Y-m-d")) {
                echo "<style>.dia_$d {opacity: 0.8!important; } </style>";
            } else {
                echo "<style>.dia_$d {opacity: 0.5; } </style>";
            }
            return;
        }
        $te = "";
        if($total == 1) {
        $te = " cita";    
        } else {
        $te = " citas";    
        }
        $t = "";
        echo  " " . $total . $te;
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $css = "";
            if ($r["estado"] != 2 && $r["fecha"] < date("Y-m-d")) {
                $css = " style=' color: #FF6B6B;  ' ";
            } else
            if ($r["estado"] == 2) {
                $css = " style=' color: #00ABAB; ' ";
            }
            $t .= " <p class='list_date_reu' data='" . $r["id"] . "' $css >" . $r["hora"] . ": " . $r["titulo"] . "</p>";
//            $t .= " <div class='info_meet_int'>" . $r["titulo"] . "</div>";
        }
        echo  "<div class='info_meet'>" . $t . "</div>";
    }

//Obtenemos la cantidad de días que tiene septiembre del 2008
    $total_dias = getMonthDays(date("m"), date("Y"));
    for ($i = 1; $i < $total_dias + 1; $i++) {
        $iex = strlen($i);
        $num = $i;
        if ($iex == 1) {
            $num = "0" . $i;
        }
        $date = date("Y-m") . "-" . $num;
        ?>
        <li class="dias_right dia_<?php echo $i; ?>">
            <?php
            echo $date;
            loadMeetingsMonth($date, $i);
            ?>
        </li>
        <?php
    }
    ?>
</ul>