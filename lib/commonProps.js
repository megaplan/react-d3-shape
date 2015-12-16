"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var width = 960;
var height = 500;
var margins = { top: 80, right: 100, bottom: 80, left: 100 };

exports['default'] = {
  width: width,
  height: height,
  margins: margins,
  y: function y(d) {
    return +d;
  },
  xScale: 'linear',
  yScale: 'linear',
  showXGrid: true,
  showYGrid: true
};
var pieProps = {
  width: width,
  height: height,
  margins: margins,
  innerRadius: 0,
  categoricalColors: _d32['default'].scale.category10(),
  pieSort: _d32['default'].descending
};
exports.pieProps = pieProps;