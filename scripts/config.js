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
  CONFIG.templates.textblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div>';
  CONFIG.templates.imageblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><div class="sl-img-wrapper"><img src="images/test.jpg" /></div></div></div>';
  CONFIG.templates.listingblock = '<div class="sl-block" data-uuid="FAKEUID"><div class="block-view-wrapper"><table class="data"><tr><th>Entry Header 1</th><th>Entry Header 2</th><th>Entry Header 3</th><th>Entry Header 4</th></tr<tr><td>Entry First Line 1</td><td>Entry First Line 2</td><td>Entry First Line 3</td><td>Entry First Line 4</td></tr><tr><td>Entry Line 1</td><td>Entry Line 2</td><td>Entry Line 3</td><td>Entry Line 4</td></tr><tr><td>Entry Last Line 1</td><td>Entry Last Line 2</td><td>Entry Last Line 3</td><td>Entry Last Line 4</td></tr></table></div></div>';

  return CONFIG;

});
