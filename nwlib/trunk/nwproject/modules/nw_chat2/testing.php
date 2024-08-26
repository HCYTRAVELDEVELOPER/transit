<?php
include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";



$tags = get_meta_tags('http://www.geobytes.com/IpLocator.htm?GetLocation&template=php3.txt&IpAddress=190.146.116.165');


//print_r($tags);
?>

<!--BEGIN: GeoIPView.com IP Locator 
<script type="text/javascript" src="http://api.geoipview.com/api.php?t=1&amp;lang=es&amp;w=230&amp;h=300&amp;bg=ECDDC0&amp;bd=8DADCC&amp;tx=222222"></script>                        
END: GeoIPView.com IP Locator -->

<iframe src="http://es.geoipview.com/?q=186.155.201.156" style="position: relative;width: 100%;height: 1000px;"></iframe>

<!-- Start of localhost nwchat Widget script -->
<script>
    /*<![CDATA[*/
    document.addEventListener('DOMContentLoaded', function () {
        var div = document.createElement('div');
        div.id = 'buttonOpenNwChat';
        div.style.position = 'fixed';
        div.style.right = '0px';
        div.style.bottom = '0px';
        div.style.zIndex = '1000000000';
        div.style.cursor = 'pointer';
        div.innerHTML = '<img class="imgNwChatOrigin" src="http://localhost//nwlib6/modulos/nw_soporte_chat/img/online.png" />';
        document.body.appendChild(div);
        __selfNwChat = false;
        loadJ();
        div.onclick = function () {
            __selfNwChat = true;
            loadJ();
        };
        function loadJ() {
            var js = document.createElement('script');
            js.type = 'text/javascript';
            js.charset = 'UTF-8';
            js.src = 'http://localhost/nwlib6/nwproject/modules/nw_chat2/js/nwchat.js?host=localhost&key=59307&id=4&llamadavoz=true';
            js.id = 'nwchat2';
            js.async = true;
            document.body.appendChild(js);
        }

    });
    /*]]>*/
</script>
<!-- End of localhost nwchat Widget script -->