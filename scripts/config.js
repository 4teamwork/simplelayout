define(function() {
  var CONFIG = {};

  /*
    Defines confog for blocks
   */
  //Defines the selector for the blocks
  CONFIG.blocks = '.sl-block';
  //Number of column
  CONFIG.columns = 2;
  //Number of images within a column
  CONFIG.images = 2;
  //Defines the selector for the widgetcontent
  CONFIG.contentarea = '#content';
  //Widgetcontent requires a static with for calculating the columnwidths
  CONFIG.contentwidth = 960;
  //Defines readonly mode
  CONFIG.readonly = true;
  //Defines allowed Filetypes for upload
  CONFIG.allowedFileTypes = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf'
  ];

  /*
    Defines config for uploader and progressbar
   */

  CONFIG.uploader = {};
  CONFIG.uploader.barColor = '#75ad0a';
  CONFIG.uploader.backColor = '#000000';
  CONFIG.uploader.barGtHalf = 'linear-gradient($nextdeg, $barColor 50% , transparent 50% , transparent),linear-gradient(270deg, $barColor 50% , $backColor 50% , $backColor)';
  CONFIG.uploader.barStHalf = 'linear-gradient(90deg, $backColor 50% , transparent 50% , transparent),linear-gradient($nextdeg, $barColor 50% , $backColor 50% , $backColor)';
  CONFIG.uploader.uploadURL = '/';

  /*
    Defines config for toolbox
   */

  CONFIG.toolbox = {};
  CONFIG.toolbox.components = [];
  CONFIG.toolbox.components.push({
    "type" : "listingblock",
    "title": "Listingblock"
  });
  CONFIG.toolbox.components.push({
    "type" : "textblock",
    "title": "Textblock"
  });
  CONFIG.toolbox.components.push({
    "type" : "imageblock",
    "title": "Imageblock"
  });

  /*
    Defines the block templates
   */

  CONFIG.templates = {};
  CONFIG.templates.textblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper">Im a textblock</div></div>';
  CONFIG.templates.imageblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><div class="sl-img-wrapper"><img src="images/test.jpg" /></div></div></div>';
  CONFIG.templates.listingblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><table><tr><td>listingblock</td></tr></table></div></div>';

  return CONFIG;

});
