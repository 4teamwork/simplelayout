define(function() {
  var CONFIG = {};

  CONFIG.dropzonecolor = 'rgba(178, 194, 240, 0.5)';

  /*
    Defines config for uploader and progressbar
   */

  CONFIG.uploader = {};
  CONFIG.uploader.barColor = '#75ad0a';
  CONFIG.uploader.backColor = '#000000';
  CONFIG.uploader.barGtHalf = 'linear-gradient($nextdeg, $barColor 50% , transparent 50% , transparent),linear-gradient(270deg, $barColor 50% , $backColor 50% , $backColor)';
  CONFIG.uploader.barStHalf = 'linear-gradient(90deg, $backColor 50% , transparent 50% , transparent),linear-gradient($nextdeg, $barColor 50% , $backColor 50% , $backColor)';
  CONFIG.uploader.uploadURL = '/';

  return CONFIG;

});
