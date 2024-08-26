<style>
    .chatnwsubframe{
        position: fixed;
        bottom: 0px;
        right: 0px;
    }
</style>
<script>
    $(document).ready(function() {
        var pagewidth = $("#page").width();
        if (pagewidth >= 700) {
            $(".nwchatlive").append("<iframe class='chatnwsubframe' src='http://nwadmin.gruponw.com/nwchatembed&netwoods.net&frtdv2154rdvgtf6yr54redTYrewew&2' scrolling='no' frameborder='0' width='255px' height='98px' ></iframe>");
        }
    });
</script>
<div class="nwchatlive"></div>