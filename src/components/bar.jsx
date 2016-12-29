"use strict";

import {
  default as React,
  Component,
} from 'react';

import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {series} from '../utils/series';

export default class Bar extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    interpolate: null,
    onMouseOver: (d) => {
    },
    onMouseOut: (d) => {
    },
    barClassName: 'react-d3-basic__bar',
    xScaleMaxWidthRect: 50,
    valueInBar: false,
    verticalValueInBar: false,
    formatValueInBar: (d) => {
      return d
    }
  }

  _mkBar(dom) {
    const {
      height,
      margins,
      barClassName,
      xScaleSet,
      yScaleSet,
      onMouseOut,
      onMouseOver,
      onMouseMove,
      xScaleMaxWidthRect,
      valueInBar,
      verticalValueInBar,
      formatValueInBar
      } = this.props;

    var dataset = series(this.props)[0];

    // make areas
    var bar = d3.select(dom)

    var domain = yScaleSet.domain();
    var zeroBase;

    if(domain[0] * domain[1] < 0) {
      zeroBase = yScaleSet(0);
    } else if(((domain[0] * domain[1]) >= 0) && (domain[0] >= 0)) {
      zeroBase = yScaleSet.range()[0];
    } else if(((domain[0] * domain[1]) >= 0) && (domain[0] < 0)) {
      zeroBase = yScaleSet.range()[1];
    }

    bar.selectAll(".bar")
      .data(dataset.data)
      .enter().append("rect")
      .attr("class", `${barClassName} bar`)
      .attr("x", (d) => {
        return xScaleSet(d.x) ? xScaleSet(d.x) + ((xScaleSet.rangeBand() - Math.min(xScaleSet.rangeBand(), xScaleMaxWidthRect)) / 2) : -10000
      })
      .attr("width", Math.min(xScaleSet.rangeBand(), xScaleMaxWidthRect))
      .attr("y", (d) => {
        return d.y < 0 ? zeroBase : yScaleSet(d.y);
      })
      .attr("height", (d) => {
        return d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y))
      })
      .style("fill", (d) => {
        return d.color ? d.color : dataset.color
      })
      .on("mouseover", onMouseOver)
      .on("mousemove", onMouseMove ? onMouseMove : onMouseOver)
      .on("mouseout", onMouseOut)

    if(valueInBar) {
      bar.selectAll("text")
        .data(dataset.data)
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
          if(verticalValueInBar) {
            return zeroBase - 10
          }
          const height = Math.abs(d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y)))
          if(height < 15) {
            return yScaleSet(d.y) + height
          }
          return yScaleSet(d.y) + 15
        })
        .attr("style", "font-weight:bold")
        .text((d) => {
          const height = Math.abs(d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y)))
          if(verticalValueInBar && formatValueInBar(d.y).toString().length * 7 * (1 + 1 / 3) < height - 10 ||
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
            const x = xScaleSet(d.x) ? xScaleSet(d.x) + xScaleSet.rangeBand() / 2 : -10000
            const y = zeroBase - 10
            return `rotate(-90,${x + 11 / 2},${y})`
          }
          return ""
        })
        .on("mouseover", onMouseOver)
        .on("mousemove", onMouseMove ? onMouseMove : onMouseOver)
        .on("mouseout", onMouseOut)

    }

    if(dataset.style) {
      for(var key in dataset.style) {
        bar.style(key, dataset.style[key]);
      }
    }

    return bar;
  }

  render() {
    var barChart = ReactFauxDOM.createElement('g');
    var bar = this._mkBar(barChart);

    return bar.node().toReact();
  }
}
