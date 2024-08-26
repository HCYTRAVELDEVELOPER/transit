<script>
    document.addEventListener("DOMContentLoaded", function () {
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.charset = 'UTF-8';
        js.src = 'http://nwtuto.loc/nwlib6/nwproject/modules/nw_tuto/tuto.js';
//        js.src = 'http://localhost:8000/nwlib6/nwproject/modules/nw_tuto/tuto.js';
//        js.src = 'http://nwtuto.loc/nwlib6/nwproject/modules/nw_tuto/tuto.js';
        js.id = 'nwTutoMaker';
        js.async = true;
        document.body.appendChild(js);
        js.onload = function () {
            var nwt = new nwTuto();
            nwt.loadTuto();
            nwt.start(7);
        };

        var html = "<div class='contain' id='contain1'>\n\
    <div class='holacncl'>\n\
        hola\n\
    </div>\n\
    <div class='holacncl holacnclgen'>\n\
        <div class='holacncl-in holacnclgen'>\n\
            <div class='holacncl-in-oc holacnclgen'>\n\
                nuevo con clse\n\
            </div>\n\
        </div>\n\
    </div>\n\
    <div class='holacncl'>\n\
        editar con clse\n\
    </div>\n\
    <div class='holacncl'>\n\
        eliminar con clse\n\
    </div>\n\
    <div class='holacncl showAyuda'>\n\
        Mostrar ayuda\n\
    </div>\n\
";
        var n = 0;
        document.querySelector(".crear-btn").addEventListener("click", function () {
            var d = document.createElement("div");
            d.innerHTML = "<h1>List " + n + "</h1> " + html;
            document.querySelector(".crear").appendChild(d);
            n++;

            d.querySelector(".showAyuda").addEventListener("click", function () {
                var nwt = new nwTuto();
                nwt.start(7, d, true);
//                nwt.start(3, d, true);
            });

            var nwt = new nwTuto();
            nwt.start(7, d);
//            nwt.start(3, d);

        });

        var s = document.querySelector(".playtv");
        if (s) {
            s.addEventListener("click", function () {
                var nwt = new nwTuto();
                nwt.start(8, false, true);
            });
        }

    });
</script>

