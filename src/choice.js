/*!
 * Choice
 * Date: 2015/06/07
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

import $ from 'jquery';
import Observer from './observer';
import { doc, activeElement } from './util';

var reference = 0;

/**
 * radio
 *
 * @param element
 */
function radio(element) {
  doc.find('input[type=radio][name=' + element.name + ']').each(function() {
    var choice = Choice.get(this);

    if (choice && element !== this) {
      choice.refresh();
    }
  });
}

/**
 * Choice
 *
 * @param element
 * @constructor
 */
export default function Choice(element) {
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
 * get
 *
 * @param element
 * @returns {*}
 */
Choice.get = function(element) {
  element = $(element);

  return element.data('beauty-choice');
};

/**
 * Choice.prototype
 *
 * @type {{
 *   init: Choice.init,
 *   focus: Choice.focus,
 *   blur: Choice.blur,
 *   check: Choice.check,
 *   uncheck: Choice.uncheck,
 *   enable: Choice.enable,
 *   disable: Choice.disable,
 *   refresh: Choice.refresh,
 *   beauty: Choice.beauty,
 *   destory: Choice.destory
 * }}
 */
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

    context.observer.watch('checked', refresh);
    context.observer.watch('disabled', refresh);
    context.observer.watch('indeterminate', refresh);

    if (!reference) {
      var node = context.element[0];
      var namespace = '.beauty-' + type;
      var selector = 'input[type=' + type + ']';

      doc.on('change' + namespace, selector, refresh);
      doc.on('focusin' + namespace, selector, refresh);
      doc.on('focusout' + namespace, selector, refresh);
    }

    return context.__beauty();
  },
  __beauty: function() {
    var context = this;
    var element = context.element;

    if (!Choice.get(element)) {
      var type = context.type;

      element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + type + '"/>');

      context.choice = element.parent();

      context.choice.attr('role', context.choice.type);

      element.data('beauty-choice', context);

      reference++;
    }

    return context.refresh();
  },
  refresh: function() {
    var context = this;
    var element = context.element[0];
    var indeterminate = element.indeterminate;

    context.choice
      .toggleClass('ui-beauty-choice-disabled', element.disabled)
      .toggleClass('ui-beauty-choice-indeterminate', indeterminate)
      .toggleClass('ui-beauty-choice-focus', activeElement() === element)
      .toggleClass('ui-beauty-choice-checked', !indeterminate && element.checked);

    return context;
  },
  destroy: function() {
    var context = this;

    if (context.destroyed) return;

    var type = context.type;
    var element = context.element;

    element.unwrap();
    element.removeData('beauty-choice');

    context.observer.unwatch('checked');
    context.observer.unwatch('disabled');
    context.observer.unwatch('indeterminate');

    if (!--reference) {
      var namespace = '.beauty-' + type;

      doc.off('change' + namespace);
      doc.off('focusin' + namespace);
      doc.off('focusout' + namespace);
    }

    context.destroyed = true;
  }
};
