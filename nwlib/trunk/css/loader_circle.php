<style>
    @keyframes cssload-loader {
        from {
            -webkit-transform: scale(0);
            transform: scale(0);
            opacity: 1;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        }
        to {
            -webkit-transform: scale(1);
            transform: scale(1);
            opacity: 0;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        }
    }

    @-webkit-keyframes cssload-loader {
        from {
            -webkit-transform: scale(0);
            opacity: 1;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        }
        to {
            -webkit-transform: scale(1);
            opacity: 0;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        }
    }
    .cssload-loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin: 3em;
        display: inline-block;
        position: absolute;
        vertical-align: middle;
        background: #CB0101;
        z-index: 9;
        top: 50%;
        margin-top: -24px;
        left: 50%;
        margin-left: -24px;
    }
    .cssload-loader, .cssload-loader:before, .cssload-loader:after {
        animation: 1.15s infinite ease-in-out;
        -o-animation: 1.15s infinite ease-in-out;
        -ms-animation: 1.15s infinite ease-in-out;
        -webkit-animation: 1.15s infinite ease-in-out;
        -moz-animation: 1.15s infinite ease-in-out;
    }
    .cssload-loader {
        animation-name: cssload-loader;
        -o-animation-name: cssload-loader;
        -ms-animation-name: cssload-loader;
        -webkit-animation-name: cssload-loader;
        -moz-animation-name: cssload-loader;
    }
</style>
<div class='cssload-loader'></div>