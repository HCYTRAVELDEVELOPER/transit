<script src="js/jquery-1.10.2.js"></script>
<script type="text/javascript" src="js/init.js" ></script>
<div id="bod"></div>
<script>
    $(document).ready(function() {
        load(<?php echo $_GET["id"]; ?>);
    });
</script>