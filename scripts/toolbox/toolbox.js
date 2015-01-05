define(["jquery", "renderer", "jqueryui/draggable", "jqueryui/sortable", "jqueryui/droppable"], function($) {

  'use strict';

  function Toolbox(_options) {

    if (!(this instanceof Toolbox)) {
      throw new TypeError("Toolbox constructor cannot be called as a function.");
    }

    var element;

    var options = $.extend({
      'layouts': []
    }, _options);

    var layouts = [];
    $.each(options.layouts, function(i, el) {
      layouts.push({
        'columns': el
      });
    });

    var DRAGGABLE_SETTINGS = {
      helper: "clone",
      cursor: "pointer"
    };

    var DROPPABLE_SETTINGS = {
      accept: '.sl-layout, .sl-block',
      tolerance: 'touch',
      over: function(e, ui) {
        ui.draggable.addClass('deleted');
        if (ui.draggable.find('.sl-block').length > 0) {
          ui.draggable.addClass('cancelDeletion');
        }
      },
      drop: function(e, ui) {
        if (ui.draggable.find('.sl-block').length === 0) {
          ui.draggable.remove();
        }
        ui.draggable.removeClass('deleted');
        ui.draggable.removeClass('cancelDeletion');
      },
      out: function(e, ui) {
        ui.draggable.removeClass('deleted');
        ui.draggable.removeClass('cancelDeletion');
      }
    };

    var template = $.templates(
      "<div id='sl-toolbox' class='list-group sl-toolbox'> \
          <a class='list-group-item sl-header'>Komponenten</a> \
            {{for blocks}} \
              <a class='list-group-item sl-toolbox-component sl-draggable' data-type='{{:type}}'> \
                <i class='{{:icon}}'></i>{{:title}} \
              </a> \
            {{/for}} \
          <a class='list-group-item sl-header'>Layout</a> \
            {{for layouts}} \
              <a class='list-group-item sl-toolbox-layout sl-draggable' data-columns='{{:columns}}'> \
                <i class='glyphicon glyphicon-th'></i>{{:columns}} - Spalten Layout \
              </a> \
             {{/for}} \
          <a class='list-group-item sl-trash sl-droppable ui-droppable'> \
            <i class='glyphicon glyphicon-trash'></i> \
          </a> \
        </div>");

    var components = {
      "blocks": [{
        "type": "listingblock",
        "title": "Listingblock",
        "icon": "glyphicon glyphicon-list-alt"
      }, {
        "type": "textblock",
        "title": "Textblock",
        "icon": "glyphicon glyphicon-align-left"
      }],
      "layouts": layouts
    };

    function bindEvents(element) {
      unbindEvents(element);
      element.children('.sl-draggable').draggable(DRAGGABLE_SETTINGS);
      element.children('.sl-droppable').droppable(DROPPABLE_SETTINGS);
    }

    function unbindEvents(element) {
      if (element.children('.sl-draggable').draggable('instance')) {
        element.children('.sl-draggable').draggable('destroy');
      }
      if (element.children('.sl-droppable').draggable('instance')) {
        element.children('.sl-droppable').draggable('destroy');
      }
    }

    return {

      attachTo: function(target) {
        element = $(template.render(components));
        target.append(element);
        bindEvents(element);
      },

      deleteComponent: function(component) {
        if (component.getElement().hasClass('sl-layout') && component.getElement().find('.sl-block').length > 0) {
          throw new Error('Layout is not empty');
        }
        component.getElement().remove();
      }

    };

  }
  return Toolbox;

});
