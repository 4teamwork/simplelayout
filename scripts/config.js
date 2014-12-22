define(function() {
  var CONFIG = {};

  /*
    Defines confog for blocks
   */
  //Defines the selector for the blocks
  CONFIG.blocks = '.sl-block';
  //Number of column
  CONFIG.columns = 4;
  //Number of images within a column
  CONFIG.images = 2;
  //Widgetcontent requires a static with for calculating the columnwidths
  CONFIG.contentwidth = 960;
  //Defines allowed Filetypes for upload
  CONFIG.allowedFileTypes = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf'
  ];

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
