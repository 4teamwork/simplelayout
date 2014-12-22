define(["jquery", "config", "app/simplelayout/Layout", "jqueryui/droppable", "jqueryui/sortable"], function($, CONFIG, Layout) {

  'use strict';

  function Layoutmanager(element) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }
    if (!element) {
      throw new TypeError("element must be defined");
    }

    var currentLayout = null;


    var DROP_SETTINGS = {
      accept: ".tb-layout",
      over: placeLayout,
      out: cancel,
      drop: dropLayout
    };

    var SORTABLE_SETTINGS = {
      connectWith: '.sl-simplelayout',
      items: '.sl-layout',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
    };

    function cancel() {
      if (currentLayout) {
        currentLayout.remove();
      }
    }

    function placeLayout(e, ui) {
      addLayout(ui.draggable.attr('data-columns'));
    }

    function dropLayout() {
      currentLayout = null;
      element.sortable('refresh');
    }

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

    return {
      addLayout: addLayout,

      observe: function() {
        element.css('width', CONFIG.contentwidth);
        bindEvents(element);
      }
    };

  }

  return Layoutmanager;

});
