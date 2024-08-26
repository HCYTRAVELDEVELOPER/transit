/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */

/**
 * Class created to be the main window. Into this class, you can put content as sub-windows, show forms, see some bars and more!
 */
qx.Class.define("qxnw.examples.charts", {
    extend: qx.core.Object,
    members: {
        __plot: null,
        executeExample: function executeExample(name) {
            var self = this;
            var jqplot = null;
            var f = new qxnw.forms();
            f.setColumnsFormNumber(0);
            switch (name) {
                case "pie":
                    jqplot = this.pie();
                    break;
                case "Hardlines":
                    jqplot = this.lines();
                    break;
                case "bars":
                    jqplot = this.bars();
                    break;
                case "lines":
                    jqplot = this.lines();
                    break;
                case "linesNew":
                    jqplot = this.linesNew();
                    break;
                case "textQXNW":
                    jqplot = this.textQXNW();
                    break;
                case "lines_image":
                    jqplot = this.lines_image();
                    break;
                case "funnel":
                    jqplot = this.funnel();
                    break;
            }
            f.masterContainer.add(jqplot, {
                flex: 1
            });
            self.__plot = jqplot;
            f.createDeffectButtons();
            f.ui.accept.addListener("execute", function () {
                var s1 = [[1, 50], [2, 13], [3, 10], [4, 6]];
                var s2 = [[1, 34], [2, 23], [3, 10], [4, 6]];
                var s3 = [[1, 13], [2, 7], [3, 10], [4, 66]];

                self.__plot.setSerieData(0, s1);
                self.__plot.setSerieData(0, s2);
                self.__plot.setSerieData(0, s3);

                self.__plot.setLabel(0, "Cambia!");

                var x = ["Cambia uno", "cambia dos", "cambia 3", "cambia 4"];
                self.__plot.setTicks(x);

                self.__plot.replot(false);
            });
            f.show();
            return f;
        },
        textQXNW: function textQXNW() {
            var dynamicImage = new qxnw.widgets.charts();
            return dynamicImage;
        },
        funnel: function funnel() {
            var self = this;
            var model = [
                {"label": 20, level: 0, prueba: 100},
                {"label": 30, level: 0, prueba: 100}
            ];
            var arrAll = [];
            var arrAllInside = [];
            var ticks = [];
            var labels = [];

            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        ticks.push(label);
                    }
                }
            }

            var values = [
                {
                    "caption": "prueba",
                    "label": "prueba"
                }
            ];

            for (var ia = 0; ia < values.length; ia++) {
                var tt = values[ia];

                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='16'>" + label + "</font>";

                labels.push({label: label});
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        var v = [];
                        v.push(model[i]["label"]);
                        v.push(model[i][tt["caption"]]);
                        arrAllInside.push(v);
                    }
                }
            }
            arrAll = [arrAllInside];
            console.log(arrAll);
            var options = function ($jqplot) {
                var tmpTitle = 'Inteligencia empresarial - Líneas';
                var rta = {
                    title: {
                        text: tmpTitle
                    },
                    axes: {
                        xaxis: {
                            ticks: ticks,
                            tickOptions: {
                                formatString: '%#m/%#d/%y'
                            }
                        },
                        yaxis: {
                            tickOptions: {
                                formatString: '$%.2f'
                            }
                        }
                    },
                    seriesDefaults: {
                        renderer: $jqplot.FunnelRenderer,
                        rendererOptions: {
                            showDataLabels: true
                        },
                        animation: {
                            speed: 1500
                        }
                    },
                    highlighter: {
                        show: true,
                        tooltipAxes: 'xy',
                        useAxesFormatters: false
                    },
                    cursor: {
                        show: true
                    }
                };
                return rta;
            };
            console.log(arrAll);
            var plugins = ['funnelRenderer', 'highlighter'];
            return new qxnw.charts(arrAll, options, plugins);
        },
        linesNew: function linesNew() {
            var data = {
                // A labels array that can contain any sort of values
                labels: ['500', '1.000', '2.000', '3.000', '4.000', '6.000', '8.000'],
                // Our series array that contains series objects or in this case series data arrays
                series: [
                    [
                        {
                            value: 10,
                            meta: {
                                imageUrl: 'http://icons.iconarchive.com/icons/iconicon/veggies/32/bananas-icon.png'
                            }
                        }, {
                            value: 50,
                            meta: {
                                imageUrl: 'http://icons.iconarchive.com/icons/fi3ur/fruitsalad/32/apple-icon.png'
                            }
                        }, {
                            value: -20,
                            meta: {
                                imageUrl: 'http://icons.iconarchive.com/icons/ergosign/free-spring/32/strawberry-icon.png'
                            }
                        }]
                ]
            };

            var options = {
                axisX: {
                    position: "start"
                },
                axisY: {
                    high: 20,
                    low: -140,
                    ticks: ['-140', '-130', '-120', '-110', '-100', '-90', '-80', '-70', '-60', '-50', '-40', '-30', '-20', '-10', '0', '10', '20'],
                    labelInterpolationFnc: function (value) {
                        return -value;
                    }
                },
                onlyInteger: false
            };
            return new qxnw.chartsLight(data, options);
        },
        lines: function lines() {
            var options = function ($jqplot) {
                return{
                    title: 'Test de charts interactivos',
                    legend: {show: true},
                    seriesDefaults: {
                        renderer: $jqplot.CanvasAxisLabelRenderer,
                        pointLabels: {show: true}
                    }
                };
            };
            var data = [[[0, 3], [5, 7], [3, 2]]];
            var plugins = ['canvasTextRenderer'];
            return new qxnw.charts(data, options, plugins);
        },
        replot_widget: function replot_widget(type) {
            var self = this;
            switch (type) {
                case "lines_image":
                    var data = [
                        [0, 7, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>'],
                        [1, 5, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>'],
                        [2, 3, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>']
                    ];
                    var data1 = [
                        [5, 5, '<img height="16px" width="16px" src="/imagenes/gruponw.png"/>'],
                        [2, 2, '<img height="16px" width="16px" src="/imagenes/gruponw.png"/>'],
                        [1, 2, '<img height="16px" width="16px" src="/imagenes/gruponw.png"/>']
                    ];
                    self.__plot.setSerieData(0, data);
                    self.__plot.setSerieData(1, data1);
                    self.__plot.replot(false);
                    break;
            }
        },
        lines_image: function lines_image() {
            var ticks = ['500', '1.000', '2.000', '3.000', '4.000', '6.000', '8.000'];
            var options = function ($jqplot) {
                return{
                    title: 'Gráfica Ósea',
                    seriesDefaults: {
                        xaxis: 'x2axis',
                        renderer: $jqplot.CanvasAxisLabelRenderer,
                        pointLabels: {
                            show: true,
                            escapeHTML: false
                        },
                        renderOptions: {
                            barDirection: 'horizontal'
                        }
                    },
                    series: [
                        {
                            label: 'Ojo Derecho',
                            color: 'red'
                        },
                        {
                            label: 'Ojo Izquierdo',
                            color: "blue"
                        }
                    ],
                    axesDefaults: {
                        tickRenderer: $jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30
                        }
                    },
                    highlighter: {
                        show: true,
                        sizeAdjust: 7.5
                    },
                    axes: {
                        x2axis: {
                            renderer: $jqplot.CategoryAxisRenderer,
                            ticks: ticks
                        },
                        yaxis: {
                            tickOptions: {
                                formatString: '%d'
                            },
                            min: 70,
                            max: 0
                        }
                    },
                    legend: {
                        show: false
                    }
                };
            };
            var data = [
//                [0, 0],
//                [1, 7],
//                [2, 51]
                [0, 3, '<img height="16px" width="16px" src="/imagenes/gruponw.png"/>'],
                [1, 7, '<img height="16px" width="16px" src="/imagenes/gruponw.png"/>'],
                [2, 42, 200 + '&nbsp;&nbsp;<img height="16px" width="16px" src="/imagenes/gruponw.png"/>']
            ];
            var data1 = [
                [0, 0],
                [1, 15],
                [2, 30]
//                [0, 1, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>'],
//                [1, 4, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>'],
//                [2, 2, '<img height="16px" width="16px" src="/imagenes/andresf.jpg"/>']
            ];
            var plugins = ['canvasTextRenderer', 'canvasAxisTickRenderer', 'categoryAxisRenderer', 'barRenderer'];
            return new qxnw.charts([data, data1], options, plugins);
        },
        bars: function bars() {
            var s1 = [12, 34, 50, 34];
            var s2 = [5, 10, 5, 5];
            var s3 = [8, 5, 57, 2];
            var ticks = ['Enero', 'Febrero', 'Marzo', 'Abril'];
            var options = function ($jqplot) {
                return{
                    title: 'Comparativo',
                    seriesDefaults: {
                        renderer: $jqplot.BarRenderer,
                        pointLabels: {
                            show: true
                        },
                        yaxis: 'y2axis',
                        xaxis: 'x2axis',
                        rendererOptions: {
                            barDirection: 'horizontal'
                        }
                    },
                    series: [
                        {
                            label: 'Incidencia'
                        },
                        {
                            label: 'Mantenimiento correctivo'
                        },
                        {
                            label: 'Mantenimiento preventivo'
                        }
                    ],
                    highlighter: {
                        show: true,
                        sizeAdjust: 7.5
                    },
                    axesDefaults: {
                        tickRenderer: $jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30
                        }
                    },
                    axes: {
                        xaxis: {
                            renderer: $jqplot.CategoryAxisRenderer,
                            ticks: ticks,
                            angle: -90
                        },
                        yaxis: {
                            pad: 1.05
                        }
                    },
                    legend: {
                        show: true,
                        placement: 'outsideGrid'
                    }
                };
            };
//            ,
//                            tickOptions: {
//                                formatString: '$%d'
//                            }
            var plugins = ['canvasTextRenderer', 'canvasAxisTickRenderer', 'categoryAxisRenderer', 'barRenderer'];
            return new qxnw.charts([s1, s2, s3], options, plugins);
        },
        pie: function pie() {
            var data = [[['ranas', 3], ['buitres', 7], ['ciervos', 2.5], ['pavos', 6], ['topos', 5], ['perros', 4]]];
            var options = function ($jqplot) {
                return{
                    title: 'Test de charts interactivos',
                    seriesDefaults: {
                        renderer: $jqplot.PieRenderer,
                        rendererOptions: {
                            sliceMargin: 8
                        }
                    },
                    legend: {show: true}
                };
            };
            var plugins = ['pieRenderer'];
            return new qxnw.charts(data, options, plugins);
        },
        hardLines: function hardLines() {
            var data = [
                [[2, 1], [4, 2], [6, 3], [3, 4]],
                [[5, 1], [1, 2], [3, 3], [4, 4]],
                [[4, 1], [7, 2], [1, 3], [2, 4]]];
            var options = function ($jqplot) {
                return{
                    title: 'Test de charts interactivos',
                    seriesDefaults: {
                        renderer: $jqplot.BarRenderer,
                        // Show point labels to the right ('e'ast) of each bar.
                        // edgeTolerance of -15 allows labels flow outside the grid
                        // up to 15 pixels.  If they flow out more than that, they 
                        // will be hidden.
                        pointLabels: {show: true, location: 'e', edgeTolerance: -15},
                        // Rotate the bar shadow as if bar is lit from top right.
                        shadowAngle: 135,
                        // Here's where we tell the chart it is oriented horizontally.
                        rendererOptions: {
                            barDirection: 'horizontal'
                        },
                        axes: {
                            yaxis: {
                                renderer: $jqplot.CategoryAxisRenderer
                            }
                        }
                    },
                    legend: {show: true}
                };
            };
            var plugins = ['lineRenderer'];
            return new qxnw.charts(data, options, plugins);
        }
    }
});
