"use strict";

import {
  default as React,
  Component,
} from 'react';

import d3 from 'd3';
import {pieProps} from '../commonProps';
import ReactFauxDOM from 'react-faux-dom';

export default class Pie extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = Object.assign(pieProps, {
    onMouseOver: (d) => {
    },
    onMouseOut: (d) => {
    },
    onClick: (d) => {
    },
    arcClassName: ''
  })

  mkSeries() {
    const {
      data,
      chartSeries,
      value,
      name,
      categoricalColors
      } = this.props;

    return chartSeries.map((f, i) => {

      // set a color if not set
      if(!f.color)
        f.color = categoricalColors(i);

      // set name if not set
      if(!f.name)
        f.name = f.field;

      var val;

      data.forEach((d) => {
        if(name(d) === f.field)
          val = d;
      })

      return Object.assign(f, {value: value(val)});
    })
  }

  _mkPie(dom) {
    var {
      width,
      height,
      innerRadius,
      outerRadius,
      pieSort,
      name,
      onMouseOut,
      onMouseOver,
      onMouseMove,
      onClick,
      showLegendText,
      showStroke,
      arcClassName
      } = this.props;

    var radius = this.props.radius || Math.min(width - 100, height - 100) / 2;
    outerRadius = outerRadius || (radius - 10)

    var chartSeriesData = this.mkSeries();

    var arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    var arcOver = d3.svg.arc()
      .outerRadius(outerRadius + 10)
      .innerRadius(innerRadius);

    var pie = d3.layout.pie()
      .sort((a, b) => {
        return pieSort(a.value, b.value)
      })
      .value((d) => {
        return d.value;
      })

    var pieDom = d3.select(dom);

    var g = pieDom.selectAll('.arc')
        .data(pie(chartSeriesData))
        .enter()
        .append('g')
        .attr('class', arcClassName ? `${arcClassName} arc` : 'arc')
        .attr('key', (d) => name(d.data))
      ;

    g.append("path")
      .attr("d", arc)
      .style("fill", (d) => {
        return d.data.color;
      })
      .style("stroke", showStroke ? "#fff" : "none")
      .attr("style", (d) => {
        var s = '';
        if(d.data.style) {
          for(var key in d.data.style) {
            s += key + ':' + d.data.style[key] + ';';
          }
        }
        return s;
      })
      .on("mouseover", onMouseOver)
      .on("mousemove", onMouseMove ? onMouseMove : onMouseOver)
      .on("mouseout", onMouseOut)
      .on("click", onClick)

    var labelr = radius + 10;

    if(showLegendText) {
      g.append("text")
        .attr("transform", (d) => {
          var c = arc.centroid(d),
            x = c[0],
            y = c[1],
          // pythagorean theorem for hypotenuse
            h = Math.sqrt(x * x + y * y);

          return "translate(" + (x / h * labelr) + ',' +
            (y / h * labelr) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", (d) => {
          return (d.endAngle + d.startAngle) / 2 > Math.PI ?
            "end" : "start";
        })
        .text((d) => {
          return d.data.name;
        });
    }

    return pieDom;
  }

  render() {

    const {
      width,
      height,
      margins
      } = this.props;

    var t = `translate(${(width - margins.left - margins.right) / 2},  ${(height - margins.top - margins.bottom) / 2})`;

    var pieChart = ReactFauxDOM.createElement('g');
    pieChart.setAttribute("transform", t);
    pieChart.setAttribute("ref", "react-d3-basic__pie");

    var pie = this._mkPie(pieChart);

    return pie.node().toReact();
  }
}
