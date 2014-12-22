define(["jquery", "app/simplelayout/utils", "app/simplelayout/templateHelper", "jqueryui/resizable"], function($, utils, tmplHelper) {

  'use strict';

  function Block(type) {

    if (!(this instanceof Block)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }
    if (!type) {
      throw new TypeError("type must be defined");
    }

    var RESIZABLE_SETTINGS = {
      handles: "s",
      grid: [utils.getGrid().x, 1],
      start: function(e, ui) {
        $(ui.element).css('z-index', 2);
      },
      stop: function(e, ui) {
        $(ui.element).css('z-index', 1);
      },
      resize : function(e ,ui) {
      }
    };

    function bindEvents(element) {
      unbindEvents(element);
      element.resizable(RESIZABLE_SETTINGS);
    }

    function unbindEvents(element) {
      if (element.resizable('instance')) {
        element.resizable('destroy');
      }
    }


    return {
      create: function(data, fn) {
        var that = this;
        $.when(tmplHelper.getTemplate(type)).done(function() {
          var element = $($.templates[type].render(data));
          bindEvents(element);
          fn(element);
        });
      }
    };

  }
  return Block;

});
