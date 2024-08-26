<style>
    body{
        position: relative;
        margin: 0;
        padding: 0;
    }
    ul {
        position: relative;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    li {
        float: left;
        margin: 5px;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
</style>
<div>
    <ul>
        <li>
            <a href="?login=login" >Login</a>
        </li>
        <li>
            <a href="?crear=crear" >Crear Correo</a>  
        </li>
        <li>
            <a href="?actualizar=actualizar" >Actualizar</a>
        </li>
        <li>
            <a href="?buscar=buscar" >Buscar</a>
        </li>
        <li>
            <a href="?libreta=libreta" >Libreta</a>
        </li>
    </ul>
    <?php
    if (isset($_GET["actualizar"])) {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/right_main.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    } else
    if (isset($_GET["login"])) {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/login.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    } else
    if (isset($_GET["crear"])) {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/compose.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    } else
    if (isset($_GET["buscar"])) {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/search.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    } else
    if (isset($_GET["libreta"])) {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/addressbook.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    } else {
        ?>
        <iframe src="http://www.gruponw.com/webmail/src/right_main.php" name="SubHtml" width="100%" height="570px" scrolling="auto" frameborder="0">
        &lt;p&gt;Texto alternativo para navegadores que no aceptan iframes.&lt;/p&gt;
        </iframe>
        <?php
    }
    ?>
</div>