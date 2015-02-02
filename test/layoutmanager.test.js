suite("Layoutmanager", function() {
  "use strict";

  var Layoutmanager;
  var layoutmanager;
  var target;

  setup(function(done) {
    require(["simplelayout/Layoutmanager"], function(_Layoutmanager) {
      Layoutmanager = _Layoutmanager;
      layoutmanager = new Layoutmanager();
      target = $("<div></div>");
      layoutmanager.attachTo(target);
      done();
    });
  });

  test("is a constructor function", function() {
    assert.throw(Layoutmanager, TypeError, "Layoutmanager constructor cannot be called as a function.");
  });

  test("can be added to a target node.", function() {
    var addedNodes = $.map(target.children(), function(e) {
      return [{tag: e.tagName, classes: e.className}];
    });

    assert.deepEqual(addedNodes, [{tag: "DIV", classes: "sl-simplelayout"}]);
  });

  test("default width is 100%", function() {
    assert.equal(layoutmanager.options.width, "100%");
  });

  suite("Layout-transactions", function() {

    setup(function(done) {
      layoutmanager = new Layoutmanager();
      target = $("<div></div>");
      layoutmanager.attachTo(target);
      done();
    });

    test("can insert a Layout.", function() {
      layoutmanager.insertLayout(4);

      var addedNodes = $.map(target.find(".sl-layout"), function(e) {
        return {tag: e.tagName, classes: e.className};
      });

      assert.deepEqual(addedNodes, [{tag: "DIV", classes: "sl-layout"}]);
    });

    test("can delete a Layout.", function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.deleteLayout(layoutId);

      var addedNodes = $.map(target.find(".sl-layout"), function(e) {
        return {tag: e.tagName, classes: e.className};
      });

      assert.deepEqual(addedNodes, []);
    });

    test("can commit a Layout.", function() {
      layoutmanager.insertLayout(4);

      layoutmanager.commitLayouts();

      var addedNodes = $.map(layoutmanager.layouts, function(e) {
        return {committed: e.committed};
      });

      assert.deepEqual(addedNodes, [{committed: true}]);
    });

    test("can move a block", function() {
      var id1 = layoutmanager.insertLayout(4);
      var id2 = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();
      var blockId = layoutmanager.insertBlock(id1, 0, "<p>Test</p>", "textblock");
      layoutmanager.commitBlocks(id1, 0);

      layoutmanager.moveBlock(id1, 0, blockId, id2, 0);
      var blocksOnOriginalLayout = layoutmanager.layouts[id1].columns[0].blocks;
      var blocksOnMovedLayout = layoutmanager.layouts[id2].columns[0].blocks;

      var nodesOnOriginalLayout = $.map(blocksOnOriginalLayout, function(block) {
        return {layoutId: block.element.data("layoutId"), columnId: block.element.data("columnId"), blockId: block.element.data("blockId")};
      });
      assert.deepEqual(nodesOnOriginalLayout, []);

      var nodesOnMovedLayout = $.map(blocksOnMovedLayout, function(block) {
        return {layoutId: block.element.data("layoutId"), columnId: block.element.data("columnId"), blockId: block.element.data("blockId")};
      });
      assert.deepEqual(nodesOnMovedLayout, [{layoutId: id2, columnId: 0, blockId: 0}]);
    });

  });

  suite("Delegates adding and removing blocks to Layouts", function() {

    var columnId = 0;
    var type = "textblock";
    var content = "<p>Test</p>";

    test("can add a block into a specific Layout", function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      var blockId = layoutmanager.insertBlock(layoutId, columnId, content, type);

      var blocks = $.map(layoutmanager.layouts[layoutId].columns[columnId].blocks, function(block) {
        return {committed: block.committed, layoutId: block.element.data("layoutId"), columnId: block.element.data("columnId"), blockId: block.element.data("blockId"), type: block.element.data("type")};
      });

      assert.deepEqual(blocks, [{committed: false, layoutId: layoutId, columnId: columnId, blockId: blockId, type: type}]);
    });

    test("can delete a specific block from a specific layout", function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      var blockId1 = layoutmanager.insertBlock(layoutId, columnId, content, type);
      var blockId2 = layoutmanager.insertBlock(layoutId, columnId, content, type);

      layoutmanager.deleteBlock(layoutId, columnId, blockId1);

      var blocks = $.map(layoutmanager.layouts[layoutId].columns[columnId].blocks, function(block) {
        return {committed: block.committed, layoutId: block.element.data("layoutId"), columnId: block.element.data("columnId"), blockId: block.element.data("blockId"), type: block.element.data("type")};
      });

      assert.deepEqual(blocks, [{committed: false, layoutId: layoutId, columnId: columnId, blockId: blockId2, type: type}]);
    });

    test("can commit blocks", function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      var blockId = layoutmanager.insertBlock(layoutId, columnId, content, type);
      layoutmanager.commitBlocks(layoutId, columnId);

      var blocks = $.map(layoutmanager.layouts[layoutId].columns[columnId].getCommittedBlocks(), function(block) {
        return {committed: block.committed, layoutId: block.element.data("layoutId"), columnId: block.element.data("columnId"), blockId: block.element.data("blockId"), type: block.element.data("type")};
      });

      assert.deepEqual(blocks, [{committed: true, layoutId: layoutId, columnId: columnId, blockId: blockId, type: type}]);
    });

  });
});
