define(["jquery", "config", "app/simplelayout/templateHelper", "jqueryui/draggable", "jqueryui/sortable", "jqueryui/droppable"], function($, CONFIG, tmplHelper) {

  'use strict';

  function Toolbox() {

    if (!(this instanceof Toolbox)) {
      throw new TypeError("Toolbox constructor cannot be called as a function.");
    }

    var element = null;

    var DRAG_SETTINGS = {
      helper: "clone",
      cursor: "pointer"
    };

    var DROP_SETTINGS = {
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

    function build(components) {
      $.when(tmplHelper.getTemplate("toolbox")).done(function() {
        var element = $($.templates.toolbox.render(components));
        bindEvents(element);
        $('body').append(element);
      });
    }

    function bindEvents(element) {
      unbindEvents(element);
      element.children('.tb-draggable').draggable(DRAG_SETTINGS);
      element.children('.tb-droppable').droppable(DROP_SETTINGS);
    }

    function unbindEvents(element) {
      if (element.children('.tb-draggable').draggable('instance')) {
        element.children('.tb-draggable').draggable('destroy');
      }
      if (element.children('.tb-droppable').draggable('instance')) {
        element.children('.tb-droppable').draggable('destroy');
      }
    }

    return {
      loadComponents: function(path) {
        var componentRequest = $.getJSON(path);
        componentRequest.done(function(data) {
          build(data);
        });
        componentRequest.fail(function(statusMessage) {
          throw "RequstException: " + statusMessage;
        });
      }
    };

  }
  return Toolbox;

});
