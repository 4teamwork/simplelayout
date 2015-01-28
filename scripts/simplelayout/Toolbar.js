define([], function() {

  'use strict';

  function Toolbar(_actions) {

    if (!(this instanceof Toolbar)) {
      throw new TypeError("Toolbar constructor cannot be called as a function.");
    }

    var defaultActions = [{name: 'move', description: 'Move this block arround'}];

    var actions = $.merge(defaultActions, _actions || []);

    var template = $.templates(
      "<ul class='sl-toolbar'> \
        {{for actions}} \
          <li><a class='{{:name}} icon-{{:name}}' title='{{:description}}'></a></li> \
          <li class='delimiter'></li> \
        {{/for}} \
      </ul>"
    );

    var element = $(template.render({actions : actions}));

    var keepVisible = false;

    return {

      element : element,

      getElement: function() {
        return this.element;
      },

      show : function() {
        this.element.show();
      },

      hide : function() {
        if(!keepVisible) {
          this.element.hide();
        }
      },

      keepVisible : function(_keepVisible) {
        keepVisible = _keepVisible;
      }

    };

  }
  return Toolbar;

});
