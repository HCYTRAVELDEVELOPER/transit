<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>-->
<?php
 require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
 ?>
<script src="jquery.min.js"></script>
<link rel="stylesheet" href="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/includes/editor/font-awesome.css" />
<style>
    #editControls {
        text-align: left;
        padding: 10px;
        margin: 0px;
        background: #ECECEC;
    }

    #editor {
        resize: vertical;
        overflow: auto;
        border: 1px solid rgb(230, 230, 230);
        border-radius: 5px;
        min-height: 100px;
        box-shadow: inset 0 0 8px rgb(228, 228, 228);
        padding: 1em;
        background: #fff;
    }

    a:link {text-decoration:none;}
    a:visited {text-decoration:none;}
    a:hover {text-decoration:none;}
    a:active {text-decoration:none;}
    a{
        color:black;
        padding:5px;
        border:1px solid silver;
        border-radius:5px;
        width:1em;
        background: #fff;
    }
</style>
<div>
    <div>
        <div id='editControls'>
            <div>
                <a data-role='undo' href='javascript:void(0)'><i class='fa fa-undo'></i></a>
                <a data-role='redo' href='javascript:void(0)'><i class='fa fa-repeat'></i></a>
                <a data-role='bold' href='javascript:void(0)'><i class='fa fa-bold'></i></a>
                <a data-role='italic' href='javascript:void(0)'><i class='fa fa-italic'></i></a>
                <a data-role='underline' href='javascript:void(0)'><i class='fa fa-underline'></i></a>
                <a data-role='strikeThrough' href='javascript:void(0)'><i class='fa fa-strikethrough'></i></a>
                <a data-role='justifyLeft' href='javascript:void(0)'><i class='fa fa-align-left'></i></a>
                <a data-role='justifyCenter' href='javascript:void(0)'><i class='fa fa-align-center'></i></a>
                <a data-role='justifyRight' href='javascript:void(0)'><i class='fa fa-align-right'></i></a>
                <a data-role='justifyFull' href='javascript:void(0)'><i class='fa fa-align-justify'></i></a>
                <a data-role='indent' href='javascript:void(0)'><i class='fa fa-indent'></i></a>
                <a data-role='outdent' href='javascript:void(0)'><i class='fa fa-outdent'></i></a>
                <a data-role='insertUnorderedList' href='javascript:void(0)'><i class='fa fa-list-ul'></i></a>
                <a data-role='insertOrderedList' href='javascript:void(0)'><i class='fa fa-list-ol'></i></a>
                <a data-role='h1' href='javascript:void(0)'>h<sup>1</sup></a>
                <a data-role='h2' href='javascript:void(0)'>h<sup>2</sup></a>
                <a data-role='p' href='javascript:void(0)'>p</a>
                <a data-role='subscript' href='javascript:void(0)'><i class='fa fa-subscript'></i></a>
                <a data-role='superscript' href='javascript:void(0)'><i class='fa fa-superscript'></i></a>
            </div>
        </div>
        <div id='editor' contenteditable>
        </div>
    </div>
</div>
<script>
    $('#editControls a').click(function(e) {
        switch ($(this).data('role')) {
            case 'h1':
            case 'h2':
            case 'p':
                document.execCommand('formatBlock', false, $(this).data('role'));
                break;
            default:
                document.execCommand($(this).data('role'), false, null);
                break;
        }
    })
</script>
<script type="text/javascript">
    $('body').keyup(function() {
        var thought = $("#editor").html();
        pasa_datos(thought);
    });
    $('body').focusout(function() {
        var thought = $("#editor").html();
        pasa_datos(thought);
    });
    $('body').keydown(function() {
        var thought = $("#editor").html();
        pasa_datos(thought);
    });
    $('body').keypress(function() {
        var thought = $("#editor").html();
        pasa_datos(thought);
    });
    $('body').click(function() {
        var thought = $("#editor").html();
        pasa_datos(thought);
    });

    function pasa_datos(p) {
        parent.envia_datos_editor(p);
    }
</script>