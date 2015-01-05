requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    app: "../scripts",
    jquery: "jquery/dist/jquery",
    jqueryui: "jquery-ui/ui",
    config: "../scripts/config",
    renderer: "jsrender/jsrender"
  },
  shim: {
    'renderer': {
      deps: ['jquery'],
      exports: 'jQuery.fn.templates'
    }
  }
});
require(['jquery', 'app/toolbox/Toolbox', 'app/simplelayout/Layoutmanager', 'app/simplelayout/Block', 'app/simplelayout/Layout', 'app/simplelayout/utils'], function($, Toolbox, Layoutmanager, Block, Layout, utils) {
  $(document).ready(function() {

    var BLOCK_RESIZABLE_SETTINGS = {
      handles: "s",
      grid: [utils.getGrid().x, 1],
      start: function(e, ui) {
        $(ui.element).css('z-index', 2);
      },
      stop: function(e, ui) {
        $(ui.element).css('z-index', 1);
      },
      resize: function(e, ui) {}
    };

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: '.sl-simplelayout',
      items: '.sl-layout',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
    };

    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: '.sl-column, .tb-trash',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      distance: 1
    };

    var LAYOUT_DROPPABLE_SETTINGS = {
      accept: '.sl-toolbox-component',
      over: function(e, ui) {
        var layoutID = $(this).parent().attr('id');
        var that = this;
        var block = new Block(ui.draggable.data('type'));
        block.create();
        block.getElement().resizable(BLOCK_RESIZABLE_SETTINGS);
        //window.setTimeout(function() {
          layoutmanager.getLayouts()[layoutID].insertBlockAt({
            block: block,
            column: $(that).index()
          });
        //});
      },
      out: function() {
        var layoutID = $(this).parent().attr('id');
        layoutmanager.getLayouts()[layoutID].rollbackBlock();
      },
      drop: function() {
        var layoutID = $(this).parent().attr('id');
        layoutmanager.getLayouts()[layoutID].commitBlock();
      }
    };

    var toolbox = new Toolbox({
      layouts: [1, 2, 4]
    });
    toolbox.attachTo($("body"));
    var layoutmanager = new Layoutmanager({
      width: '900px'
    });
    layoutmanager.attachTo($('body'));

    var LAYOUTMANAGER_DROPPABLE_SETTINGS = {
      accept: ".sl-toolbox-layout",
      over: function(e, ui) {
        var layout = new Layout(ui.draggable.data('columns'));
        layout.getColumns().droppable(LAYOUT_DROPPABLE_SETTINGS).sortable(LAYOUT_SORTABLE_SETTINGS);
        layout.getElement().attr('id', layoutmanager.getLayouts().length);
        layoutmanager.insertLayout(layout);
      },
      out: function() {
        layoutmanager.rollbackLayout();
      },
      drop: function() {
        layoutmanager.commitLayout();
      }
    };

    layoutmanager.getElement().droppable(LAYOUTMANAGER_DROPPABLE_SETTINGS).sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);

  });
});