<style>
    .playtv{

    }
    body {
        margin: 0px;
        padding: 0px;
    }
    #Inner {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .boxed  div {
        max-width: 200px;
        float: left;
    }
    .contain{
        position: relative;
        overflow: hidden;
        border: 1px solid;
    }
    .holacncl{
        position: relative;
        float: left;
        margin: 10px;
        border: 1px solid;
    }
    .crear{
        position: relative;
        margin-top: 100px
    }
    .crear-btn{
        position: relative;
        width: 100px;
    }
    .bloque1{
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 1000px;
    }



    @-webkit-keyframes pulse-shadow{
        0%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a;
        }
        70%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0);
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0);
        }
    }
    @keyframes pulse-shadow{
        0%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a;
        }
        70%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0);
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0);
        }
    }
    @-webkit-keyframes pulse-shadow--collection{
        0%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0}
        70%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @keyframes pulse-shadow--collection{
        0%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0
        }
        70%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @-webkit-keyframes pulse-shadow--onboarding{
        0%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a
        }
        30%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a
        }
        80%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @keyframes pulse-shadow--onboarding{
        0%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a
        }
        30%{
            -webkit-box-shadow:0 0 0 0 #34e79a;
            box-shadow:0 0 0 0 #34e79a
        }
        80%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @-webkit-keyframes pulse-shadow--onboarding-collection{
        0%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0
        }
        30%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0
        }
        80%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @keyframes pulse-shadow--onboarding-collection{
        0%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0
        }
        30%{
            -webkit-box-shadow:0 0;
            box-shadow:0 0
        }
        80%{
            -webkit-box-shadow:0 0 5px 10px rgba(255,255,255,0);
            box-shadow:0 0 5px 10px rgba(255,255,255,0)
        }
        100%{
            -webkit-box-shadow:0 0 0 0 rgba(255,255,255,0);
            box-shadow:0 0 0 0 rgba(255,255,255,0)
        }
    }
    @-webkit-keyframes pulse-grow{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        15%{
            -webkit-transform:scale(1.1);
            transform:scale(1.1)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @keyframes pulse-grow{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        15%{
            -webkit-transform:scale(1.1);
            transform:scale(1.1)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @-webkit-keyframes pulse-grow-50-110{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        50%{
            -webkit-transform:scale(1.1);
            transform:scale(1.1)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @keyframes pulse-grow-50-110{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        50%{
            -webkit-transform:scale(1.1);
            transform:scale(1.1)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @-webkit-keyframes pulse-grow-50-105{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        50%{
            -webkit-transform:scale(1.05);
            transform:scale(1.05)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @keyframes pulse-grow-50-105{
        0%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
        50%{
            -webkit-transform:scale(1.05);
            transform:scale(1.05)
        }
        100%{
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }


    .pulseaquiu{
        -webkit-animation: pulse-shadow--collection 2s infinite;
        animation: pulse-shadow--collection 2s infinite;
        position: absolute;
        top: 50px;
        left: 0px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 1px solid #3977BB;
        cursor: pointer;
        z-index: 10000000000;
        overflow: hidden;
        text-align: center;
        font-size: 12px;
        font-family: arial;
        padding: 20px 0px;
        box-sizing: border-box;
    }
    .iguales{
        
    }
</style>



<div class="pulseaquiu playtv">Visita guiada</div>

<div class="bloque1">

    <h1>
        Pantalla 1 listado dinámico
    </h1>
    <div class="crear">
        <div class="crear-btn">
            Nuevo
        </div>
    </div>
    <div>
        iguales sin clase uno
    </div>
    <div>
        iguales sin clase uno
    </div>
    <div>
        iguales sin clase uno
    </div>
    <div>
        iguales sin clase tercero
    </div>
    <div>
        iguales sin clase segundo
    </div>
    <div id="igualvariasclcases" class="hola quemas nosesisisi nonono" data="fdsafsda" style="display: block;">
        iguales varias clases
    </div>
    <div id="igualvariasclcases" class="hola quemas nosesisisi nonono" data="fdsafsda" style="display: block;">
        iguales varias clases
    </div>
    <div class="iguales">
        iguales
    </div>
    <div class="iguales">
        iguales
    </div>
    <div class="iguales">
        iguales
    </div>
    <div class="iguales">
        iguales
    </div>

    <div style="position: absolute; right: 500px; top: 500px; background: red; width: 100px; height: 100px;" class="nose" id="sip">uno</div>
    <div style="position: absolute; right: 500px; top: 610px; background: green; width: 100px; height: 100px;" class="nose" id="sip">dos</div>
    <div style="position: absolute; right: 500px; top: 740px; background: yellow; width: 100px; height: 100px;" class="nose" id="sip">tres</div>

    <div style="position: absolute; right: 0px; top: 0px; width: 200px; height: 100%; background: blue; z-index: 100000000;" class="nnnnaaa">
        <a href="/">
            Absoluto 1.1 right con mucho texto fjlkdsa jkfdsakl kfl jsdakljfklj dsalk jfkljsd aklj fklsjd akl jfklds
        </a>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div style="position: absolute; top: 250px; right: 500px;width: 800px; height: 100px; background: orange;" class="nnnnaaa fdsafdsa" >
        <a href="/">
            Orange Absoluto 1.1 right con mucho texto fjlkdsa jkfdsakl kfl jsdakljfklj dsalk jfkljsd aklj fklsjd akl jfklds
        </a>
    </div>

    <div style="position: absolute; right: 0px; top: 400px;">
        Absoluto righti1
    </div>

    <div style="position: absolute; right: 0px; top: 0px">
        Absoluto 2
    </div>
    <div style="position: absolute; right: 500px; top: 100px">
        Absoluto 3
    </div>
    <div style="position: absolute; right: 800px; top: 0px">
        Absoluto 4
    </div>
    <div style="position: absolute; right: 800px; top: 500px">
        Absoluto 5
    </div>
    <div style="position: absolute; right: 800px; top: 1500px">
        Absoluto 6 otra pantalla
    </div>
    <div style="position: absolute; right: 70px; top: 630px">
        Absoluto 7 arráz bottom
    </div>
    <div style="position: absolute; left: 70px; top: 630px; width: 30px;">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; left: 0px; top: 630px; width: 30px;">
        Absoluto 8.1 arráz bottom
    </div>
    <div style="position: absolute; right: 0px; top: 30px; width: 200px; height: 100%; background: red;">
        Absoluto 9 
    </div>
    <div style="position: absolute; right: 100px; top: 130px">
        Absoluto 9 
    </div>
    <div style="position: absolute; right: 700px; top: 230px">
        Absoluto 10 
    </div>
    <div style="position: absolute; right: 710px; top: 230px">
        Absoluto 10 
    </div>
    <div style="position: absolute; right: 750px; top: 230px">
        Absoluto 10 
    </div>
</div>
<div class="bloque1">
    <h1>
        Pantalla 2
    </h1>
    <div style="position: absolute; right: 0px;">
        Absoluto righti1
    </div>
    <div style="position: absolute; right: 0px; top: 0px">
        Absoluto 2
    </div>
    <div style="position: absolute; right: 500px; top: 100px">
        Absoluto 3
    </div>
    <div style="position: absolute; right: 800px; top: 0px">
        Absoluto 4
    </div>
    <div style="position: absolute; right: 800px; top: 500px">
        Absoluto 5
    </div>
    <div style="position: absolute; right: 800px; top: 1500px">
        Absoluto 6 otra pantalla
    </div>
    <div style="position: absolute; right: 70px; top: 630px">
        Absoluto 7 arráz bottom
    </div>
    <div style="position: absolute; left: 70px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; left: 0px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; right: 100px; top: 130px">
        Absoluto 9 
    </div>
    <div style="position: absolute; right: 750px; top: 230px">
        Absoluto 10 
    </div>
    <div>
        Relativo
    </div>
    <div style="float: left;">
        Flotante
    </div>
    <div style="float: left;">
        Flotante
    </div>
    <div style="float: left;">
        Flotante
    </div>
    <div style="width: 100%; float: left;">
        <br />
        <br />
        <br />
        Mucho texto           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquet ultrices tincidunt. Integer cursus dignissim ante ac ultrices. Nullam pulvinar, ligula eget lacinia viverra, nibh sem rutrum risus, et condimentum sem nibh in turpis. Phasellus convallis sodales lacus, in imperdiet massa semper aliquet. Cras sit amet imperdiet velit. Nam lectus libero, tempus in urna ut, suscipit auctor ante. Nam rhoncus vestibulum justo ut feugiat. Vivamus vitae orci nisl. Nulla eu tempus ligula. Ut sit amet enim hendrerit, egestas lorem euismod, volutpat neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras interdum lectus consequat, fermentum lectus sed, posuere est. Ut massa lectus, consequat a elementum eu, tincidunt ut nisl. Donec malesuada turpis ac nisl ultricies rutrum. Vivamus lacinia pretium sodales.
        <br />
        <br />
        <br />
    </div>
    <div style="width: 100%; float: left;">
        <br />
        <br />
        <br />
        Mucho texto           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquet ultrices tincidunt. Integer cursus dignissim ante ac ultrices. Nullam pulvinar, ligula eget lacinia viverra, nibh sem rutrum risus, et condimentum sem nibh in turpis. Phasellus convallis sodales lacus, in imperdiet massa semper aliquet. Cras sit amet imperdiet velit. Nam lectus libero, tempus in urna ut, suscipit auctor ante. Nam rhoncus vestibulum justo ut feugiat. Vivamus vitae orci nisl. Nulla eu tempus ligula. Ut sit amet enim hendrerit, egestas lorem euismod, volutpat neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras interdum lectus consequat, fermentum lectus sed, posuere est. Ut massa lectus, consequat a elementum eu, tincidunt ut nisl. Donec malesuada turpis ac nisl ultricies rutrum. Vivamus lacinia pretium sodales.
        <br />
        <br />
        <br />
    </div>
    <div style="width: 100%; float: left;">
        <br />
        <br />
        <br />
        Mucho texto           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquet ultrices tincidunt. Integer cursus dignissim ante ac ultrices. Nullam pulvinar, ligula eget lacinia viverra, nibh sem rutrum risus, et condimentum sem nibh in turpis. Phasellus convallis sodales lacus, in imperdiet massa semper aliquet. Cras sit amet imperdiet velit. Nam lectus libero, tempus in urna ut, suscipit auctor ante. Nam rhoncus vestibulum justo ut feugiat. Vivamus vitae orci nisl. Nulla eu tempus ligula. Ut sit amet enim hendrerit, egestas lorem euismod, volutpat neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras interdum lectus consequat, fermentum lectus sed, posuere est. Ut massa lectus, consequat a elementum eu, tincidunt ut nisl. Donec malesuada turpis ac nisl ultricies rutrum. Vivamus lacinia pretium sodales.
        <br />
        <br />
        <br />
    </div>
</div>
<div class="bloque1">
    <h1>
        Pantalla 3
    </h1>
    <div style="position: absolute; right: 0px;">
        Absoluto righti1
    </div>
    <div style="position: absolute; right: 0px; top: 0px">
        Absoluto 2
    </div>
    <div style="position: absolute; right: 500px; top: 100px">
        Absoluto 3
    </div>
    <div style="position: absolute; right: 800px; top: 0px">
        Absoluto 4
    </div>
    <div style="position: absolute; right: 800px; top: 500px">
        Absoluto 5
    </div>
    <div style="position: absolute; right: 800px; top: 1500px">
        Absoluto 6 otra pantalla
    </div>
    <div style="position: absolute; right: 70px; top: 630px">
        Absoluto 7 arráz bottom
    </div>
    <div style="position: absolute; left: 70px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; left: 0px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; right: 100px; top: 130px">
        Absoluto 9 
    </div>
    <div style="position: absolute; right: 750px; top: 230px">
        Absoluto 10 
    </div>
</div>
<div class="bloque1">
    <h1>
        Pantalla 4
    </h1>
    <div style="position: absolute; right: 0px;">
        Absoluto righti1
    </div>
    <div style="position: absolute; right: 0px; top: 0px">
        Absoluto 2
    </div>
    <div style="position: absolute; right: 500px; top: 100px">
        Absoluto 3
    </div>
    <div style="position: absolute; right: 800px; top: 0px">
        Absoluto 4
    </div>
    <div style="position: absolute; right: 800px; top: 500px">
        Absoluto 5
    </div>
    <div style="position: absolute; right: 800px; top: 1500px">
        Absoluto 6 otra pantalla
    </div>
    <div style="position: absolute; right: 70px; top: 630px">
        Absoluto 7 arráz bottom
    </div>
    <div style="position: absolute; left: 70px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; left: 0px; top: 630px">
        Absoluto 8 arráz bottom
    </div>
    <div style="position: absolute; right: 100px; top: 130px">
        Absoluto 9 
    </div>
    <div style="position: absolute; right: 750px; top: 230px">
        Absoluto 10 
    </div>
</div>
<div class="bloque1">
    <h1>
        Pantalla 5
    </h1>
</div>






<?php
//include "codeDemo1.php";
?>
