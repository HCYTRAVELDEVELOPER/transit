<?php
 require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
 ?>
<script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/includes/jquery/jquery-1.4.2.min.js" ></script>
<script src="//tinymce.cachefly.net/4.0/tinymce.min.js"></script>
<script>
    tinymce.init({selector: 'textarea'});
</script>
<textarea id="message" class="inpute"></textarea>
<script type="text/javascript">
    $('body').click(function() {
        var thought = $("#message").val();
            alert(thought);
    });

    function pasa_datos(p) {
        alert(p);
        return;
        parent.parent.envia_datos_editor(p);
    }
</script>
