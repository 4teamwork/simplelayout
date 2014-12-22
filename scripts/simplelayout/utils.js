define(["config"], function(CONFIG) {

  'use strict';

  var utils = {};

  utils.getGrid = function() {
    var grid = {};
    grid.x = CONFIG.contentwidth / CONFIG.columns;
    grid.y = 10;
    return grid;
  };

  utils.getImageGrid = function() {
    return CONFIG.contentwidth / CONFIG.columns / CONFIG.images;
  };

  return utils;
});
