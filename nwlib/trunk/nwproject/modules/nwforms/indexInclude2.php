<?php
if (isset($paramObject)) {
    if ($paramObject != 0 || $paramObject != "") {
        $parametrosObjeto = explode("&", $paramObject);
        if (isset($parametrosObjeto[0])) {
            $paramOne = explode("=", $parametrosObjeto[0]);
            $_GET["form"] = $paramOne[1];
        }
        if (isset($parametrosObjeto[1])) {
            $paramOne = explode("=", $parametrosObjeto[1]);
            $nwtablemaker = $paramOne[1];
        }
    }
}

print nwprojectOut::getNwMakerLib();
?>
<script>
    $(document).ready(function () {
        loadJs("/nwlib6/nwproject/modules/nwforms/js/main2.js", function () {
            var d = new nwFormsMaker(<?php echo $_GET["form"]; ?>, ".text_module_nwforms");
            d.constructor();
        }, false, true);
    });
</script>