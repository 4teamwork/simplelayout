define([], function() {

  "use strict";

  function Toolbar(_actions, orientation) {

    if (!(this instanceof Toolbar)) {
      throw new TypeError("Toolbar constructor cannot be called as a function.");
    }

    var defaultActions = {};

    var actions = $.extend(defaultActions, _actions || {});

    var normalizedActions = [];

    $.each(actions, function(key, value) {
      normalizedActions.push(value);
    });

    var template = $.templates(
      "<ul class='sl-toolbar{{if orientation}} {{:orientation}}{{/if}}'>{{for actions}}<li><a {{props}} {{>key}}='{{>prop}}' {{/props}}></a></li><li class='delimiter'></li>{{/for}}</ul>"
    );

    var element = $(template.render({
      actions: normalizedActions,
      orientation: orientation
    }));

    return {

      element: element

    };

  }
  return Toolbar;

});
