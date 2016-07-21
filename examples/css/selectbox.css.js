define("css/selectbox.css.js", ["import-style"], function(require, exports, module){
var style = require("import-style");

style.css(".ui-beauty-select-hidden {\n  position: absolute;\n  top: auto; right: auto;\n  bottom: auto; left: auto;\n  z-index: -1; opacity: 0;\n  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n}\n:root .ui-beauty-select-hidden {\n  -ms-filter: none;\n  filter: none;\n}\n.ui-beauty-select {\n  position: relative;\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  margin: 0; padding: 0 24px 0 6px;\n  outline: 0 none; text-align: left;\n  border: 1px solid #ccc;\n  font-size: 0; letter-spacing: 0;\n  -webkit-text-size-adjust: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  background: #fff;\n}\n.ui-beauty-select-titlebox {\n  overflow: hidden;\n  margin: 0; padding: 0;\n  font-size: 0; letter-spacing: 0;\n  -webkit-text-size-adjust: none;\n  width: 100%; height: 100%;\n}\n.ui-beauty-select-focus {\n  z-index: 2147483647;\n  border: 1px solid #09e;\n}\n.ui-beauty-select-title,\n.ui-beauty-select-align-middle {\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  vertical-align: middle;\n}\n.ui-beauty-select-align-middle {\n  width: 0; height: 100%;\n}\n.ui-beauty-select-title {\n  width: 100%;\n  cursor: default;\n  margin: 0; padding: 0;\n  font-size: 13px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-beauty-select-disabled .ui-beauty-select-title {\n  color: #e6e6e6; cursor: not-allowed;\n}\n.ui-beauty-select-icon {\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  width: 16px; height: 16px;\n  position: absolute;\n  top: 50%; right: 4px;\n  margin-top: -8px;\n  background: url(./examples/images/select.png) no-repeat center;\n}\n.ui-beauty-select-disabled .ui-beauty-select-icon {\n  cursor: not-allowed;\n  background: url(./examples/images/select-disabled.png) no-repeat center;\n}\n.ui-beauty-select-opened .ui-beauty-select-icon {\n  background: url(./examples/images/select-opened.png) no-repeat center;\n}\n.ui-beauty-select-disabled.ui-beauty-select-opened .ui-beauty-select-icon {\n  background: url(./examples/images/select-opened-disabled.png) no-repeat center;\n}\n.ui-beauty-select-dropdown {\n  position: absolute;\n  left: 0; padding: 0;\n  border: 1px solid #09e;\n  max-height: 252px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  outline: 0 none;\n  font-size: 13px;\n  list-style: none;\n  background: #fff;\n  margin: 0 0 0 -1px;\n}\n.ui-beauty-select-dropdown-top {\n  margin-top: 0;\n}\n.ui-beauty-select-dropdown-bottom {\n  margin-top: -2px;\n}\n.ui-beauty-select-dropdown-items {\n  margin: 0; padding: 0;\n}\n.ui-beauty-select-optgroup,\n.ui-beauty-select-option {\n  height: 16px;\n  line-height: 16px;\n  white-space: nowrap;\n  outline: 0 none;\n  margin: 0; padding: 6px;\n  cursor: pointer;\n  color: #333;\n  background: #fff;\n  text-align: left;\n}\n.ui-beauty-select-optgroup-option {\n  padding-left: 20px;\n}\n.ui-beauty-select-optgroup {\n  color: #000;\n  cursor: default;\n  font-size: 14px;\n  font-weight: bold;\n  font-style: italic;\n}\n.ui-beauty-select-option:hover {\n  background: #eee;\n}\n.ui-beauty-select-option:focus {\n  outline: 0 none;\n}\n.ui-beauty-select-option-selected,\n.ui-beauty-select-option-selected:hover {\n  color: #fff;\n  background: #3870f3;\n}\n.ui-beauty-select-option-disabled,\n.ui-beauty-select-option-disabled:hover {\n  color: #e6e6e6;\n  cursor: default;\n}\n");
});
