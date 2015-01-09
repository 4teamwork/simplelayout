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

  test('can create column with 50% width', function() {
    var column = new Column('50%');

    column.create();
    var node = $.map(column.getElement(), function(column) {
      return {tag : column.tagName, classes : column.className};
    });

    assert.deepEqual(node, [{tag : 'DIV', classes : 'sl-column'}]);
  });

  suite('Block-transactions', function() {

    test('can insert a block', function() {
      var column = new Column('50%');
      column.create();
      column.insertBlock('textblock');

      var blocks = $.map(column.getBlocks(), function(block) {
        return {type : block.type, committed : block.committed, id : block.getElement().data('block-id')};
      });

      assert.deepEqual(blocks, [{type : 'textblock', committed : false, id : 0}]);
      assert.equal(Object.keys(column.getBlocks()).length, 1);

    });

    test('can delete a block', function() {
      var column = new Column('50%');
      column.create();
      var blockId = column.insertBlock('textblock');
      column.deleteBlock(blockId);

      assert.equal(Object.keys(column.getBlocks()).length, 0);

    });

    test('can commit a block', function() {
      var column = new Column('50%');
      column.create();
      var blockId = column.insertBlock('textblock');
      column.commitBlocks();
      var blocks = $.map(column.getCommittedBlocks(), function(block) {
        return {type : block.type, committed : block.committed};
      });

      assert.deepEqual(blocks, [{type : 'textblock', committed : true}]);

    });

    test('inserting and deleting blocks does not commit them', function() {
      var column = new Column('50%');
      column.create();
      column.insertBlock("first-block", 0);
      var blockId = column.insertBlock('second-block', 0);
      column.deleteBlock(blockId);

      assert.deepEqual(column.getCommittedBlocks(), {}, "Should have no committed blocks without commit");
    });

    test('delete a non inseted block raises an exception', function() {
      var column = new Column('50%');
      column.create();

      assert.throws(function() {
        column.deleteBlock(2);
      }, Error, 'No block with id 2 inserted.');
    });

    test('commit non inserted blocks raises exception', function() {
      var column = new Column('50%');
      column.create();

      assert.throws(function() {
        column.commitBlocks();
      }, Error, 'No blocks inserted.');
    });

  });

});
