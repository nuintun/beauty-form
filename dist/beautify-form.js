/**
 * @module beautify-form
 * @author nuintun
 * @license MIT
 * @version 2017/08/29
 * @description Beautify the web forms.
 * @see https://github.com/nuintun/beautify-form
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define('beautify-form', ['jquery'], factory) :
  (global.BeautifyForm = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  /**
   * @module observer
   * @license MIT
   * @version 2017/08/30
   */

  var defineProperty = Object.defineProperty;
  var getPrototypeOf = Object.getPrototypeOf;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getNodeDescriptor = getPrototypeOf
    ? function(node, prop) {
        return (
          getOwnPropertyDescriptor(getPrototypeOf(node), prop) ||
          getOwnPropertyDescriptor(HTMLElement.prototype, prop) ||
          getOwnPropertyDescriptor(Element.prototype, prop) ||
          getOwnPropertyDescriptor(Node.prototype, prop)
        );
      }
    : function(node, prop) {
        var prototype = Element.prototype;
        var owner = hasOwnProperty.call(prototype, prop);

        if (!owner) {
          prototype = node.constructor.prototype;
          owner = hasOwnProperty.call(prototype, prop);
        }

        // IE8 not returned undefined with non own property
        if (owner) {
          return getOwnPropertyDescriptor(prototype, prop);
        }
      };

  function Observer(node) {
    this.node = node;
  }

  Observer.prototype = {
    watch: function(prop, handler) {
      var node = this.node;
      var descr = getNodeDescriptor(node, prop);

      if (descr && (descr.set || descr.get)) {
        var config = {
          configurable: true,
          enumerable: descr.enumerable
        };

        if (descr.set) {
          config.set = function(value) {
            var node = this;
            var stale = node[prop];

            if (stale !== value) {
              descr.set.call(node, value);
              handler.call(node, stale, value);
            }

            return value;
          };
        }

        if (descr.get) {
          // IE8 can't direct use: config.get = descr.get
          config.get = function() {
            return descr.get.call(this);
          };
        }

        defineProperty(node, prop, config);
      }

      return this;
    },
    unwatch: function(prop) {
      delete this.node[prop];

      return this;
    }
  };

  /**
   * @module util
   * @license MIT
   * @version 2016/06/14
   */

  var win = $(window);
  var doc = $(document);

  /**
   * @function activeElement
   * @description 获取当前焦点的元素
   * @returns {undefined|HTMLElement}
   */
  function activeElement() {
    try {
      // Try: ie8~9, iframe #26
      var activeElement = document.activeElement;
      var contentDocument = activeElement.contentDocument;

      return (contentDocument && contentDocument.activeElement) || activeElement;
    } catch (e) {
      // Do nothing
    }
  }

  /**
   * @module choice
   * @license MIT
   * @version 2015/06/07
   */

  var reference = {};

  /**
   * @function radio
   * @param {HTMLElement} element
   */
  function radio(element) {
    doc.find('input[type=radio][name=' + element.name + ']').each(function(index, radio) {
      var choice = Choice.get(radio);

      if (choice && element !== radio) {
        choice.refresh();
      }
    });
  }

  /**
   * @class Choice
   * @param {HTMLElement} element
   * @constructor
   */
  function Choice(element) {
    var context = this;

    context.destroyed = false;
    context.element = $(element);
    context.type = element.type;
    context.observer = new Observer(element);
    context.type = context.type ? context.type.toLowerCase() : undefined;

    var choice = Choice.get(element);

    if (choice) {
      return choice;
    }

    if (context.type !== 'checkbox' && context.type !== 'radio') {
      throw new TypeError('The element must be a checkbox or radio.');
    }

    context.__init();
  }

  /**
   * @function get
   * @param {HTMLElement} element
   * @returns {Choice}
   */
  Choice.get = function(element) {
    element = $(element);

    return element.data('beautify-choice');
  };

  Choice.prototype = {
    __init: function() {
      var context = this;
      var type = context.type;

      function refresh() {
        var choice = Choice.get(this);

        if (choice) {
          type === 'radio' && radio(this);

          choice.refresh();
        }
      }

      context.observer.watch('checked', refresh).watch('disabled', refresh);

      if (type === 'checkbox') {
        context.observer.watch('indeterminate', refresh);
      }

      reference[type] = reference[type] || 0;

      if (!reference[type]) {
        var namespace = '.beautify-' + type;
        var selector = 'input[type=' + type + ']';

        doc
          .on('focusin' + namespace, selector, refresh)
          .on('change' + namespace, selector, refresh)
          .on('focusout' + namespace, selector, refresh);

        if (type === 'checkbox') {
          // If checkbox is indeterminate, IE8+ not fire change and indeterminate change event.
          doc.on('click' + namespace, selector, refresh);
        }
      }

      return context.__beautify();
    },
    __beautify: function() {
      var context = this;
      var type = context.type;
      var element = context.element;

      element.wrap('<i tabindex="-1" class="ui-beautify-choice ui-beautify-' + type + '"/>');

      context.choice = element.parent();

      context.choice.attr('role', type);

      element.data('beautify-choice', context);

      reference[type]++;

      return context.refresh();
    },
    refresh: function() {
      var context = this;
      var type = context.type;
      var choice = context.choice;
      var element = context.element[0];
      var indeterminate = element.indeterminate;

      choice
        .toggleClass('ui-beautify-choice-disabled', element.disabled)
        .toggleClass('ui-beautify-choice-focus', activeElement() === element);

      if (type === 'checkbox') {
        choice
          .toggleClass('ui-beautify-choice-checked', !indeterminate && element.checked)
          .toggleClass('ui-beautify-choice-indeterminate', indeterminate);
      } else {
        choice.toggleClass('ui-beautify-choice-checked', element.checked);
      }

      return context;
    },
    destroy: function() {
      var context = this;

      if (context.destroyed) return;

      var type = context.type;
      var element = context.element;

      element.unwrap().removeData('beautify-choice');

      context.observer.unwatch('checked').unwatch('disabled');

      if (type === 'checkbox') {
        context.observer.unwatch('indeterminate');

        element.off('click' + namespace);
      }

      if (!--reference[type]) {
        var namespace = '.beautify-' + type;

        doc
          .off('focusin' + namespace)
          .off('change' + namespace)
          .off('focusout' + namespace);

        if (type === 'checkbox') {
          doc.off('click' + namespace);
        }

        delete reference[type];
      }

      context.destroyed = true;
    }
  };

  /**
   * @module scrollintoviewifneeded
   * @license MIT
   * @version 2016/07/15
   */

  // Native
  var native = document.documentElement.scrollIntoViewIfNeeded;

  /**
   * @function scrollIntoViewIfNeeded
   * @param {HTMLElement} element
   * @param {boolean} centerIfNeeded
   */
  function scrollIntoViewIfNeeded(element, centerIfNeeded) {
    if (!element) {
      throw new Error('Element is required in scrollIntoViewIfNeeded');
    }

    // Use native
    if (native) {
      return element.scrollIntoViewIfNeeded(centerIfNeeded);
    }

    function withinBounds(value, min, max, extent) {
      if (false === centerIfNeeded || (max <= value + extent && value <= min + extent)) {
        return Math.min(max, Math.max(min, value));
      } else {
        return (min + max) / 2;
      }
    }

    function makeArea(left, top, width, height) {
      return {
        left: left,
        top: top,
        width: width,
        height: height,
        right: left + width,
        bottom: top + height,
        translate: function(x, y) {
          return makeArea(x + left, y + top, width, height);
        },
        relativeFromTo: function(lhs, rhs) {
          var newLeft = left,
            newTop = top;

          lhs = lhs.offsetParent;
          rhs = rhs.offsetParent;

          if (lhs === rhs) {
            return area;
          }

          for (; lhs; lhs = lhs.offsetParent) {
            newLeft += lhs.offsetLeft + lhs.clientLeft;
            newTop += lhs.offsetTop + lhs.clientTop;
          }

          for (; rhs; rhs = rhs.offsetParent) {
            newLeft -= rhs.offsetLeft + rhs.clientLeft;
            newTop -= rhs.offsetTop + rhs.clientTop;
          }

          return makeArea(newLeft, newTop, width, height);
        }
      };
    }

    var parent;
    var area = makeArea(element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight);

    while ((parent = element.parentNode) !== document) {
      var clientLeft = parent.offsetLeft + parent.clientLeft;
      var clientTop = parent.offsetTop + parent.clientTop;

      // Make area relative to parent's client area.
      area = area.relativeFromTo(element, parent).translate(-clientLeft, -clientTop);

      var scrollLeft = withinBounds(parent.scrollLeft, area.right - parent.clientWidth, area.left, parent.clientWidth);

      var scrollTop = withinBounds(parent.scrollTop, area.bottom - parent.clientHeight, area.top, parent.clientHeight);

      parent.scrollLeft = scrollLeft;
      parent.scrollTop = scrollTop;

      // Determine actual scroll amount by reading back scroll properties.
      area = area.translate(clientLeft - parent.scrollLeft, clientTop - parent.scrollTop);

      // Rewrite element
      element = parent;
    }
  }

  /**
   * @module selectbox
   * @license MIT
   * @version 2015/06/12
   */

  var timer;
  var reference$1 = 0;
  var actived = null;

  // Viewport size
  var VIEWPORT = {
    width: win.width(),
    height: win.height()
  };

  /**
   * @function compile
   * @param {any} context
   * @param {string} template
   * @returns {string}
   */
  function compile(context, template) {
    var args = [].slice.call(arguments, 2);
    var html = template.apply(context, args);

    if ($.type(html) === 'string') {
      return html;
    } else {
      throw new TypeError('Render function must return a string.');
    }
  }

  function SelectBox(element, options) {
    var context = this;

    context.type = 'select';
    context.opened = false;
    context.destroyed = false;
    context.element = $(element);
    context.observer = new Observer(element);

    if (element.multiple || element.size > 1) {
      return context;
    }

    options = $.extend(
      {
        title: function(element, text) {
          return (
            '<i class="ui-beautify-select-align-middle"></i>' +
            '<span class="ui-beautify-select-title" title="' +
            text +
            '">' +
            text +
            '</span><i class="ui-beautify-select-icon"></i>'
          );
        },
        dropdown: function(element, options) {
          return '<dl class="ui-beautify-select-dropdown-items">' + options + '</dl>';
        },
        optgroup: function(element, label) {
          return '<dt class="ui-beautify-select-optgroup" title="' + label + '">' + label + '</dt>';
        },
        option: function(element, option) {
          return (
            '<dd role="option" class="ui-beautify-select-option' +
            (option.group ? ' ui-beautify-select-optgroup-option' : '') +
            (option.className ? ' ' + option.className : '') +
            '" ' +
            option.indexAttr +
            '="' +
            option.index +
            '" title="' +
            option.text +
            '">' +
            option.text +
            '</dd>'
          );
        },
        dropdownWidth: null,
        optionIndexAttr: 'data-option',
        optionSelectedClass: 'ui-beautify-select-option-selected',
        optionDisabledClass: 'ui-beautify-select-option-disabled'
      },
      options
    );

    $.each(['title', 'dropdown', 'optgroup', 'option'], function(index, prop) {
      if ($.type(options[prop]) !== 'function') {
        throw new TypeError('Options.' + prop + ' must be a function.');
      }
    });

    context.options = options;

    context.__init();
  }

  /**
   * @function get
   * @param {HTMLElement} element
   * @returns {SelectBox}
   */
  SelectBox.get = function(element) {
    element = $(element);

    return element.data('beautify-select');
  };

  SelectBox.prototype = {
    __init: function() {
      var context = this;
      var type = context.type;
      var options = context.options;
      var namespace = '.beautify-' + type;

      actived = context;

      function change() {
        var selectbox = SelectBox.get(this);

        if (selectbox) {
          selectbox.__renderTitlebox();
          selectbox.opened && selectbox.__refreshSelected();
        }
      }

      function refresh() {
        var selectbox = SelectBox.get(this);

        selectbox && selectbox.__refreshSelectbox();
      }

      context.observer.watch('disabled', refresh).watch('selectedIndex', change);

      if (!reference$1) {
        var selector = 'select';

        doc
          .on('focusin' + namespace, selector, refresh)
          .on('change' + namespace, selector, change)
          .on('focusout' + namespace, selector, refresh)
          .on('mousedown' + namespace, function(e) {
            var target = e.target;
            var selectbox = actived.selectbox[0];

            if (target !== selectbox && !$.contains(selectbox, target) && actived.opened) {
              actived.close();
              actived.__refreshSelectbox();
            }
          })
          .on('keydown' + namespace, function(e) {
            if (e.which === 9 || e.which === 27) {
              actived.opened && actived.close();
              actived.__refreshSelectbox();
            }
          });

        win.on('resize' + namespace, function() {
          clearTimeout(timer);

          VIEWPORT.width = win.width();
          VIEWPORT.height = win.height();

          timer = setTimeout(function() {
            actived.opened && actived.__position();
          }, 0);
        });
      }

      context.__beautify();

      context.element.on('keypress' + namespace, function(e) {
        if (e.which === 13) {
          e.preventDefault();

          if (context.opened) {
            context.close();
          } else {
            context.open();
          }
        }
      });

      context.selectbox
        .on('mousedown' + namespace, function(e) {
          e.preventDefault();

          var select = context.element;

          if (select[0].disabled) return;

          if (context.opened) {
            var target = e.target;
            var dropdown = context.dropdown[0];

            if (dropdown !== target && !$.contains(dropdown, target)) {
              context.close();
            }
          } else {
            context.open();
          }

          setTimeout(function() {
            select.focus();
          }, 0);
        })
        .on('click' + namespace, '[' + options.optionIndexAttr + ']', function(e) {
          e.preventDefault();

          var option = $(this);

          if (option.hasClass(options.optionDisabledClass)) return;

          context.element[0].selectedIndex = option.attr(options.optionIndexAttr);

          context.close();
        });

      return context;
    },
    __sizeSelectbox: function() {
      var context = this;
      var element = context.element;
      var selectbox = context.selectbox;
      var width = element.outerWidth() - selectbox.outerWidth() + selectbox.width();
      var height = element.outerHeight() - selectbox.outerHeight() + selectbox.height();

      selectbox.width(width);
      selectbox.height(height);

      return context;
    },
    __sizeDropdown: function() {
      var context = this;

      if (!context.opened) {
        context.dropdown.css('visibility', 'hidden');
        context.dropdown.appendTo(context.selectbox);
      }

      var dropdown = context.dropdown;
      var clone = context.element.clone();
      var size = {
        dropdown: {
          width: dropdown.width(),
          outerWidth: dropdown.outerWidth()
        }
      };

      clone.css({
        position: 'absolute',
        visibility: 'hidden',
        width: 'auto',
        top: '-100%',
        left: '-100%'
      });

      clone.insertBefore(context.element);

      var width = clone.outerWidth();

      clone.remove();

      width = Math.max(width, context.element.outerWidth()) - size.dropdown.outerWidth + size.dropdown.width;
      width = Math.max(width, context.options.dropdownWidth || 0);

      dropdown.width(width);

      if (!context.opened) {
        context.dropdown.detach();
        context.dropdown.css('visibility', 'visible');
      }

      return context;
    },
    __position: function() {
      var context = this;

      if (context.opened) {
        var selectbox = context.selectbox;
        var dropdown = context.dropdown;
        var offset = selectbox[0].getBoundingClientRect();

        var size = {
          window: { height: win.height() },
          selectbox: { outerHeight: selectbox.outerHeight() },
          dropdown: { outerHeight: dropdown.outerHeight() }
        };

        var position = offset.top > win.height() - offset.bottom ? 'top' : 'bottom';

        dropdown
          .removeClass('ui-beautify-select-dropdown-' + (position === 'top' ? 'bottom' : 'top'))
          .addClass('ui-beautify-select-dropdown-' + position);

        dropdown.css({
          top: position === 'bottom' ? size.selectbox.outerHeight : -size.dropdown.outerHeight
        });
      }

      return context;
    },
    __renderTitlebox: function() {
      var template = '';
      var context = this;
      var selected = null;
      var element = context.element[0];
      var title = context.options.title;
      var selectedIndex = element.selectedIndex;

      if (selectedIndex >= 0) {
        selected = element.options[selectedIndex];
        template = selected.innerHTML;
      }

      context.titlebox.html(compile(context, title, selected, template));

      return context;
    },
    __renderDropdown: function() {
      var index = 0;
      var dropdown = '';
      var context = this;
      var options = context.options;
      var selectedIndex = context.element[0].selectedIndex;

      function option(element, group) {
        var selected = index === selectedIndex;
        var option = {
          group: group,
          index: index++,
          text: element.html(),
          indexAttr: options.optionIndexAttr,
          className: element[0].disabled ? options.optionDisabledClass : selected ? options.optionSelectedClass : ''
        };

        dropdown += compile(context, options.option, element, option);
      }

      function optgroup(element) {
        dropdown += compile(context, options.optgroup, element, element.attr('label'));
      }

      var items = context.element.children();

      items.each(function() {
        var element = $(this);

        switch (this.nodeName.toLowerCase()) {
          case 'option':
            option(element);
            break;
          case 'optgroup':
            optgroup(element);
            element.children().each(function() {
              option($(this), element);
            });
            break;
        }
      });

      context.dropdown.html(compile(context, options.dropdown, items, dropdown));

      return context;
    },
    __refreshSelectbox: function() {
      var context = this;
      var element = context.element[0];
      var selectbox = context.selectbox;
      var focused = activeElement();

      focused = context.opened || focused === element || focused === selectbox[0] || $.contains(selectbox[0], focused);

      selectbox
        .toggleClass('ui-beautify-select-disabled', element.disabled)
        .toggleClass('ui-beautify-select-focus', focused);

      return context;
    },
    __refreshSelected: function() {
      var context = this;
      var options = context.options;
      var dropdown = context.dropdown;
      var selectedClass = options.optionSelectedClass;
      var selectedIndex = context.element[0].selectedIndex;

      dropdown.find('.' + selectedClass).removeClass(selectedClass);

      var selected = dropdown.find('[' + options.optionIndexAttr + '=' + selectedIndex + ']');

      selected.addClass(selectedClass);

      selected = selected[0];

      selected && scrollIntoViewIfNeeded(selected);

      return context;
    },
    __beautify: function() {
      var context = this;
      var element = context.element;

      element.addClass('ui-beautify-select-hidden');

      var selectbox = $('<div role="combobox" tabindex="-1" class="ui-beautify-select"/>');

      context.titlebox = $('<div class="ui-beautify-select-titlebox"/>');
      context.dropdown = $('<div role="listbox" class="ui-beautify-select-dropdown"/>');

      selectbox.append(context.titlebox).insertAfter(context.element);

      context.selectbox = selectbox;

      element.data('beautify-select', context);

      reference$1++;

      return context.refresh();
    },
    refresh: function() {
      var context = this;

      context.__sizeSelectbox();
      context.__renderTitlebox();
      context.__renderDropdown();
      context.__sizeDropdown();

      return context.__refreshSelectbox();
    },
    open: function() {
      var context = this;

      if (context.opened) return context;

      context.opened = true;

      if (actived !== context) {
        actived.opened && actived.close();
        actived.__refreshSelectbox();
      }

      actived = context;

      context.selectbox.addClass('ui-beautify-select-opened');
      context.dropdown.appendTo(context.selectbox);
      context.__position();
      context.__refreshSelected();

      return context;
    },
    close: function() {
      var context = this;

      if (context.opened) {
        context.opened = false;

        context.dropdown.detach();
        context.selectbox.removeClass('ui-beautify-select-opened');
      }

      return context;
    },
    destroy: function() {
      var context = this;

      if (!context.destroyed) {
        var type = context.type;
        var element = context.element;
        var namespace = '.beautify-' + type;

        context.element.off('keypress' + namespace);
        context.selectbox.off().remove();
        context.dropdown.remove();

        element.removeData('beautify-select').removeClass('ui-beautify-select-hidden');

        context.observer.unwatch('disabled').unwatch('selectedIndex');

        if (!--reference$1) {
          doc
            .off('focusin' + namespace)
            .off('change' + namespace)
            .off('focusout' + namespace)
            .off('mousedown' + namespace)
            .off('keydown' + namespace);

          win.off('resize' + namespace);
        }

        context.destroyed = true;
      }
    }
  };

  /**
   * @module index
   * @license MIT
   * @version 2017/08/29
   */

  function create(Class) {
    return function(method, options) {
      if (method === 'api') {
        return Class.get(this[0]);
      }

      var args = arguments;

      if (args.length > 1) {
        options = [].slice.call(args, 1);
      }

      options = options || [];

      return this.each(function(index, element) {
        var api = Class.get(element);

        if (!api) {
          // If not init, options = method
          api = new Class(element, method);
        }

        // Call method
        if (api[method]) {
          api[method].apply(api, options);
        }
      });
    };
  }

  $.fn.checkbox = create(Choice);
  $.fn.radiobox = create(Choice);
  $.fn.selectbox = create(SelectBox);

  var index = {
    CheckBox: Choice,
    RadioBox: Choice,
    SelectBox: SelectBox
  };

  return index;

})));
