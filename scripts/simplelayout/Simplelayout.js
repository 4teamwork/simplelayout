define(["jquery", "app/simplelayout/layoutmanager"], function($, Layoutmanager) {

  'use strict';

  function Simplelayout(selector) {
    if (!(this instanceof Simplelayout)) {
      throw new TypeError("Simplelayout constructor cannot be called as a function.");
    }
    if (!selector) {
      throw new TypeError("selector must be defined");
    }

    var element = $(selector);

    return {
      init: function() {
        element.addClass('sl-simplelayout');
        var layoutmanager = new Layoutmanager(element);
        layoutmanager.observe();
      }
    };

  }

  return Simplelayout;

});
