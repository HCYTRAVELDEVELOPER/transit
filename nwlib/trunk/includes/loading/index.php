<style>
    #loadingNw {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000000000000000;
        background: #fff;
        width: 100%;
        height: 100%;
        /*background: rgba(255, 255, 255, 0.84);*/
    }
    .playground1 {
        width: 100%;
        height: 100%;
        min-height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        background-color: #f1f1f1;
        color: #818181;
        font-weight: bold;
        text-shadow: 1px 1px 2px #CACACA;
    }
    .h1_carga {
        position: relative;
        top: 30%;
        text-align: center;
        width: 30%;
        height: auto;
        margin: auto;
        overflow: hidden;
        display: block;
        padding: 35px 5px;
        font-size: 16px;
        font-weight: lighter;
    }
    .enlace_powered {
        color: #818181;
        text-shadow: none;
        text-decoration: none;
        text-align: center;
        font-size: 12px;
    }
    .la-anim-10 {
        position: relative;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        margin: auto;
        pointer-events: none;
        margin-top: 40px;
    }
    .la-anim-10::before, .la-anim-10::after {
        position: absolute;
        bottom: 30px;
        left: 50%;
        display: block;
        border: 5px solid #fff;
        border-radius: 50%;
        content: '';
    }
    .la-anim-10::before, .la-anim-10::after {
        position: absolute;
        bottom: 30px;
        left: 50%;
        display: block;
        border: 5px solid #fff;
        border-radius: 50%;
        content: '';
        box-shadow: 0px 0px 15px #000;
    }
    .la-anim-10::before {
        margin-left: -40px;
        width: 80px;
        height: 80px;
        border-top-color: firebrick;
        border-bottom-color: rgb(137, 137, 137);
        -webkit-animation: rotation 3s linear infinite;
        animation: rotation 3s linear infinite;
        content: 'N';
            line-height: 82px;
        font-size: 3em;
        color: firebrick;
        font-weight: bold;
    }
    .la-anim-10::after {
        bottom: 20px;
        margin-left: 10px;
        width: 40px;
        height: 40px;
        border-top-color: rgb(153, 32, 32);
        border-bottom-color: rgb(197, 197, 197);
        -webkit-animation: rotation_circle 1s linear infinite;
        animation: rotation_circle 1s linear infinite;
        background: #5C5C5C;
        content: 'W';
            line-height: 42px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
    }
    .version_div{
        position: relative;
        margin-top: -20px;
        top: -10px;
        left: 75px;
        font-size: 12px;
    }
    @-webkit-keyframes rotation {
        0% 		{ -webkit-transform: rotate(0deg); }
    50% 	{ -webkit-transform: rotate(180deg); }
    100% 	{ -webkit-transform: rotate(360deg); }
    }

    @keyframes rotation {
        0% 		{ transform: rotate(0deg); }
    50% 	{ transform: rotate(180deg); }
    100% 	{ transform: rotate(360deg); }
    }
    @-webkit-keyframes rotation_circle {
        0% 		{ -webkit-transform: rotate(0deg); }
    50% 	{ -webkit-transform: rotate(180deg); }
    100% 	{ -webkit-transform: rotate(360deg); }
    }

    @keyframes rotation_circle {
        0% 		{ transform: rotate(0deg); }
    50% 	{ transform: rotate(180deg); }
    100% 	{ transform: rotate(360deg); }
    }
</style>
<div id='loadingNw' class="loadingNw" >
    <h1 class='h1_carga'>
        <div class='la-anim-10 la-animate'></div>
        <a class='enlace_powered' href='http://www.netwoods.net' target='_blank'>
            Powered By <span class='a_credit_net' >Net</span><span>woods</span>.net
        </a>
    </h1>
</div>