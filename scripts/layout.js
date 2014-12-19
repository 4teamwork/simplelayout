define(['jquery', 'config', 'app/simplelayout.blockbuilder', 'jqueryui/droppable', 'jqueryui/sortable'], function($, CONFIG, blockbuilder) {

  var layout,
    _columns = null,
    currentBlock = null,
    currentColumn = null,
    sortableSettings = {
      connectWith: '.sl-column',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      distance: 1
    },
    droppableSettings = {
      drop: function() {
        dropBlock();
      },
      over: function(e, ui) {
        var that = this;
        // Hack: Out is called before over so the timeout fix
        window.setTimeout(function(){
          placeBlock.call(that, e, ui);
        }, 1);
      },
      out: function() {
        cancel();
      }
    },
    init = function() {
      build();
      bindEvents();
    },
    build = function() {
      layout = $('<div>').addClass('sl-layout');
      var columnWidth = 100 / _columns + "%";
      for (i = 0; i < _columns; i++) {
        var column = $('<div>').addClass('sl-column').droppable(droppableSettings).width(columnWidth);
        layout.append(column);
      }
    },
    dropBlock = function() {
      currentBlock = null;
      currentColumn = null;
      layout.children('.sl-column').sortable('refresh');
    },
    cancel = function() {
      if (currentBlock) {
        currentBlock.remove();
        currentBlock = null;
        currentColumn = null;
      }
    },
    placeBlock = function(e, ui) {
      if (ui && ui.draggable.hasClass('tb-component') && !currentBlock && !currentColumn) {
        currentColumn = $(this);
        currentBlock = blockbuilder.build(ui.draggable.attr('data-type'));
        currentColumn.append(currentBlock);
      }
    },
    bindEvents = function() {
      unbindEvents();
      layout.droppable(droppableSettings);
      layout.children('.sl-column').sortable(sortableSettings);
    },
    unbindEvents = function() {
      if (layout.sortable('instance')) {
        layout.sortable('destroy');
      }
      if (layout.sortable('instance')) {
        layout.sortable('destroy');
      }
    };
  return function Layout(columns) {
    _columns = columns;
    init();
    return layout;
  };

});
