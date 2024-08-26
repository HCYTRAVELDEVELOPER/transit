<?php
echo "<div class='qxnw_logo_cod'>
		<p>
			<a href='/'>Nw <span style='font-size: 12px;'>Learning</span>
                        </a>
                        </p>
	</div>";
echo " <div class='search'>";
include "buscar.php";
echo "</div>";
?>
<div class="menu_right">
    <?php
    if (isset($_SESSION["autenticado"]) == 'SI') {
        require "session_info.php";
    } else {
//        echo "<a id='log' class='button_orange' href='$url_cuenta'>Log in</a>";
        echo "<div id='log' class='button_orange'>Iniciar Sesión</div>";
    }
    ?>   
    menú
</div>
<script type="text/javascript">
    $(function() {
        $("#log").click(function() {
            log_in();
        });
    });
</script>
