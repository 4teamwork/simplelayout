define(["jquery", "config", "app/layout", "app/simplelayout.utils", "jqueryui/droppable"], function($, CONFIG, Layout, utils) {

  var layoutmanager = {},
    currentLayout = null,
    dropSettings = {
      over: function(e, ui) {
        placeLayout(e, ui);
      },
      out: function() {
        cancel();
      },
      drop: function() {
        dropLayout();
      }
    },
    sortableSettings = {
      connectWith: '.sl-simplelayout',
      items : '.sl-layout',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
    },
    bindEvents = function() {
      unbindEvents();
      layoutmanager.droppable(dropSettings);
    },
    unbindEvents = function() {
      if (layoutmanager.droppable('instance')) {
        layoutmanager.droppable('destroy');
      }
    },
    generateLayout = function(component) {
      var type = component.attr('data-type');
      var block = builder.build(type);
      return block;
    },
    cancel = function() {
      if (currentLayout) {
        currentLayout.remove();
      }
    },
    placeLayout = function(e, ui) {
      if (ui && ui.draggable.hasClass('tb-layout')) {
        currentLayout = new Layout(ui.draggable.attr('data-columns'));
        layoutmanager.append(currentLayout);
      }
    },
    dropLayout = function() {
      currentLayout = null;
    },
    init = function() {
      layoutmanager.css('width', CONFIG.contentwidth).sortable(sortableSettings);
      bindEvents();
    };

  layoutmanager.observe = function(element) {
    if (!element) {
      throw "InvalidArgumentException: " + element;
    }
    layoutmanager = $(element);
    init();
  };

  return layoutmanager;

});
