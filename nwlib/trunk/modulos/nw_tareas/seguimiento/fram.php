  <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/tinysort.js"></script>
    <script src="js/jquery.tinysort.js"></script>
    <script src="js/tinysort.charorder.js"></script>
    <script>
    function setParamRecord(fecha_inicial, fecha_final, project, user, asignado) {
        $(".hoja_carga").load("/nwlib/modulos/nw_tareas/seguimiento/index.php", {fecha_inicial: fecha_inicial, fecha_final: fecha_final, project: project, user: user, asignado: asignado});
    }
    </script>
<div class="hoja_carga"></div>