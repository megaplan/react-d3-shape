"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.series = series;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

function series(props) {
  var data = props.data;
  var chartSeries = props.chartSeries;
  var x = props.x;
  var y = props.y;
  var categoricalColors = props.categoricalColors;

  categoricalColors = categoricalColors || _d32["default"].scale.category10();

  var chartSeriesData = chartSeries.map(function (f, i) {

    // set a color if not set
    f.color = f.color || categoricalColors(i);

    // set name if not set
    f.name = f.name || f.field;

    // mapping throught data set x, y data
    var mapping = data.map(function (d) {
      return {
        x: x(d),
        y: y(d[f.field]),
        color: d.color ? d.color : f.color,
        name: f.name,
        field: f.field
      };
    });

    return Object.assign(f, { data: mapping });
  });

  return chartSeriesData;
}