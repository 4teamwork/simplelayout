define([], function() {

  "use strict";

  function Toolbar(_actions) {

    if (!(this instanceof Toolbar)) {
      throw new TypeError("Toolbar constructor cannot be called as a function.");
    }

    var defaultActions = {
      move: {
        name: "move",
        description: "Move this block arround"
      }
    };

    var actions = $.extend(defaultActions, _actions || {});

    var normalizedActions = [];

    $.each(actions, function(key, value) {
      normalizedActions.push(value);
    });

    var template = $.templates(
      "<ul class='sl-toolbar'>{{for actions}}<li><a class='{{:name}} icon-{{:name}}' title='{{:description}}'></a></li><li class='delimiter'></li>{{/for}}</ul>"
    );

    var element = $(template.render({
      actions: normalizedActions
    }));

    return {

      element: element

    };

  }
  return Toolbar;

});
