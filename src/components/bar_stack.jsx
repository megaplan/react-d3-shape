"use strict";

import {
  default as React,
  Component,
} from 'react';

import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {series} from '../utils/series';

export default class BarStack extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    onMouseOver: (d) => {
    },
    onMouseOut: (d) => {
    },
    barClassName: 'react-d3-basic__bar_stack',
    barStackClass: 'react-d3-basic__stack_bars',
    xScaleMaxWidthRect: 50,
    valueInBar: false,
    verticalValueInBar: false,
    formatValueInBar: (d) => {
      return d
    }
  }

  _mkBarStack(dom) {
    const {
      height,
      margins,
      barClassName,
      xScaleSet,
      yScaleSet,
      onMouseOver,
      onMouseOut,
      barStackClass,
      valueInBar,
      xScaleMaxWidthRect,
      verticalValueInBar,
      formatValueInBar
      } = this.props;

    var dataset = series(this.props);

    const _setStack = this._setStack();

    // make areas
    var chart = d3.select(dom)
      .attr("class", "g")

    var domain = yScaleSet.domain();
    var zeroBase;

    if(domain[0] * domain[1] < 0) {
      zeroBase = yScaleSet(0);
    } else if(((domain[0] * domain[1]) >= 0) && (domain[0] >= 0)) {
      zeroBase = yScaleSet.range()[0];
    } else if(((domain[0] * domain[1]) >= 0) && (domain[0] < 0)) {
      zeroBase = yScaleSet.range()[1];
    }

    var barGroup = chart.selectAll("g")
      .data(_setStack(dataset))
      .enter().append("g")
      .attr("class", `${barStackClass} barGroup`)
      .style("fill", (d) => {
        return d.color;
      })
      .attr("style", (d) => {
        var s = '';
        if(d.style) {
          for(var key in d.style) {
            s += key + ':' + d.style[key] + ';';
          }
        }
        return s;
      })

    barGroup.selectAll("rect")
      .data((d) => {
        return d.data;
      })
      .enter()
      .append("rect")
      .attr("class", `${barClassName} bar`)
      .attr("width", Math.min(xScaleSet.rangeBand(), xScaleMaxWidthRect))
      .attr("x", (d) => {
        return xScaleSet(d.x) ? xScaleSet(d.x) + ((xScaleSet.rangeBand() - Math.min(xScaleSet.rangeBand(), xScaleMaxWidthRect)) / 2) : -10000
      })
      .attr("y", (d, i) => {
        return yScaleSet(d.y0 + d.y);
      })
      .attr("height", (d, i) => {
        return Math.abs(yScaleSet(d.y) - yScaleSet(0));
      })
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)

    if(valueInBar) {
      barGroup.selectAll("text")
        .data((d) => {
          return d.data;
        })
        .enter()
        .append("text")
        .attr("text-anchor", verticalValueInBar ? "start" : "middle")
        .attr("height", 15)
        .attr("x", (d) => {
          const x = xScaleSet(d.x) ? xScaleSet(d.x) + xScaleSet.rangeBand() / 2 : -10000
          if(verticalValueInBar) {
            return x + 11 / 2
          }
          return x
        })
        .attr("y", (d) => {
          const height = Math.abs(yScaleSet(d.y) - yScaleSet(0))
          if(verticalValueInBar) {
            return yScaleSet(d.y0 + d.y) - 10 + height
          }
          if(height < 15) {
            return yScaleSet(d.y0 + d.y) + height
          }
          return yScaleSet(d.y0 + d.y) + 15
        })
        .attr("style", "font-weight:bold")
        .text((d) => {
          const height = Math.abs(yScaleSet(d.y) - yScaleSet(0))
          if(verticalValueInBar && d.y.toString().length * 7 * (1 + 1 / 3) < height ||
            !verticalValueInBar && d.y > 0 && height > 15) {
            return formatValueInBar(d.y)
          }
          return ""
        })
        .attr("fill", (d) => {
          const hexColor = parseInt(d.color.replace("#", ""), 16)
          const l = Math.max((hexColor & 0xFF0000) >> 16, (hexColor & 0x00ff00) >> 8, hexColor & 0x0000ff) / 255
          if(l > 0.7) {
            return "#000000"
          }
          return "#ffffff"
        })
        .attr("transform", (d) => {
          if(verticalValueInBar) {
            const height = Math.abs(yScaleSet(d.y) - yScaleSet(0))
            const x = xScaleSet(d.x) ? xScaleSet(d.x) + xScaleSet.rangeBand() / 2 : -10000
            const y = yScaleSet(d.y0 + d.y) + height - 10
            return `rotate(-90,${x + 11 / 2},${y})`
          }
          return ""
        })
    }

    return chart;
  }

  _setStack() {
    const {
      chartSeries
      } = this.props;

    var buildOut = function(len) {
      // baseline for positive and negative bars respectively.
      var currentXOffsets = [];
      var currentXIndex = 0;
      return function(d, y0, y) {

        if(currentXIndex++ % len === 0) {
          currentXOffsets = [0, 0];
        }

        if(y >= 0) {
          d.y0 = currentXOffsets[1];
          d.y = y;
          currentXOffsets[1] += y;
        } else {
          d.y0 = currentXOffsets[0] + y;
          d.y = -y;
          currentXOffsets[0] += y;
        }
      }
    }
    return d3.layout.stack()
      .values((d) => {
        return d.data;
      })
      .out(buildOut(chartSeries.length));

  }

  render() {
    var barChart = ReactFauxDOM.createElement('g');
    var bar = this._mkBarStack(barChart);

    return bar.node().toReact();
  }
}
