define(["jquery", "config", "jqueryui/draggable", "jqueryui/sortable", "jqueryui/droppable"], function($, CONFIG, UI) {
  var toolbox = {},
    dragSettings = {
      helper: "clone",
      cursor: "pointer"
    },
    trashDropSettings = {
      over : function(e, ui) {
        ui.draggable.addClass('deleted');
      },
      drop : function(e, ui) {
        if(ui.draggable.children('.sl-column').length === 0) {
          ui.draggable.remove();
        }
      },
      out : function(e, ui) {
        ui.draggable.removeClass('deleted');
      }
    },
    loadComponents = function(path) {
      if (!path) {
        toolbox.components = CONFIG.toolbox.components;
        toolbox.layouts = CONFIG.toolbox.layouts;
      } else {
        var componentRequest = $.get(path);
        // TODO: lod components from URL
      }
      $.each(toolbox.components, function(idx, el) {
        var component = $('<a>').addClass('list-group-item tb-component tb-draggable').text(el.title).attr('data-type', el.type);
        var icon = $('<i>').addClass(el.icon);
        component.prepend(icon);
        toolbox.append(component);
      });
      $.each(toolbox.layouts, function(idx, el) {
        var layout = $('<a>').addClass('list-group-item tb-layout tb-draggable').text(el.columns + " - Spalten Layout").attr('data-columns', el.columns);
        var icon = $('<i>').addClass(el.icon);
        layout.prepend(icon);
        toolbox.append(layout);
      });
      var trash = $('<a>').addClass('list-group-item trash tb-droppable');
      var icon = $('<i>').addClass('glyphicon glyphicon-trash');
      trash.append(icon);

      toolbox.append(trash);
    },
    bindEvents = function() {
      unbindEvents();
      toolbox.children('.tb-draggable').draggable(dragSettings);
      toolbox.children('.tb-droppable').droppable(trashDropSettings);
    },
    unbindEvents = function() {
      if (toolbox.children('.tb-draggable').draggable('instance')) {
        toolbox.children('.tb-draggable').draggable('destroy');
      }
      if (toolbox.children('.tb-droppable').draggable('instance')) {
        toolbox.children('.tb-droppable').draggable('destroy');
      }
    };

  toolbox.init = function(selector, path) {
    if (!selector) {
      throw "InvalidArgumentException (selector): " + selector;
    }
    toolbox = $(selector);
    toolbox.addClass('list-group tb-toolbox');
    loadComponents(path);
    bindEvents();
  };

  return toolbox;

});
