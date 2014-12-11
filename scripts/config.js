define(function() {
    var CONFIG = {};

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

    return CONFIG;

});
