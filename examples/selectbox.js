define("selectbox",["./css/selectbox.css.js","jquery","./util","./scrollintoviewifneeded"],function(e,t,o){"use strict";function n(e,t){var o=[].slice.call(arguments,2),n=t.apply(e,o);if("string"===r.type(n))return n;throw new TypeError("Render function must return a string.")}function i(e,t){var o=this;if(o.type="select",o.opened=!1,o.destroyed=!1,o.element=r(e),void 0!==o.element.attr("multiple")||o.element.attr("size")>1)return o;t=r.extend({title:function(e,t){return'<i class="ui-beauty-select-align-middle"></i><span class="ui-beauty-select-title" title="'+t+'">'+t+'</span><i class="ui-beauty-select-icon"></i>'},dropdown:function(e,t){return'<dl class="ui-beauty-select-dropdown-items">'+t+"</dl>"},optgroup:function(e,t){return'<dt class="ui-beauty-select-optgroup" title="'+t+'">'+t+"</dt>"},option:function(e,t){return'<dd role="option" class="ui-beauty-select-option'+(t.group?" ui-beauty-select-optgroup-option":"")+(t.className?" "+t.className:"")+'" '+t.indexAttr+'="'+t.index+'" title="'+t.text+'">'+t.text+"</dd>"},dropdownWidth:null,optionIndexAttr:"data-option",optionSelectedClass:"ui-beauty-select-option-selected",optionDisabledClass:"ui-beauty-select-option-disabled"},t),r.each(["title","dropdown","optgroup","option"],function(e,o){if("function"!==r.type(t[o]))throw new TypeError("Options."+o+" must be a function.")}),o.options=t,o.__init()}e("./css/selectbox.css.js");var s,r=e("jquery"),d=e("./util"),l=e("./scrollintoviewifneeded"),c=0,u=null,a=r(window),p=r(document),h={width:a.width(),height:a.height()};i.get=function(e){return e=r(e),e.data("beauty-select")},i.prototype={__init:function(){var e=this,t=e.type,o=e.options,n=".beauty-"+t;if(u=e,!c){p.on("change"+n,"select",function(){var e=i.get(this);e&&(e.__renderTitlebox(),e.opened&&e.__refreshSelected())}),p.on("focusin"+n+" focusout"+n,"select",function(){var e=i.get(this);e&&e.__refreshSelectbox()}),p.on("mousedown"+n,function(e){var t=e.target,o=u.selectbox[0];t!==o&&!r.contains(o,t)&&u.opened&&(u.close(),u.__refreshSelectbox())}),p.on("keydown"+n,function(e){9!==e.which&&27!==e.which||(u.opened&&u.close(),u.__refreshSelectbox())}),a.on("resize"+n,function(){clearTimeout(s),h.width=a.width(),h.height=a.height(),s=setTimeout(function(){u.opened&&u.__position()},0)})}return e.__beauty(),e.element.on("keypress"+n,function(t){13===t.which&&(t.preventDefault(),e.opened?e.close():e.open())}),e.selectbox.on("mousedown"+n,function(t){if(!e.element[0].disabled)if(t.preventDefault(),e.focus(),e.opened){var o=t.target,n=e.dropdown[0];n===o||r.contains(n,o)||e.close()}else e.open()}),e.selectbox.on("click"+n,"["+o.optionIndexAttr+"]",function(t){t.preventDefault();var n=r(this);n.hasClass(o.optionDisabledClass)||(e.select(n.attr(o.optionIndexAttr)),e.close())}),e},__sizeSelectbox:function(){var e=this,t=e.element,o=e.selectbox,n=t.outerWidth()-o.outerWidth()+o.width(),i=t.outerHeight()-o.outerHeight()+o.height();return o.width(n),o.height(i),e},__sizeDropdown:function(){var e=this;e.opened||(e.dropdown.css("visibility","hidden"),e.dropdown.appendTo(e.selectbox));var t=e.dropdown,o=e.element.clone(),n={dropdown:{width:t.width(),outerWidth:t.outerWidth()}};o.css({position:"absolute",visibility:"hidden",width:"auto",top:"-100%",left:"-100%"}),o.insertBefore(e.element);var i=o.outerWidth();return o.remove(),i=Math.max(i,e.element.outerWidth())-n.dropdown.outerWidth+n.dropdown.width,i=Math.max(i,e.options.dropdownWidth||0),t.width(i),e.opened||(e.dropdown.detach(),e.dropdown.css("visibility","visible")),e},__position:function(){var e=this;if(e.opened){var t=e.selectbox,o=e.dropdown,n=t[0].getBoundingClientRect(),i={window:{height:a.height()},selectbox:{outerHeight:t.outerHeight()},dropdown:{outerHeight:o.outerHeight()}},s=n.top>a.height()-n.bottom?"top":"bottom";o.removeClass("ui-beauty-select-dropdown-"+("top"===s?"bottom":"top")).addClass("ui-beauty-select-dropdown-"+s),o.css({top:"bottom"===s?i.selectbox.outerHeight:-i.dropdown.outerHeight})}return e},__renderTitlebox:function(){var e=this,t=e.element[0],o=r(t.options[t.selectedIndex]);return e.titlebox.html(n(e,e.options.title,o,o.html())),e},__renderDropdown:function(){function e(e,t){var r=o===l,c={group:t,index:o++,text:e.html(),indexAttr:d.optionIndexAttr,className:e[0].disabled?d.optionDisabledClass:r?d.optionSelectedClass:""};i+=n(s,d.option,e,c)}function t(e){i+=n(s,d.optgroup,e,e.attr("label"))}var o=0,i="",s=this,d=s.options,l=s.element[0].selectedIndex,c=s.element.children();return c.each(function(){var o=r(this);switch(this.nodeName.toLowerCase()){case"option":e(o);break;case"optgroup":t(o),o.children().each(function(){e(r(this),o)})}}),s.dropdown.html(n(s,d.dropdown,c,i)),s},__refreshSelectbox:function(){var e=this,t=e.element[0],o=e.selectbox,n=d.activeElement();return n=e.opened||n===t||n===o[0]||r.contains(o[0],n),o.toggleClass("ui-beauty-select-disabled",t.disabled).toggleClass("ui-beauty-select-focus",n),e},__refreshSelected:function(){var e=this,t=e.options,o=e.dropdown,n=t.optionSelectedClass,i=e.element[0].selectedIndex;o.find("."+n).removeClass(n);var s=o.find("["+t.optionIndexAttr+"="+i+"]");return s.addClass(n),l(s[0]),e},__beauty:function(){var e=this,t=e.element;if(!i.get(t)){t.addClass("ui-beauty-select-hidden");var o=r('<div role="combobox" tabindex="-1" class="ui-beauty-select"/>');e.titlebox=r('<div class="ui-beauty-select-titlebox"/>'),e.dropdown=r('<div role="listbox" class="ui-beauty-select-dropdown"/>'),o.append(e.titlebox).insertAfter(e.element),e.selectbox=o,c++,t.data("beauty-select",e)}return e.refresh()},focus:function(){return this.element.trigger("focus"),this},blur:function(){return this.element.trigger("blur"),this},enable:function(){return this.element[0].disabled=!1,this.__refreshSelectbox()},disable:function(){return this.element[0].disabled=!0,this.__refreshSelectbox()},refresh:function(){var e=this;return e.__sizeSelectbox(),e.__renderTitlebox(),e.__renderDropdown(),e.__sizeDropdown(),e.__refreshSelectbox()},select:function(e){var t=this,o=t.element[0],n=o.selectedIndex;return e>>>=0,o.selectedIndex=e,n!==e&&t.element.trigger("change"),this.__renderTitlebox()},open:function(){var e=this;return e.opened?e:(e.opened=!0,u!==e&&(u.opened&&u.close(),u.__refreshSelectbox()),u=e,e.selectbox.addClass("ui-beauty-select-opened"),e.dropdown.appendTo(e.selectbox),e.__position(),e.__refreshSelected(),e)},close:function(){var e=this;return e.opened&&(e.opened=!1,e.dropdown.detach(),e.selectbox.removeClass("ui-beauty-select-opened")),e},destroy:function(){var e=this;if(!e.destroyed){var t=e.type,o=e.element,n=".beauty-"+t;e.selectbox.off(),e.element.off("keypress"+n),e.selectbox.remove(),e.dropdown.remove(),o.removeData("beauty-select"),o.removeClass("ui-beauty-select-hidden"),c--,c||(p.off("change"+n),p.off("focusin"+n),p.off("focusout"+n),p.off("mousedown"+n),p.off("keydown"+n),a.off("resize"+n)),e.destroyed=!0}}},r.fn.selectbox=function(){var e,t,o=this,n=[].slice.call(arguments,1);return e=t=arguments[0],o.each(function(){var o=i.get(this);o||(o=new i(this,t)),"string"===r.type(e)&&o[e]&&o[e].apply(o,n)})},o.exports=r});