const React = require('react');
const SvgMock = (props) => React.createElement('svg', props);
module.exports = SvgMock;
module.exports.default = SvgMock;
module.exports.Svg = SvgMock;
module.exports.Path = (props) => React.createElement('path', props);
module.exports.G = (props) => React.createElement('g', props);
module.exports.Rect = (props) => React.createElement('rect', props);
