suite('Glue (event-interaction between block layout and layoutmanager)', function() {
  'use strict';

  var Layoutmanager;
  var Layout;
  var Block;
  var Toolbox;

  setup(function(done) {
    require(['app/simplelayout/Layoutmanager', 'app/simplelayout/Layout', 'app/simplelayout/Block','app/simplelayout/Toolbox'], function(_Layoutmanager, _Layout, _Block, _Toolbox) {
      Layout = _Layout;
      Layoutmanager = _Layoutmanager;
      Block = _Block;
      Toolbox = _Toolbox;
      done();
    });
  });



});