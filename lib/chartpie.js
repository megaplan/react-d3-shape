"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactD3Core = require('react-d3-core');

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var _commonProps = require('./commonProps');

var _commonProps2 = _interopRequireDefault(_commonProps);

var ChartSvg = (function (_Component) {
  _inherits(ChartSvg, _Component);

  function ChartSvg(props) {
    _classCallCheck(this, ChartSvg);

    _get(Object.getPrototypeOf(ChartSvg.prototype), 'constructor', this).call(this, props);
  }

  _createClass(ChartSvg, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var height = _props.height;
      var width = _props.width;
      var margins = _props.margins;
      var data = _props.data;
      var svgClassName = _props.svgClassName;
      var id = _props.id;
      var name = _props.name;
      var value = _props.value;

      var children = _react2['default'].Children.map(this.props.children, function (el) {
        return _react2['default'].cloneElement(el, {
          height: height,
          width: width,
          margins: margins,
          data: data,
          name: name,
          value: value
        });
      });

      var t = 'translate(' + margins.left + ', ' + margins.top + ')';

      return _react2['default'].createElement(
        'svg',
        {
          height: height,
          width: width,
          className: svgClassName,
          id: id,
          ref: 'svgContainer'
        },
        _react2['default'].createElement(
          'g',
          {
            transform: t
          },
          children
        )
      );
    }
  }], [{
    key: 'defaultProps',
    value: Object.assign(_commonProps2['default'], {
      svgClassName: 'react-d3-core__container_svg'
    }),
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      id: _react.PropTypes.string,
      width: _react.PropTypes.number.isRequired,
      height: _react.PropTypes.number.isRequired,
      margins: _react.PropTypes.object.isRequired,
      svgClassName: _react.PropTypes.string.isRequired
    },
    enumerable: true
  }]);

  return ChartSvg;
})(_react.Component);

exports['default'] = ChartSvg;
module.exports = exports['default'];