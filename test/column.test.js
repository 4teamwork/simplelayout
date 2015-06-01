suite("Column", function() {
  "use strict";

  var Column;
  var column;

  suiteSetup(function(done) {
    require(["simplelayout/Column"], function(_Column) {
      Column = _Column;
      done();
    });
  });

  setup(function(done) {
    column = new Column(2);
    column.create();
    done();
  });

  test("is a constructor function", function() {
    assert.throw(Column, TypeError, "Column constructor cannot be called as a function.");
  });

  test("can create column with sl-col-2 class", function() {
    var node = $.map(column.element, function(columnNode) {
      return {tag: columnNode.tagName, classes: columnNode.className};
    });

    assert.deepEqual(node, [{tag: "DIV", classes: "sl-column sl-col-2"}]);
  });

  test("defining an empty column raises an exeption", function() {
    assert.throws(function() {
      column = new Column();
      column();
    }, Error, "Columns are not defined.");
  });

  suite("Block-transactions", function() {

    test("can insert a block", function() {
      column.insertBlock( { content: "<p>Test</p>", type: "textblock"} );

      var blocks = $.map(column.blocks, function(block) {
        return { blockId: block.element.data("block-id"), type: block.type };
      });

      assert.deepEqual(blocks, [{ blockId: 0, type: "textblock" }]);
    });

    test("can delete a block", function() {
      var block = column.insertBlock("<p>Test</p>", "textblock");
      column.deleteBlock(block.element.data("blockId"));

      var blocks = $.map(column.blocks, function(e) {
        return {committed: e.committed, blockId: e.element.data("block-id"), type: e.type};
      });

      assert.deepEqual(blocks, [], "Should have no blocks after deleting them");
    });

    test("delete a non inseted block raises an exception", function() {
      assert.throws(function() {
        column.deleteBlock(2);
      }, Error, "No block with id 2 inserted.");
    });

  });

});
