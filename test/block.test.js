suite('Block', function() {
  'use strict';

  var Block;
  var Toolbox;

  setup(function(done) {
    require(['simplelayout/Block', 'toolbox/Toolbox'], function(_Block, _Toolbox) {
      Block = _Block;
      Toolbox = _Toolbox;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Block, TypeError, 'Block constructor cannot be called as a function.');
  });

  test('throws exception when block type is not defined', function() {
    assert.throws(function() {
      new Block();
    },
    ReferenceError,
    "Type must be defined.");
  });

  test('can create a textblock with "I am a block" as content', function() {
    var block = new Block('textblock');
    block.create('I am a block');
    var textblock = block.getElement()[0];

    var node = { tag : textblock.tagName, classes : textblock.className, content : textblock.innerText};
    assert.deepEqual(node, {tag : "DIV", classes : "sl-block", content : "I am a block"});
  });

  test('can set block-content', function() {
    var block = new Block('textblock');
    block.create('I am a block');
    block.content('<p>hallo</p>');
    var textblock = block.getElement()[0];

    var node = { tag : textblock.tagName, classes : textblock.className, content : textblock.innerText};
    assert.deepEqual(node, {tag : "DIV", classes : "sl-block", content : "hallo"});
  });

});