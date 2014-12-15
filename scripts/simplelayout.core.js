define(["jquery", "config", "app/simplelayout.layoutmanager"], function($, CONFIG, layoutmanager) {
  var simplelayout = {},
    element = null,
    build = function() {
      element.addClass('simplelayout');
    };

  simplelayout.init = function(selector) {
    if (!selector) {
      throw "InvalidArgumentException: " + selector;
    }
    element = $(selector);
    build();
    layoutmanager.observe(element);
    return element;
  };

  return simplelayout;

});
