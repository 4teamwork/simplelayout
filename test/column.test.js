suite('Column', function() {
  'use strict';

  var Column;

  setup(function(done) {
    require(['simplelayout/Column'], function(_Column) {
      Column = _Column;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Column, TypeError, 'Column constructor cannot be called as a function.');
  });

  test('can create column with sl-col-2 class', function() {
    var column = new Column(2);
    column.create();

    var node = $.map(column.getElement(), function(column) {
      return {tag : column.tagName, classes : column.className};
    });

    assert.deepEqual(node, [{tag : 'DIV', classes : 'sl-column sl-col-2'}]);
  });

  test('defining an empty column raises an exeption', function() {
    assert.throws(function() {
      new Column();
    }, Error, 'Columns are not defined.');
  });

  suite('Block-transactions', function() {

    test('can insert a block', function() {
      var column = new Column(2);
      column.create();
      column.insertBlock('<p>Test</p>', 'textblock');

      var block = $.map(column.getBlocks(), function(block) {
        return {committed : block.committed, blockId : block.getElement().data('block-id'), type : block.type};
      });

      assert.deepEqual(block, [{committed : false, blockId : 0, type : 'textblock'}]);
    });

    test('can delete a block', function() {
      var column = new Column(2);
      column.create();
      var blockId = column.insertBlock('<p>Test</p>', 'textblock');
      column.deleteBlock(blockId);

      var block = $.map(column.getBlocks(), function(block) {
        return {committed : block.committed, blockId : block.getElement().data('block-id'), type : block.type};
      });

      assert.deepEqual(block, [], "Should have no blocks after deleting them");
    });

    test('can commit a block', function() {
      var column = new Column(2);
      column.create();
      var blockId = column.insertBlock('<p>Test</p>','textblock');
      column.commitBlocks();
      var blocks = $.map(column.getCommittedBlocks(), function(block) {
        return {committed : block.committed};
      });

      assert.deepEqual(blocks, [{committed : true}]);

    });

    test('inserting and deleting blocks does not commit them', function() {
      var column = new Column(2);
      column.create();
      column.insertBlock('<p>Test</p>','textblock');
      var blockId = column.insertBlock('<p>Test</p>','textblock');
      column.deleteBlock(blockId);

      assert.deepEqual(column.getCommittedBlocks(), {}, "Should have no committed blocks without commit");
    });

    test('delete a non inseted block raises an exception', function() {
      var column = new Column(2);
      column.create();

      assert.throws(function() {
        column.deleteBlock(2);
      }, Error, 'No block with id 2 inserted.');
    });

    test('commit non inserted blocks raises exception', function() {
      var column = new Column(2);
      column.create();

      assert.throws(function() {
        column.commitBlocks();
      }, Error, 'No blocks inserted.');
    });

  });

});
