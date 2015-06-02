suite("Simplelayout", function() {
  "use strict";

  var Simplelayout;
  var Toolbox;
  var simplelayout;
  var manager;

  suiteSetup(function(done) {
    require(["simplelayout/Simplelayout", "toolbox/Toolbox"], function(_Simplelayout, _Toolbox) {
      Simplelayout = _Simplelayout;
      Toolbox = _Toolbox;
      done();
    });
  });

  setup(function(done) {
    simplelayout = new Simplelayout();
    manager = simplelayout.insertManager();
    done();
  });

  test("is a constructor function", function() {
    assert.throw(Simplelayout, TypeError, "Simplelayout constructor cannot be called as a function.");
  });

  test("raises exception when deserialize is called prior to attaching a toolbox", function() {
    simplelayout = new Simplelayout();

    assert.throws(function() {
      simplelayout.deserialize();
    }, Error, "Deserialize was called prior attaching a toolbox.");
  });

  test("manager stores information", function() { assert.deepEqual(manager.element.data("container"), 0); });

  test("layout stores information", function() {
    manager.insertLayout(4);
    var data = $.map(manager.layouts[0].element, function(e) {
      e = $(e);
      return { container: e.data().container, layoutId: e.data().layoutId };
    });
    assert.deepEqual(data, [{ container: 0, layoutId: 0 }]);
  });

  test("column stores information", function() {
    manager.insertLayout(4);
    var data = $.map(manager.layouts[0].columns, function(e) {
      data = e.element.data();
      return { container: data.container, layoutId: data.layoutId, columnId: data.columnId };
    });
    assert.deepEqual(data, [
      { container: 0, layoutId: 0, columnId: 0 },
      { container: 0, layoutId: 0, columnId: 1 },
      { container: 0, layoutId: 0, columnId: 2 },
      { container: 0, layoutId: 0, columnId: 3 }
    ]);
  });

  test("block stores information", function() {
    manager.insertLayout(4);
    manager.insertBlock(0, 0);
    var data = $.map(manager.layouts[0].columns[0].blocks, function(e) {
      data = e.element.data();
      return { container: data.container, layoutId: data.layoutId, columnId: data.columnId, blockId: data.blockId };
    });
    assert.deepEqual(data, [
      { container: 0, layoutId: 0, columnId: 0, blockId: 0 } ]);
  });

  test("can move layout", function() {
    var manager2 = simplelayout.insertManager();
    var layout = manager.insertLayout(4);
    manager.insertLayout(4);
    manager2.insertLayout(4);
    manager2.insertLayout(4);
    var block = manager.insertBlock(0, 0, null, "textblock");
    manager.insertBlock(0, 1, null, "textblock");
    manager.insertBlock(0, 2, null, "textblock");
    manager2.insertBlock(1, 0, null, "listingblock");
    manager2.insertBlock(1, 1, null, "listingblock");
    manager2.insertBlock(1, 2, null, "listingblock");
    simplelayout.moveLayout(manager.element.data("container"), layout.element.data("layoutId"), manager2.element.data("container"));
    assert.deepEqual(layout.element.data(), { container: 1, layoutId: 2 });
    assert.deepEqual(block.element.data(), { blockId: 0, type: "textblock", columnId: 0, layoutId: 2, container: 1 });
  });

  test("can get committed blocks", function() {
    var layout = manager.insertLayout(4);
    var block = layout.insertBlock(0);
    assert.deepEqual([], $.map(simplelayout.getCommittedBlocks(), function(e) {
        return e.committed;
      }), "should have no committed blocks.");
    block.commit();
    assert.deepEqual([true], $.map(simplelayout.getCommittedBlocks(), function(e) {
        return e.committed;
      }), "should have one committed blocks.");
  });

  test("can de- and serialize", function() {
    fixtures.load("simplelayout.html");
    var toolbox = new Toolbox({ layouts: [1] });
    simplelayout.attachToolbox(toolbox);
    simplelayout.deserialize($(fixtures.body()));
    assert.equal(fixtures.read("simplelayout.json"), simplelayout.serialize());
  });

});
