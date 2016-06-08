define("selectbox", ["jquery","./popup"], function(require, exports, module){
/*!
 * selectbox
 * Date: 2014-01-10
 * https://github.com/aui/popupjs
 * (c) 2009-2013 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */

'use strict';

var $ = require('jquery'),
  Popup = require('./popup'),
  isIE6 = !('minWidth' in document.createElement('div').style);

/**
 * 下来框类
 * @param select
 * @param options
 * @constructor
 */
function Selectbox(select, options){
  var that = this,
    selectboxHtml;

  $.extend(this, options || {});

  select = this.select = $(select);

  if (select.is('[multiple]')) {
    return;
  }

  if (select.data('selectbox')) {
    // 删除上一次的 selectbox 以重新更新
    select.data('selectbox').remove();
  }

  selectboxHtml = this._tpl(this.selectboxHtml, $.extend({
    textContent: that._getOption().html() || ''
  }, select.data()));

  this._selectbox = $(selectboxHtml);
  this._value = this._selectbox.find('[data-value]');

  // selectbox 的事件绑定
  if (this.isShowDropdown && !select.attr('disabled')) {
    this._globalKeydown = $.proxy(this._globalKeydown, this);

    this._selectbox
      .on(this._clickType + ' focus blur', function (event){
        that[that._clickType === event.type ? 'click' : event.type]();
      });
  }

  this._selectbox
    .css({
      width: select.outerWidth()
    });

  // 克隆原生 select 的基本 UI 事件
  select
    .on('focus blur', function (event){
      that[event.type]();
      event.preventDefault();
    })
    .on('change', function (){
      var text = that._getOption().html();
      that._value.html(text);
    });

  // 隐藏原生 select
  // 盲人仍然可以通过 tab 键访问到原生控件
  // iPad 与 iPhone 等设备点击仍然能够使用滚动操作 select
  select.css({
    opacity: 0,
    position: 'absolute',
    left: isIE6 ? '-9999px' : 'auto',
    right: 'auto',
    top: 'auto',
    bottom: 'auto',
    zIndex: this.isShowDropdown ? -1 : 1
  }).data('selectbox', this);

  // 代替原生 select
  select.after(this._selectbox);
}

// 继承 Popup 类
var popup = function (){};
popup.prototype = Popup.prototype;
Selectbox.prototype = new popup();

// 添加原型方法
$.extend(Selectbox.prototype, {
  selectboxHtml: ''
  + '<div class="ui-selectbox" hidefocus="true" style="user-select:none" onselectstart="return false" tabindex="-1" aria-hidden>'
  + '<div class="ui-selectbox-inner" data-value="">{{textContent}}</div>'
  + '<i class="ui-selectbox-icon"></i>'
  + '</div>',
  dropdownHtml: '<dl>{{options}}</dl>',
  optgroupHtml: '<dt class="ui-selectbox-optgroup">{{label}}</dt>',
  optionHtml: '<dd class="ui-selectbox-option {{className}}" data-option="{{index}}" tabindex="-1">{{textContent}}</dd>',
  selectedClass: 'ui-selectbox-selected',
  disabledClass: 'ui-selectbox-disabled',
  focusClass: 'ui-selectbox-focus',
  className: 'ui-selectbox-dropdown',
  openClass: 'ui-selectbox-open',
  // 移动端不使用模拟下拉层
  isShowDropdown: !('createTouch' in document),
  selectedIndex: 0,
  value: '',
  /**
   * 关闭
   */
  close: function (){
    if (this._popup) {
      this._popup.close().remove();
      this.change();
    }
  },
  /**
   * 显示
   * @returns {boolean}
   */
  show: function (){
    var that = this,
      select = this.select,
      selectbox = that._selectbox;

    if (!select[0].length) {
      return false;
    }

    var MARGIN = 20,
      selectHeight = select.outerHeight(),
      topHeight = select.offset().top - $(document).scrollTop(),
      bottomHeight = $(window).height() - topHeight - selectHeight,
      maxHeight = Math.max(topHeight, bottomHeight) - MARGIN,
      popup = this._popup = new Popup();

    popup.node.innerHTML = this._dropdownHtml();
    this._dropdown = $(popup.node);

    $(popup.backdrop)
      .css('opacity', 0)
      .on(this._clickType, $.proxy(this.close, this));

    var children = that._dropdown.children();

    children.css({
      minWidth: selectbox.innerWidth(),
      maxHeight: maxHeight,
      overflowY: 'auto',
      overflowX: 'hidden'
    });

    this._dropdown
      .on(this._clickType, '[data-option]', function (event){
        var index = $(this).data('option');
        that.selected(index);
        that.close();

        event.preventDefault();
      });

    popup.onshow = function (){
      $(document).on('keydown', that._globalKeydown);
      selectbox.addClass(that.openClass);
      that.selectedIndex = select[0].selectedIndex;
      that.selected(that.selectedIndex);
    };

    popup.onremove = function (){
      $(document).off('keydown', that._globalKeydown);
      selectbox.removeClass(that.openClass);
    };

    // 记录展开前的 value
    this._oldValue = this.select.val();

    popup.showModal(selectbox[0]);

    if (isIE6) {
      children.css({
        width: Math.max(selectbox.innerWidth(), children.outerWidth()),
        height: Math.min(maxHeight, children.outerHeight())
      });

      popup.reset();
    }
  },
  /**
   * 设置激活项
   * @param index
   * @returns {boolean}
   */
  selected: function (index){
    // 检查当前项是否被禁用
    if (this._getOption(index).attr('disabled')) {
      return false;
    }

    var dropdown = this._dropdown,
      option = this._dropdown.find('[data-option=' + index + ']'),
      value = this.select[0].options[index].value,
      oldIndex = this.select[0].selectedIndex,
      selectedClass = this.selectedClass;

    // 更新选中状态样式
    dropdown.find('[data-option=' + oldIndex + ']').removeClass(selectedClass);
    option.addClass(selectedClass);
    option.focus();

    // 更新模拟控件的显示值
    this._value.html(this._getOption(index).html());
    // 更新 Selectbox 对象属性
    this.value = value;
    this.selectedIndex = index;

    // 同步数据到原生 select
    this.select[0].selectedIndex = this.selectedIndex;
    this.select[0].value = this.value;

    return true;
  },
  /**
   * 改变事件
   */
  change: function (){
    if (this._oldValue !== this.value) {
      this.select.triggerHandler('change');
    }
  },
  /**
   * 单击事件
   */
  click: function (){
    this.select.focus();

    if (this._popup && this._popup.open) {
      this.close();
    } else {
      this.show();
    }
  },
  /**
   * 获得焦点事件
   */
  focus: function (){
    this._selectbox.addClass(this.focusClass);
  },
  /**
   * 失去焦点事件
   */
  blur: function (){
    this._selectbox.removeClass(this.focusClass);
  },
  /**
   * 移除
   */
  remove: function (){
    this.close();
    this._selectbox.remove();
  },
  /**
   * 单击类型
   */
  _clickType: 'onmousedown' in document ? 'mousedown' : 'touchstart',
  /**
   * 获取原生 select 的 option jquery 对象
   * @param index
   * @returns {*}
   * @private
   */
  _getOption: function (index){
    index = index === undefined ? this.select[0].selectedIndex : index;
    return this.select.find('option').eq(index);
  },
  /**
   * 简单模板替换
   * @param tpl
   * @param data
   * @returns {XML|string|void}
   * @private
   */
  _tpl: function (tpl, data){
    return tpl.replace(/{{(.*?)}}/g, function ($1, $2){
      return data[$2];
    });
  },
  /**
   * 获取下拉框的 HTML
   * @returns {XML|string|void}
   * @private
   */
  _dropdownHtml: function (){
    var options = '',
      that = this,
      select = this.select,
      selectData = select.data(),
      index = 0,
      getOptionsData = function ($options){
        $options.each(function (){
          var $this = $(this),
            className = '';

          if (this.selected) {
            className = that.selectedClass;
          } else {
            className = this.disabled ? that.disabledClass : '';
          }

          options += that._tpl(that.optionHtml, $.extend({
            value: $this.val(),
            // 如果内容类似： "&#60;s&#62;选项&#60;/s&#62;" 使用 .text() 会导致 XSS
            // 另外，原生 option 不支持 html 文本
            textContent: $this.html(),
            index: index,
            className: className
          }, $this.data(), selectData));

          index++;
        });
      };

    if (select.find('optgroup').length) {
      select.find('optgroup').each(function (index){
        options += that._tpl(that.optgroupHtml, $.extend({
          index: index,
          label: this.label
        }, $(this).data(), selectData));

        getOptionsData($(this).find('option'));
      });
    } else {
      getOptionsData(select.find('option'));
    }

    return this._tpl(this.dropdownHtml, {
      options: options
    });
  },
  /**
   * 上下移动
   * @param n
   * @private
   */
  _move: function (n){
    var min = 0;
    var max = this.select[0].length - 1;
    var index = this.select[0].selectedIndex + n;

    if (index >= min && index <= max) {
      // 跳过带有 disabled 属性的选项
      if (!this.selected(index)) {
        this._move(n + n);
      }
    }
  },
  /**
   * 全局键盘监听
   * @param event
   * @private
   */
  _globalKeydown: function (event){
    var p;

    switch (event.keyCode) {
      // backspace
      case 8:
        p = true;
        break;
      // tab
      case 9:
      // esc
      case 27:
      // enter
      case 13:
        this.close();
        p = true;
        break;
      // up
      case 38:
        this._move(-1);
        p = true;
        break;
      // down
      case 40:
        this._move(1);
        p = true;
        break;
    }

    if (p) {
      event.preventDefault();
    }
  }
});

module.exports = function (elem, options){
  // 注意：不要返回 Selectbox 更多接口给外部，只保持装饰用途
  // 保证模拟的下拉是原生控件的子集，这样可以随时在项目中撤销装饰
  if (elem.type === 'select') {
    new Selectbox(elem, options);
  } else {
    $(elem).each(function (){
      new Selectbox(this, options);
    });
  }
};

});
