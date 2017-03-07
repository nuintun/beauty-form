define("choice",["./css/choice.css.js","jquery","./util"],function(e,t,i){"use strict";function r(e){u.find("input[type=radio][name="+e.name+"]").each(function(){var t=n.get(this);t&&e!==this&&t.refresh()})}function n(e){var t=this;t.destroyed=!1,t.element=c(e),t.type=t.element.attr("type"),t.type=t.type?t.type.toLowerCase():void 0;var i=n.get(e);if(i)return i;if("checkbox"!==t.type&&"radio"!==t.type)throw new TypeError("The element must be a checkbox or radio.");t.__init()}e("./css/choice.css.js");var c=e("jquery"),o=e("./util"),s={},u=c(document);n.get=function(e){return e=c(e),e.data("beauty-choice")},n.prototype={__init:function(){var e=this.type;if(!s[e]){s[e]=0;var t=".beauty-"+e,i="input[type="+e+"]";u.on("change"+t,i,function(){var t=n.get(this);t&&("radio"===e&&r(this),t.refresh())}),u.on("focusin"+t,i,function(){var e=n.get(this);e&&e.refresh()}),u.on("focusout"+t,i,function(){var e=n.get(this);e&&e.refresh()})}return this.__beauty()},__beauty:function(){var e=this,t=e.element;if(!n.get(t)){var i=e.type;t.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-'+i+'"/>'),s[i]++,e.choice=t.parent(),t.data("beauty-choice",e)}return e.refresh()},focus:function(){return this.element.trigger("focus"),this},blur:function(){return this.element.trigger("blur"),this},check:function(){var e=this,t=e.type,i=e.element[0];return i.checked=!0,"radio"===t&&r(i),e.refresh()},uncheck:function(){var e=this,t=e.type,i=e.element[0];return i.checked=!1,"radio"===t&&r(i),e.refresh()},enable:function(){return this.element[0].disabled=!1,this.refresh()},disable:function(){return this.element[0].disabled=!0,this.refresh()},refresh:function(){var e=this,t=e.element[0];return e.choice.toggleClass("ui-beauty-choice-checked",t.checked).toggleClass("ui-beauty-choice-disabled",t.disabled).toggleClass("ui-beauty-choice-focus",o.activeElement()===t),e},destroy:function(){var e=this;if(!e.destroyed){var t=e.type,i=e.element;if(i.unwrap(),i.removeData("beauty-choice"),!--s[t]){var r=".beauty-"+t;u.off("change"+r),u.off("focusin"+r),u.off("focusout"+r)}e.destroyed=!0}}},i.exports=n});