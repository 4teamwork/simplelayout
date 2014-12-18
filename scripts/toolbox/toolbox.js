define(["jquery", "config", "jqueryui/draggable", "jqueryui/sortable"], function($, CONFIG, UI) {
  var toolbox = {},
    dragSettings = {
      helper: "clone",
      cursor: "pointer"
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
        var component = $('<a>').addClass('list-group-item tb-component').text(el.title).attr('data-type', el.type);
        var icon = $('<i>').addClass(el.icon);
        component.prepend(icon);
        toolbox.append(component);
      });
      $.each(toolbox.layouts, function(idx, el) {
        var layout = $('<a>').addClass('list-group-item tb-layout').text(el.columns + " - Spalten Layout").attr('data-columns', el.columns);
        var icon = $('<i>').addClass(el.icon);
        layout.prepend(icon);
        toolbox.append(layout);
      });
    },
    bindEvents = function() {
      unbindEvents();
      toolbox.children('a').draggable(dragSettings);
    },
    unbindEvents = function() {
      if (toolbox.children('a').draggable('instance')) {
        toolbox.children('a').draggable('destroy');
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
