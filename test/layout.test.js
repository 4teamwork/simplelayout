suite('Layout', function() {
  'use strict';

  var Layout;
  var Block;

  setup(function(done) {
    require(['app/simplelayout/Layout', 'app/simplelayout/Block'], function(_Layout, _Block) {
      Layout = _Layout;
      Block = _Block;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Layout, TypeError, 'Layout constructor cannot be called as a function.');
  });

  suite('column width calculation', function() {

    test('4-columns layout has width of 25%', function() {
      var layout = new Layout(4);

      var columns = layout.getColumns();

      columns = $.map(columns, function(el) {
        return {
          tag: el.tagName,
          classes: el.className,
          style: el.style.cssText
        };
      });

      assert.deepEqual(columns, [{
        tag: "DIV",
        classes: "sl-column",
        style: "width: 25%;"
      }, {
        tag: "DIV",
        classes: "sl-column",
        style: "width: 25%;"
      }, {
        tag: "DIV",
        classes: "sl-column",
        style: "width: 25%;"
      }, {
        tag: "DIV",
        classes: "sl-column",
        style: "width: 25%;"
      }]);

    });

    test('4-columns layout has full-width', function() {
      var layout = new Layout(1);

      var columns = layout.getColumns();

      columns = $.map(columns, function(el) {
        return {
          tag: el.tagName,
          classes: el.className,
          style: el.style.cssText
        };
      });

      assert.deepEqual(columns, [{
        tag: "DIV",
        classes: "sl-column",
        style: "width: 100%;"
      }]);

    });
  });

  suite('Block-Transactions (to get visual feedback where block will be placed)', function() {

    var textblock;
    var layout;

    setup(function(done) {
      layout = new Layout(1);
      textblock = new Block('textblock');
      textblock.create();
      done();
    });

    test('can insert a block', function() {
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });

      var attachedBlock = layout.getElement().find('.sl-column').get(0).childNodes[0];
      var node = {
        tag: attachedBlock.tagName,
        classes: attachedBlock.className,
        type: attachedBlock.dataset.type
      };
      assert.deepEqual(node, {
        tag: "DIV",
        classes: "sl-block",
        type: "textblock"
      });

    });

    test('can rollback a block', function() {
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });
      layout.rollbackBlock();

      var node = layout.getElement().find('.sl-block');
      assert(node.length === 0);

    });

    test('can commit a block', function() {
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });
      layout.commitBlock();

      var attachedBlock = layout.getElement().find('.sl-column').get(0).childNodes[0];
      var node = {
        tag: attachedBlock.tagName,
        classes: attachedBlock.className,
        type: attachedBlock.dataset.type
      };
      assert.deepEqual(node, {
        tag: "DIV",
        classes: "sl-block",
        type: "textblock"
      });

    });

    test('insert twice throws exception', function() {
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });

      assert.throw(function() {
        layout.insertBlockAt({
          block: textblock,
          column: 0
        });
      }, Error, 'Block already inserted.');
    });

    test('rollback a non inserted block throws exception', function() {
      assert.throw(function() {
        layout.rollbackBlock();
      }, Error, 'No block inserted.');
    });

    test('throws exception when column does not exist while inserting', function() {
      assert.throws(function() {
        layout.insertBlockAt({
          block: textblock,
          column: 1
        });
      }, ReferenceError, 'Column 1 does not exist');
    });

  });

});
