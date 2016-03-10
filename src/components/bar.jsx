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
    valueInBar: false
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
      xScaleMaxWidthRect,
      valueInBar
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
      .style("fill", dataset.color)
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)

    if(valueInBar) {
      bar.selectAll("text")
        .data(dataset.data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("height", 15)
        .attr("x", (d) => {
          return xScaleSet(d.x) ? xScaleSet(d.x) + xScaleSet.rangeBand() / 2 : -10000
        })
        .attr("y", (d) => {
          const height = Math.abs(d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y)))
          if(height < 15) {
            return yScaleSet(d.y) + height
          }
          return yScaleSet(d.y) + 15;
        })
        .attr("style", "font-weight:bold")
        .text((d) => {
          const height = Math.abs(d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y)))
          if(d.y > 0 && height > 15) {
            return d.y
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
