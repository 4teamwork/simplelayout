define(["jquery", "app/simplelayout/Layout", "jqueryui/droppable", "jqueryui/sortable"], function($, Layout) {

  'use strict';

  function Layoutmanager(options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    options = $.extend({
      width : '100%'
    }, options || {});

    var element = $("<div>").addClass('sl-simplelayout').css('width', options.width);

    function bindEvents(element) {
      unbindEvents(element);
      element.droppable(DROP_SETTINGS);
      element.sortable(SORTABLE_SETTINGS);
    }

    function unbindEvents(element) {
      if (element.droppable('instance')) {
        element.droppable('destroy');
      }
      if (element.sortable('instance')) {
        element.sortable('destroy');
      }
    }

    function addLayout(columns) {
      currentLayout = new Layout(columns).create();
      element.append(currentLayout);
    }

    var layouts = [];

    return {
      insertLayout: function(layout) {
        if (this.currentLayout) {
          throw new Error('Layout already inserted.');
        }
        this.currentLayout = layout;
        element.append(layout.getElement());
      },

      commitLayout: function() {
        layouts.push(this.currentLayout);
        this.currentLayout = null;
      },

      rollbackLayout: function() {
        if (!this.currentLayout) {
          throw new Error('No layout inserted.');
        }
        this.currentLayout.getElement().remove();
        this.currentLayout = null;
      },

      attachTo: function(target) {
        target.append(element);
      },

      getElement : function() {
        return element;
      },

      getLayouts : function() {
        return layouts;
      }

    };

  }

  return Layoutmanager;

});
