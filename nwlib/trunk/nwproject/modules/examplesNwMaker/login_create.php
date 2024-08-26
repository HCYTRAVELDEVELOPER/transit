<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
print nwprojectOut::getNwMaker(true);
?>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        prepareNwLogin(function (r) {
            console.log(r);
            //login normal
            createNwMakerLogin("NO", ".login_normal");
            //login sin pass
            createNwMakerAutenticUserOnly("NO", ".login_sinpass");
            //crear cuenta
            createAccountNw(".create_account", "NO", false, ".create_account");
        });
    });
</script>


<div class="login_sinpass"></div>
<div class="login_normal"></div>
<div class="create_account"></div>
