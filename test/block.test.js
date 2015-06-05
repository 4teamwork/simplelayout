suite("Block", function() {
  "use strict";

  var Block;
  var Toolbar;
  var block;

  suiteSetup(function(done) {
    require(["app/simplelayout/Block", "app/simplelayout/Toolbar"], function(_Block, _Toolbar) {
      Block = _Block;
      Toolbar = _Toolbar;
      done();
    });
  });

  setup(function(done) {
    block = new Block("<p>Test</p>", "textblock");
    block.create();
    done();
  });

  test("is a constructor function", function() {
    assert.throw(Block, TypeError, "Block constructor cannot be called as a function.");
  });

  test("can create a block", function() {
    var node = $.map(block.element, function(blockNode) {
      return {tagName: blockNode.tagName, content: blockNode.innerHTML, type: blockNode.dataset.type};
    });

    assert.deepEqual(node, [{tagName: "DIV", content: '<div class="sl-block-content"><p>Test</p></div>', type: "textblock"}]);
  });

  test("can set block-content", function() {
    block.content("<p>Hallo</p>");

    var node = $.map(block.element, function(blockNode) {
      return {tagName: blockNode.tagName, content: blockNode.innerHTML, type: blockNode.dataset.type};
    });

    assert.deepEqual(node, [{tagName: "DIV", content: '<div class="sl-block-content"><p>Hallo</p></div>', type: "textblock"}]);
  });

  test("can attach a toolbar", function() {
    var toolbar = new Toolbar();
    block.attachToolbar(toolbar);

    var node = $.map(block.element, function(blockNode) {
      return {tagName: blockNode.tagName, content: blockNode.innerHTML, type: blockNode.dataset.type};
    });

    assert.deepEqual(node, [{tagName: "DIV", content: '<div class="sl-block-content"><p>Test</p></div><ul class="sl-toolbar"></ul>', type: "textblock"}]);
  });

  test("triggers event on commit", function() {
    // var eventBlock = new Block("I was triggered", "eventBlock");
    // ee.on("blockCommitted", function(b) {
    //   assert.equal(b.type, "eventBlock");
    // });
    // eventBlock.commit();
  });

});
