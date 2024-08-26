/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 #asset(chartjs/*)
 
 ************************************************************************ */

qx.Class.define("qxnw.chartsNew", {
    extend: qx.ui.container.Composite,
    /**
     * @param dataSeries {Array} data array to plot
     * @param getOptions {Callback|Map} wither an option map or a function returning the option map after being called with jQuery.jqplot as an argument.
     * @param pluginArr  {Array} array of plugin base names. (use "cursor" not "jqplot.cursor.js")
     *
     */

    construct: function (dataSeries, value, pluginArr, labels, ticks) {
        this.base(arguments);
        var self = this;

        self.setLayout(new qx.ui.layout.Canvas());
        self.__dataSeries = dataSeries;
        self.__pluginArr = pluginArr;
        self.canvas = new qx.ui.embed.Canvas().set({
            syncDimension: true
        });
        self.add(self.canvas);
        self.dynLoader = new qx.util.DynamicScriptLoader(["nw_charts/chartjs.js", "nw_charts/chartjs-plugin-datalabels.min.js"]);
        self.dynLoader.addListenerOnce("loaded", function (e) {
            self.__isLoaded = true;
        });
        self.dynLoader.addListenerOnce("ready", function (e) {
            var ctx = self.canvas.getContentElement().getDomElement();
            if (ctx === null) {
                self.canvas.addListener("appear", function () {
                    var ctx = self.canvas.getContentElement().getDomElement();
                    if (self.myChart) {
                        self.myChart.destroy();
                    }
                    self.createCharBars(ctx, value, ticks, dataSeries, labels, value);
                    if (self.ds2 !== null) {
                        self.addDataSeries(self.ds2);
                    }
                });
                return;
            }
            if (self.myChart) {
                self.myChart.destroy();
            }
            self.createCharBars(ctx, value, ticks, dataSeries, labels, value);
            if (self.ds2 !== null) {
                self.addDataSeries(self.ds2);
            }
        });
        self.dynLoader.start();

        self.ThemeDictionary = {
            AmarilloRojo: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
            BlancoAzul: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
            BlancoPurpura: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
            PurpuraVerde: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
            RojoVerde: ['#960000', '#ae0000', '#e10000', '#ff0000', '#F08080', '#FFA07A', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
            BlancoVerde: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
            Classic10: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
            ClassicLight10: ["#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5", "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"],
            Classic20: ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
            ClassicGray5: ["#60636a", "#a5acaf", "#414451", "#8f8782", "#cfcfcf"],
            ClassicColorBlind10: ["#006ba4", "#ff800e", "#ababab", "#595959", "#5f9ed1", "#c85200", "#898989", "#a2c8ec", "#ffbc79", "#cfcfcf"],
            ClassicTrafficLight9: ["#b10318", "#dba13a", "#309343", "#d82526", "#ffc156", "#69b764", "#f26c64", "#ffdd71", "#9fcd99"],
            ClassicPurpleGray6: ["#7b66d2", "#dc5fbd", "#94917b", "#995688", "#d098ee", "#d7d5c5"],
            ClassicPurpleGray12: ["#7b66d2", "#a699e8", "#dc5fbd", "#ffc0da", "#5f5a41", "#b4b19b", "#995688", "#d898ba", "#ab6ad5", "#d098ee", "#8b7c6e", "#dbd4c5"],
            ClassicGreenOrange6: ["#32a251", "#ff7f0f", "#3cb7cc", "#ffd94a", "#39737c", "#b85a0d"],
            ClassicGreenOrange12: ["#32a251", "#acd98d", "#ff7f0f", "#ffb977", "#3cb7cc", "#98d9e4", "#b85a0d", "#ffd94a", "#39737c", "#86b4a9", "#82853b", "#ccc94d"],
            ClassicBlueRed6: ["#2c69b0", "#f02720", "#ac613c", "#6ba3d6", "#ea6b73", "#e9c39b"],
            ClassicBlueRed12: ["#2c69b0", "#b5c8e2", "#f02720", "#ffb6b0", "#ac613c", "#e9c39b", "#6ba3d6", "#b5dffd", "#ac8763", "#ddc9b4", "#bd0a36", "#f4737a"],
            ClassicCyclic13: ["#1f83b4", "#12a2a8", "#2ca030", "#78a641", "#bcbd22", "#ffbf50", "#ffaa0e", "#ff7f0e", "#d63a3a", "#c7519c", "#ba43b4", "#8a60b0", "#6f63bb"],
        };
    },
    destruct: function destruct() {
        this._disposeObjects("this.ds1");
        this._disposeObjects("this.ds2");
    },
    events: {
        scriptLoaded: 'qx.event.type.Event'
    },
    members: {
        ThemeDictionary: null,
        ds1: null,
        ds2: null,
        myChart: null,
        __isLoaded: false,
        dynLoader: null,
        canvas: null,
        __dataSeries: null,
        __getOptions: null,
        pluginArr: null,
        __labels: null,
        __ticks: null,
        jqplotToImg: function jqplotToImg() {
            var self = this;
            var url = self.myChart.toBase64Image();
            return url;
        },
        addDataSeries: function addDataSeries(ds2) {
            var self = this;

            self.ds2 = ds2;

            if (self.myChart === null) {
                return;
            }

            var newDataSet = [];
            newDataSet.push(self.ds1);

            var dsCloned = JSON.parse(JSON.stringify(self.ds1));

            dsCloned.borderDash = [10, 5];
            dsCloned.data = ds2;
            dsCloned.backgroundColor = self.ThemeDictionary["ClassicLight10"];
            dsCloned.borderColor = "#aec7e8";
            dsCloned.label = self.tr("Periodo anterior");

            newDataSet.push(dsCloned);

            self.myChart.data.datasets = newDataSet;
            self.myChart.options.mantainAspectRatio = false;
            self.myChart.update();
        },
        createCharBars: function createChartBars(ctx, value, ticks, dataSeries, labels, value) {
            var self = this;
            var options = null;

            if (typeof labels !== 'undefined') {
                var lbl = labels[0].label;
                lbl = lbl.replace(/<[^>]*>?/gm, '');
            }

            var Theme = value.pallete.pallete;

            if (value.type === "pie" || value.type === "horizontalBar") {
                dataSeries = dataSeries[0];
            }

            var ds1 = {
                label: lbl,
                data: dataSeries,
                borderWidth: 1,
                backgroundColor: self.ThemeDictionary[Theme],
                fill: false
            };
            self.ds1 = ds1;
            var dataSets = [];
            dataSets.push(ds1);

            var options = {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: ticks,
                    datasets: dataSets
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: value.title.text,
                            padding: {
                                top: 10,
                                bottom: 10
                            },
                            font: {
                                size: 24
                            }
                        },
                        datalabels: {
                            color: 'white',
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value, context) {
                                return Math.round(value.y);
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };
            if (typeof value.seriesDefaults.pointLabels !== 'undefined' && typeof value.seriesDefaults.pointLabels.formatString !== 'undefined') {
                if (value.type !== "horizontalBar") {
                    options.options.plugins.datalabels = {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function (value, context) {
                            var val = value;
                            if (typeof value.y !== 'undefined' && value.y !== "") {
                                val = value.y;
                            }
                            return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    };
                } else {
                    options.options.plugins.datalabels = {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function (value, context) {
                            var val = value;
                            if (typeof value.y !== 'undefined' && value.y !== "") {
                                val = value.y;
                            }
                            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    };
                }
            }
            switch (value.type) {
                case "bar":

                    break;
                case "horizontalBar":
                    options.type = "bar";
                    options.options.indexAxis = 'y';
                    options.options.plugins.legend = {
                        position: 'right'
                    };
                    options.data.datasets[0].axis = 'y';
                    break;

                case "lines":
                    options.type = "line";
                    options.options.plugins.datalabels.color = 'black';
                    var ds1 = {
                        label: lbl,
                        data: dataSeries,
                        borderWidth: 2,
                        backgroundColor: self.ThemeDictionary[Theme],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)'
                    };
                    self.ds1 = ds1;
                    var dataSets = [];
                    dataSets.push(ds1);
                    options.data = {
                        labels: ticks,
                        datasets: dataSets
                    }
                    ;
                    break;
                case "pie":
                    options.type = "pie";
                    options.options.plugins.datalabels = {
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(2) + "%";
                            return percentage;
                        }
                    }
                    ;
                    break;
                case "funnel":

                    break;
                default:

                    break;
            }
            self.myChart = new Chart(ctx, options);
        }
    }
});
