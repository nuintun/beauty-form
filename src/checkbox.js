/**
 * Created by nuintun on 2015/3/31.
 */

'use strict';

require('./css/checkbox.css');

var Choice = require('./choice');

module.exports = function (scope){
  return new Choice('checkbox', scope);
};
