suite('Layoutmanager', function() {
  'use strict';

  var Layoutmanager;
  var layoutmanager;
  var Layout;
  var target;

  setup(function(done) {
    require(['app/simplelayout/Layoutmanager', 'app/simplelayout/Layout'], function(_Layoutmanager, _Layout) {
      Layout = _Layout;
      Layoutmanager = _Layoutmanager;
      layoutmanager = new Layoutmanager();
      target = $('<div></div>');
      layoutmanager.attachTo(target);
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Layoutmanager, TypeError, 'Layoutmanager constructor cannot be called as a function.');
  });

  test('can be added to a target node.', function() {
    var addedNodes = $.map(target.children(), function(e) {
      return [{tag: e.tagName, classes: e.className}];
    });
    assert.deepEqual(addedNodes, [{tag: "DIV", classes: "sl-simplelayout"}]);
  });

  suite('Layout-transactions (to get visual feedback where layout will be placed)', function() {

    setup(function(done) {
      layoutmanager = new Layoutmanager();
      target = $("<div></div>");
      layoutmanager.attachTo(target);
      done();
    });

    test('can insert a Layout.', function() {
      layoutmanager.insertLayout(4);
      var addedNodes = $.map(target.find('.sl-layout'), function(e) {
        return {tag: e.tagName, classes: e.className};
      });
      assert.equal(Object.keys(layoutmanager.getLayouts()).length, 1);
      assert.deepEqual(addedNodes, [{tag: "DIV", classes: "sl-layout"}]);
    });

    test('can delete a Layout.', function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.deleteLayout(layoutId);

      assert.equal(Object.keys(layoutmanager.getLayouts()).length, 0);
    });

    test('can commit a Layout.', function() {
      layoutmanager.insertLayout(4);

      layoutmanager.commitLayouts();

      assert.equal(Object.keys(layoutmanager.getCommittedLayouts()).length, 1);
    });

  });

  suite('Delegates adding and removing blocks to Layouts', function() {

    var columnId = 3;
    var block = 'textblock';

    test('can add a block into a specific Layout', function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      layoutmanager.insertBlock(layoutId, columnId, block);

      var blocks = $.map(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks(), function(block) {
        return {type : block.type, committed : block.committed};
      });

      assert.deepEqual(blocks, [{ type: 'textblock', committed: false}]);
      assert.equal(Object.keys(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()).length, 1);
    });

    test('can delete a specific block from a specific layout', function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      layoutmanager.insertBlock(layoutId, columnId, block);
      var blockId = layoutmanager.insertBlock(layoutId, columnId, block);

      assert.equal(Object.keys(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()).length, 2);

      layoutmanager.deleteBlock(layoutId, columnId, blockId);

      var blocks = $.map(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks(), function(block) {
        return {type : block.type, committed : block.committed};
      });

      assert.deepEqual(blocks, [{ type: 'textblock', committed: false}]);
      assert.equal(Object.keys(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()).length, 1);
    });

    test('can commit blocks', function() {
      var layoutId = layoutmanager.insertLayout(4);
      layoutmanager.commitLayouts();

      layoutmanager.insertBlock(layoutId, columnId, block);
      layoutmanager.commitBlocks(layoutId, columnId);

      var blocks = $.map(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks(), function(block) {
        return {type : block.type, committed : block.committed};
      });

      assert.deepEqual(blocks, [{ type: 'textblock', committed: true}]);
      assert.equal(Object.keys(layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()).length, 1);
    });

  });
});
