define(["jquery", "config", "app/simplelayout.layoutmanager"], function($, CONFIG, layoutmanager) {
  var simplelayout = {},
    element = null;

  simplelayout.init = function(selector) {
    if (!selector) {
      throw "InvalidArgumentException: " + selector;
    }
    element = $(selector);
    element.addClass('sl-simplelayout');
    layoutmanager.observe(element);
    return element;
  };

  return simplelayout;

});
