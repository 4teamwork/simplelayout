suite('Block', function() {
  'use strict';

  var Block;
  var Toolbar;

  setup(function(done) {
    require(['simplelayout/Block', 'simplelayout/Toolbar'], function(_Block, _Toolbar) {
      Block = _Block;
      Toolbar = _Toolbar;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Block, TypeError, 'Block constructor cannot be called as a function.');
  });

  test('can create a block', function() {
    var block = new Block('<p>Test</p>', 'textblock');
    block.create();

    var node = $.map(block.getElement(), function(block) {
      return {tagName : block.tagName, content : block.innerHTML, type : block.dataset.type};
    });

    assert.deepEqual(node, [{tagName : 'DIV', content : '<div class="sl-block-content"><p>Test</p></div>', type : 'textblock'}]);
  });

  test('can set block-content', function() {
    var block = new Block('<p>Test</p>', 'textblock');
    block.create();
    block.content('<p>Hallo</p>');

    var node = $.map(block.getElement(), function(block) {
      return {tagName : block.tagName, content : block.innerHTML, type : block.dataset.type};
    });

    assert.deepEqual(node, [{tagName : 'DIV', content : '<div class="sl-block-content"><p>Hallo</p></div>', type : 'textblock'}]);
  });

  test('can attach a toolbar', function() {
    var block = new Block('<p>Test</p>', 'textblock');
    block.create();
    var toolbar = new Toolbar();
    block.attachToolbar(toolbar);

    var node = $.map(block.getElement(), function(block) {
      return {tagName : block.tagName, content : block.innerHTML, type : block.dataset.type};
    });

    assert.deepEqual(node, [{tagName : 'DIV', content : '<div class="sl-block-content"><p>Test</p></div><ul class="sl-toolbar"><li><a class="move icon-move" title="Move this block arround"></a></li><li class="delimiter"></li></ul>', type : 'textblock'}]);
  });

});