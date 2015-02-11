define([], function() {

  "use strict";

  function Toolbar(_actions) {

    if (!(this instanceof Toolbar)) {
      throw new TypeError("Toolbar constructor cannot be called as a function.");
    }

    var defaultActions = {
      move: {
        "class": "move icon-move",
        "title": "Move this block arround."
      },
      remove: {
        "class": "remove icon-remove",
        "title": "Remove this block."
      }
    };

    var actions = $.extend(defaultActions, _actions || {});

    var normalizedActions = [];

    $.each(actions, function(key, value) {
      normalizedActions.push(value);
    });

    var template = $.templates(
      "<ul class='sl-toolbar'>{{for actions}}<li><a {{props}} {{>key}}='{{>prop}}' {{/props}}></a></li><li class='delimiter'></li>{{/for}}</ul>"
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
