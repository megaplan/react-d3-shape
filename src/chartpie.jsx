"use strict";

import {
  default as React,
  Component,
  PropTypes,
} from 'react';

import {
  scale,
  xDomainCount,
  yDomainCount
} from 'react-d3-core';

import d3 from 'd3';
import CommonProps from './commonProps';

export default class ChartSvg extends Component {
  constructor(props) {
    super (props);
  }

  static defaultProps = Object.assign(CommonProps, {
    svgClassName: 'react-d3-core__container_svg'
  })

  static propTypes = {
    id: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margins: PropTypes.object.isRequired,
    svgClassName: PropTypes.string.isRequired,
  }

  render() {

    var {
      height,
      width,
      margins,
      data,
      svgClassName,
      id,
      name,
      value
    } = this.props;

    var children = React.Children.map(this.props.children, (el) => {
        return React.cloneElement(el, {
          height: height,
          width: width,
          margins: margins,
          data: data,
          name: name,
          value: value
        })
    });

    var t = `translate(${margins.left}, ${margins.top})`;

    return (
      <svg
        height = {height}
        width = {width}
        className = {svgClassName}
        id = {id}
        ref = "svgContainer"
      >
        <g
          transform = {t}
        >
          {children}
        </g>
      </svg>
    )
  }
}
