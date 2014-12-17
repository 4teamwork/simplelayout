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
  CONFIG.transitionDuration = 0;
  CONFIG.gutter = 0;
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
  CONFIG.templates.textblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper">I am a Block</div></div>';
  CONFIG.templates.imageblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><div class="sl-img-wrapper"><img src="images/test.jpg" /></div></div></div>';
  CONFIG.templates.listingblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><table class="data"><tr><th>Entry Header 1</th><th>Entry Header 2</th><th>Entry Header 3</th><th>Entry Header 4</th></tr<tr><td>Entry First Line 1</td><td>Entry First Line 2</td><td>Entry First Line 3</td><td>Entry First Line 4</td></tr><tr><td>Entry Line 1</td><td>Entry Line 2</td><td>Entry Line 3</td><td>Entry Line 4</td></tr><tr><td>Entry Last Line 1</td><td>Entry Last Line 2</td><td>Entry Last Line 3</td><td>Entry Last Line 4</td></tr></table></div></div>';

  return CONFIG;

});
