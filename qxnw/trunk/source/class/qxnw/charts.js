/* ************************************************************************
 
 Copyright:
 2010 OETIKER+PARTNER AG, Tobi Oetiker, http://www.oetiker.ch
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Tobi Oetiker (oetiker)
 
 ************************************************************************ */

/* ************************************************************************
 
 #asset(nw_charts/*)
 
 ************************************************************************ */

/**
 * A wrapper around jqPlot. The wrapper assumes to find an unpacked copy of
 * the jqPlot distribution in resource/jqPlot. See <a
 * href='http://www.jqplot.com' target='_blank'>jqPlot website</a>
 * for information on how to use jqPlot.
 *
 * <pre class='javascript'>
 * var data = [[['frogs',3], ['buzzards',7], ['deer',2.5], ['turkeys',6], ['moles',5], ['ground hogs',4]]],           
 * var options = function($jqplot){return{                  
 *     title: 'Pie Chart with Legend and sliceMargin',         
 *     seriesDefaults:{renderer:$jqplot.PieRenderer, rendererOptions:{sliceMargin:8}},         
 *     legend:{show:true}         
 *  }};        
 * var plugins = ['pieRenderer'];   
 * var plot = new qxnw.nw_charts(data,options,plugins); 
 * </pre>
 */
qx.Class.define("qxnw.charts", {
    extend: qx.ui.core.Widget,
    /**
     * @param dataSeries {Array} data array to plot
     * @param getOptions {Callback|Map} wither an option map or a function returning the option map after being called with jQuery.jqplot as an argument.
     * @param pluginArr  {Array} array of plugin base names. (use "cursor" not "jqplot.cursor.js")
     *
     */

    construct: function (dataSeries, getOptions, pluginArr) {
        this.base(arguments);

        var self = this;
        
        this.__loadedPlugins = [];

        var min = '.min';
        if (qx.core.Environment.get("qx.debug")) {
            min = '';
        }
        /* I guess it would not be all that difficult to create a stripped
         * down jQuery object with all the bits required by jqPlot and use
         * this instead of full jQuery.
         */
        var codeArr = [
            "jquery.min.js",
            "jquery.jqplot" + min + ".js"
        ];

        if (qx.bom.client.Engine.MSHTML && qx.bom.client.Engine.VERSION < 9.0) {
            codeArr.push("excanvas" + min + ".js");
        }

        pluginArr.push("pointLabels");

        if (pluginArr) {
            for (var i = 0; i < pluginArr.length; i++) {
                if (pluginArr[i] == "funnelRenderer") {
                    codeArr.push('plugins/jqplot.' + pluginArr[i] + '.js');
                } else {
                    codeArr.push('plugins/jqplot.' + pluginArr[i] + min + '.js');
                }
            }
        }
        this.__addCss("jquery.jqplot" + min + ".css");
        this.__loadScriptArr(codeArr, qx.lang.Function.bind(this.__addCanvas, this, dataSeries, getOptions));

        this.addListener("disappear", function () {
            self.removeScripts();
        });
    },
    statics: {
        jqplotToImg: function jqplotToImg(objId) {
            // first we draw an image with all the chart components
            var newCanvas = document.createElement("canvas");
            newCanvas.width = 200;
            newCanvas.height = 200;
            var baseOffset = 10;

            $("#" + objId).children().each(
                    function () {
                        // for the div's with the X and Y axis
                        if ($(this)[0].tagName.toLowerCase() == 'div') {
                            // X axis is built with canvas
                            $(this).children("canvas").each(
                                    function () {
                                        var offset = $(this).offset();
                                        newCanvas.getContext("2d").drawImage(this,
                                                offset.left - baseOffset.left,
                                                offset.top - baseOffset.top);
                                    });
                            // Y axis got div inside, so we get the text and draw it on
                            // the canvas
                            $(this).children("div").each(
                                    function () {
                                        var offset = $(this).offset();
                                        var context = newCanvas.getContext("2d");
                                        context.font = $(this).css('font-style') + " "
                                                + $(this).css('font-size') + " "
                                                + $(this).css('font-family');
                                        context.fillText($(this).html(), offset.left
                                                - baseOffset.left, offset.top
                                                - baseOffset.top + 10);
                                    });
                        }
                        // all other canvas from the chart
                        else if ($(this)[0].tagName.toLowerCase() == 'canvas') {
                            var offset = $(this).offset();
                            newCanvas.getContext("2d").drawImage(this,
                                    offset.left - baseOffset.left,
                                    offset.top - baseOffset.top);
                        }
                    });

            // add the point labels
            $("#" + objId).children(".jqplot-point-label").each(
                    function () {
                        var offset = $(this).offset();
                        var context = newCanvas.getContext("2d");
                        context.font = $(this).css('font-style') + " "
                                + $(this).css('font-size') + " "
                                + $(this).css('font-family');
                        context.fillText($(this).html(), offset.left - baseOffset.left,
                                offset.top - baseOffset.top + 10);
                    });

            // add the rectangles
            $("#" + objId + " *").children(".jqplot-table-legend-swatch").each(
                    function () {
                        var offset = $(this).offset();
                        var context = newCanvas.getContext("2d");
                        context.setFillColor($(this).css('background-color'));
                        context.fillRect(offset.left - baseOffset.left, offset.top
                                - baseOffset.top, 15, 15);
                    });

            // add the legend
            $("#" + objId + " *").children(".jqplot-table-legend td:last-child").each(
                    function () {
                        var offset = $(this).offset();
                        var context = newCanvas.getContext("2d");
                        context.font = $(this).css('font-style') + " "
                                + $(this).css('font-size') + " "
                                + $(this).css('font-family');
                        context.fillText($(this).html(), offset.left - baseOffset.left,
                                offset.top - baseOffset.top + 15);
                    });

            window.open(newCanvas.toDataURL(), "directories=no");
        },
        INSTANCE_COUNTER: 0,
        /**
         * map of loaded scripts
         */
        LOADED: {},
        /**
         * map of objects in the process of loading a particular script
         */
        LOADING: {},
        /**
         * Default Options for graphs. They get merged (non overwriting to the graph object).
         */
        DEFAULT_OPTIONS: {
            // thanks to http://ui.openoffice.org/VisualDesign/OOoChart_colors_drafts.html
//            seriesColors: [
//                '#005796', '#ffbf17', '#46b535', '#e93f80', '#bbe3ff',
//                '#ff811b', '#007333', '#ffe370', '#a6004f', '#a6004f',
//                '#bde734', '#0094d8', '#ffbedd'
//            ],
//            grid: {
//                background: '#ffffff'
//            },
//            seriesDefaults: {
//                lineWidth: 2,
//                markerOptions: {
//                    size: 7
//                }
//            }
        }
    },
    events: {
        /**
         * returns the plot object
         */
        plotCreated: 'qx.event.type.Event',
        /**
         * fires when a script is loaded
         */
        scriptLoaded: 'qx.event.type.Event'
    },
    members: {
        __loadedPlugins: null,
        /**
         * Once the jqPlot object has been created, returns a handle to the plot object
         * use the plotCreated to learn when the plot gets created.
         * 
         * @return {jqPlotObject}
         */
        getPlotObject: function () {
            return this.__plotObject;
        },
        replot: function replot(bool) {
            var plot = this.getPlotObject();
            if (plot != null) {
                plot.replot(bool);
            }
        },
        setTicks: function setTicks(ticks) {
            var plot = this.getPlotObject();
            if (plot != null) {
                plot.axes.xaxis.ticks = ticks;
            }
        },
        setTicksY: function setTicksY(ticks) {
            var plot = this.getPlotObject();
            if (plot != null) {
                plot.axes.yaxis.ticks = ticks;
            }
        },
        setLabel: function setLabel(serie, text) {
            var plot = this.getPlotObject();
            plot.series[serie].label = text;
        },
        setSerieData: function (serie, data) {
            var plot = this.getPlotObject();
            if (plot != null) {
                plot.series[serie].data = data;
            }
        },
        removeScripts: function removeScripts() {
            for (var i = 0; i < this.__loadedPlugins.length; i++) {
                this.__loadedPlugins[i].dispose();
            }
        },
        /**
         * Chain loading scripts.
         */
        __loadScriptArr: function (codeArr, handler) {
            var self = this;
            var script = codeArr.shift();
            try {
                if (script) {
                    if (qxnw.charts.LOADING[script]) {
                        qxnw.charts.LOADING[script].addListenerOnce('scriptLoaded', function () {
                            this.__loadScriptArr(codeArr, handler);
                        }, this);
                    } else if (qxnw.charts.LOADED[script]) {
                        this.__loadScriptArr(codeArr, handler);
                    } else {
                        qxnw.charts.LOADING[script] = this;
                        var sl = new qx.bom.request.Script();
                        var src = qx.util.ResourceManager.getInstance().toUri("nw_charts/" + script);
                        sl.open("GET", src);
                        sl.send();
                        self.__loadedPlugins.push(sl);
                        sl.onload = function () {
                            if (self == null) {
                                return;
                            }
                            self.__loadScriptArr(codeArr, handler);
                            qxnw.charts.LOADED[script] = true;
                            self.fireDataEvent('scriptLoaded', script);
                            qxnw.charts.LOADING[script] = null;
                        };
                    }
                } else {
                    handler();
                }
            } catch (e) {
                console.log(e);
            }
        },
        /**
         * Simple css loader without event support
         */
        __addCss: function (url) {
            if (!qxnw.charts.LOADED[url]) {
                qxnw.charts.LOADED[url] = true;
                var head = document.getElementsByTagName("head")[0];
                var el = document.createElement("link");
                el.id = "nw_chart_css";
                el.type = "text/css";
                el.rel = "stylesheet";
                el.href = qx.util.ResourceManager.getInstance().toUri("nw_charts/" + url);
                setTimeout(function () {
                    head.appendChild(el);
                }, 0);
            }
            ;
        },
        /**
         * our copy of the plot object
         */
        __plotObject: null,
        /**
         * Create the canvas once everything is renderad
         * 
         * @lint ignore(jQuery)
         */
        __addCanvas: function (dataSeries, getOptions) {
            var self = this;
            var el = this.getContentElement().getDomElement();
            /* make sure the element is here yet. Else wait until things show up */
            if (el == null) {
                this.addListenerOnce('appear', qx.lang.Function.bind(this.__addCanvas, this, dataSeries, getOptions), this);
            } else {
                /* with IE and excanvas, we have to
                 add the missing method to the canvas
                 element first since the initial loading
                 only catches elements from the original html */
                if (!el.getContext && window.G_vmlCanvasManager) {
                    window.G_vmlCanvasManager.initElement(el);
                }

                var id = 'jqPlotId' + (qxnw.charts.INSTANCE_COUNTER++);
                qx.bom.element.Attribute.set(el, 'id', id);

                var options = qx.lang.Type.isFunction(getOptions) ? getOptions(jQuery.jqplot) : getOptions;
                qx.lang.Object.mergeWith(options, qxnw.charts.DEFAULT_OPTIONS, false);
                jQuery.jqplot.config.enablePlugins = true;
                try {
                    var plot = this.__plotObject = jQuery.jqplot(id, dataSeries, options);
                } catch (e) {
                    console.log(e);
                    return;
                }
                this.fireDataEvent('plotCreated', plot);
                self.__plot = plot;
                self.__id = id;
                self.__dataSeries = dataSeries;
                self.__options = options;
                this.addListener('resize', qx.lang.Function.bind(this.__redraw, this, plot, id, dataSeries, options), this);
                this.addListener('appear', qx.lang.Function.bind(this.__redraw, this, plot, id, dataSeries, options), this);
            }
        },
        getPlotId: function getPlotId() {
            return 'jqPlotId' + (qxnw.charts.INSTANCE_COUNTER);
        },
        getPlot: function getPlot() {
            return this.__plot;
        },
        redraw: function redraw(dataSeries) {
            this.__redraw(this.__plot, this.__id, dataSeries, this.__options);
        },
        __redraw: function (plot, id, dataSeries, options) {
            // with out .flush() the plot div will not yet be
            // resized, causing the jqPlot not to render
            // properly
            qx.html.Element.flush();
            if (!this.isSeeable()) {
                // jqplot does not take kindely to being redrawn while not visible
                return;
            }
            // since we are loading plugins dynamically
            // it could be that others have been added since the last round
            // so we have to run the preInitHooks again or some plugins might
            // try to access non accessible structures
            for (var i = 0; i < jQuery.jqplot.preInitHooks.length; i++) {
                jQuery.jqplot.preInitHooks[i].call(plot, id, dataSeries, options);
            }
            try {
                plot.replot({
                    clear: true,
                    resetAxes: true
                });
            } catch (e) {

            }
        },
        update: function update(data) {
            var obj = this.getPlotObject();
            if (obj != null) {
                obj.series[0].data = data;
                obj.resetAxesScale();
                obj.replot();
            }
        }
    }
});
