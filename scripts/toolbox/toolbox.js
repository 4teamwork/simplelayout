define(["jquery", "config", "jqueryui/draggable"], function($, CONFIG, UI) {
  var toolbox = {},
    element = null,
    components = null,
    dragComponent = function(e, ui) {
      element.trigger('start');
    },
    dragSettings = {
      helper: "clone",
      start: function(e, ui){dragComponent(e, ui);}
    },
    loadComponents = function(path) {
      var components;
      if (!path) {
        components = CONFIG.toolbox.components;
      } else {
        var componentRequest = $.get(path);
        // TODO: lod components from URL
      }
      $.each(components, function(idx, el) {
        // TODO: allow template
        var component = $('<a>').addClass('list-group-item').text(el.title).attr('data-type', el.type);
        element.append(component);
      });
    },
    bindEvents = function() {
      unbindEvents();
      element.children('a').draggable(dragSettings);
    },
    unbindEvents = function() {
      if (element.children('a').draggable('instance')) {
        element.children('a').draggable('destroy');
      }
    };

  toolbox.init = function(selector, path) {
    if(!selector) {
      throw "InvalidArgumentException (selector): " + selector;
    }
    element = $(selector);
    element.addClass('list-group toolbox');
    loadComponents(path);
    bindEvents();
    return element;
  };

  return toolbox;

});
