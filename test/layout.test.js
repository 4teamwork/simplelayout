suite("Layout", function() {
  "use strict";

  var Layout;

  setup(function(done) {
    require(["simplelayout/Layout"], function(_Layout) {
      Layout = _Layout;
      done();
    });
  });

  test("is a constructor function", function() {
    assert.throw(Layout, TypeError, "Layout constructor cannot be called as a function.");
  });

  test("defining an empty layout raises an exception", function() {
    assert.throw(function() {
      var layout = new Layout();
      layout();
    }, Error, "Columns are not defined.");
  });

  test("each column of 4 column layout has sl-col-4 class", function() {
    var layout = new Layout(4);
    layout.create();

    var columns = layout.columns;

    var nodes = $.map(columns, function(column) {
      return $.map(column.element, function(el) {
        return {tag: el.tagName, classes: el.className, id: $(el).data("columnId")};
      });
    });

    assert.deepEqual(nodes, [
      {tag: "DIV", classes: "sl-column sl-col-4", id: 0},
      {tag: "DIV", classes: "sl-column sl-col-4", id: 1},
      {tag: "DIV", classes: "sl-column sl-col-4", id: 2},
      {tag: "DIV", classes: "sl-column sl-col-4", id: 3}
    ]);

  });

  test("hasBlocks return true if at least one block is existing on a layout", function() {
    var layout = new Layout(4);
    layout.create();

    assert(!layout.hasBlocks(), "Layout should not have any blocks");
    layout.insertBlock(0);
    assert(layout.hasBlocks(), "Layout has blocks");
  });

  suite("Block-transactions", function() {

    test("can insert a block", function() {
      var layout = new Layout(2);
      layout.create();
      layout.insertBlock(0, "<p>Test</p>", "textblock");

      var blocks = $.map(layout.columns[0].blocks, function(block) {
        return {committed: block.committed, columnId: block.element.data("columnId"), blockId: block.element.data("block-id"), type: block.type};
      });

      assert.deepEqual(blocks, [{committed: false, columnId: 0, blockId: 0, type: "textblock"}]);
    });

    test("can delete a block", function() {
      var layout = new Layout(2);
      layout.create();
      var blockId = layout.insertBlock(0, "<p>Test</p>", "textblock");
      layout.deleteBlock(0, blockId);

      var blocks = $.map(layout.columns[0].blocks, function(block) {
        return {committed: block.committed, columnId: block.element.data("columnId"), blockId: block.element.data("block-id"), type: block.type};
      });

      assert.deepEqual(blocks, [], "Should have no blocks after deleting them");
    });

    test("can commit a block", function() {
      var layout = new Layout(2);
      layout.create();
      layout.insertBlock(0, "<p>Test</p>", "textblock");
      layout.commitBlocks(0);
      var blocks = $.map(layout.columns[0].getCommittedBlocks(), function(block) {
        return {committed: block.committed};
      });

      assert.deepEqual(blocks, [{committed: true}]);

    });

  });

});
