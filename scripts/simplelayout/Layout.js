define(['jquery', 'config', 'app/simplelayout/Block', 'jqueryui/droppable', 'jqueryui/sortable'], function($, CONFIG, Block) {

  'use strict';

  function Layout(columns) {
    if (!(this instanceof Layout)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }
    if (!columns) {
      throw new TypeError("columns must be defined");
    }

    var currentBlock = null;
    var currentColumn = null;
    var element = null;

    var SORTABLE_SETTINGS = {
      connectWith: '.sl-column, .tb-trash',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      distance: 1
    };

    var DROPPABLE_SETTINGS = {
      accept: '.tb-component',
      drop: dropBlock,
      over: function(e, ui) {
        var that = this;
        // Hack: Out is called before over so the timeout fix
        window.setTimeout(function() {
          placeBlock.call(that, e, ui);
        }, 1);
      },
      out: cancel
    };

    function dropBlock() {
      currentBlock = null;
      element.children('.sl-column').sortable('refresh');
    }

    function cancel() {
      if (currentBlock) {
        currentBlock.remove();
        currentBlock = null;
      }
    }

    function placeBlock(e, ui) {
      var column = $(e.target);
      addBlock(ui.draggable.attr('data-type'), null, column);
    }

    function bindEvents(columns) {
      unbindEvents(columns);
      columns.sortable(SORTABLE_SETTINGS);
    }

    function unbindEvents(columns) {
      if (columns.sortable('instance')) {
        columns.sortable('destroy');
      }
    }

    function addBlock(type, data, column) {
      var block = new Block(type).create(data, function(block) {
        currentBlock = block;
        column.append(block);
      });
    }

    return {
      create: function() {
        element = $('<div>').addClass('sl-layout');
        var columnWidth = 100 / columns + "%";
        for (var i = 0; i < columns; i++) {
          var column = $('<div>').addClass('sl-column').droppable(DROPPABLE_SETTINGS).width(columnWidth);
          element.append(column);
        }
        bindEvents(element.children('.sl-column'));
        return element;
      },

      addBlock: addBlock

    };
  }

  return Layout;

});
