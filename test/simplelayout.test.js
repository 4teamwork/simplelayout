suite("Simplelayout", function() {
  "use strict";

  var Simplelayout;
  var Toolbox;

  setup(function(done) {
    require(["simplelayout/Simplelayout", "toolbox/Toolbox"], function(_Simplelayout, _Toolbox) {
      Simplelayout = _Simplelayout;
      Toolbox = _Toolbox;
      done();
    });
  });

  test("is a constructor function", function() {
    assert.throw(Simplelayout, TypeError, "Simplelayout constructor cannot be called as a function.");
  });

  test("raises exception when attaching toolbox when its not attached to DOM", function() {
    var toolbox = new Toolbox({layouts: [0]});
    var simplelayout = new Simplelayout();
    simplelayout.insertManager();

    assert.throws(function() {
      simplelayout.attachToolbox(toolbox);
    }, Error, "Not attached to DOM element");
  });

  test("manager stores information", function() {
    fixtures.set('<div class="sl-simplelayout" id="slot1"></div><div class="sl-simplelayout" id="slot2"></div>');
    var containers = $(".sl-simplelayout", fixtures.window().document);
    var simplelayout = new Simplelayout({ source: containers });
    simplelayout = simplelayout;
    var data = $.map(containers, function(container) {
      return $(container).data().container;
    });
    assert.deepEqual(data, [0, 1]);
  });

  test("layout stores information", function() {
    fixtures.set('<div class="sl-simplelayout" id="slot1"></div><div class="sl-simplelayout" id="slot2"></div>');
    var containers = $(".sl-simplelayout", fixtures.window().document);
    var simplelayout = new Simplelayout({ source: containers });
    var layoutmanager = simplelayout.managers[0];
    layoutmanager.insertLayout(4);
    layoutmanager.commitLayouts();
    var data = $.map(layoutmanager.layouts[0].element, function(e) {
      e = $(e);
      return { container: e.data().container, layoutId: e.data().layoutId };
    });
    assert.deepEqual(data, [{ container: 0, layoutId: 0 }]);
  });

  test("column stores information", function() {
    fixtures.set('<div class="sl-simplelayout" id="slot1"></div><div class="sl-simplelayout" id="slot2"></div>');
    var containers = $(".sl-simplelayout", fixtures.window().document);
    var simplelayout = new Simplelayout({ source: containers });
    var layoutmanager = simplelayout.managers[0];
    layoutmanager.insertLayout(4);
    layoutmanager.commitLayouts();
    var data = $.map(layoutmanager.layouts[0].columns, function(e) {
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
    fixtures.set('<div class="sl-simplelayout" id="slot1"></div><div class="sl-simplelayout" id="slot2"></div>');
    var containers = $(".sl-simplelayout", fixtures.window().document);
    var simplelayout = new Simplelayout({ source: containers });
    var layoutmanager = simplelayout.managers[0];
    layoutmanager.insertLayout(4);
    layoutmanager.commitLayouts();
    layoutmanager.insertBlock(0, 0);
    var data = $.map(layoutmanager.layouts[0].columns[0].blocks, function(e) {
      data = e.element.data();
      return { container: data.container, layoutId: data.layoutId, columnId: data.columnId, blockId: data.blockId };
    });
    assert.deepEqual(data, [
      { container: 0, layoutId: 0, columnId: 0, blockId: 0 } ]);
  });

  test("can deserialize", function() {
    var simplelayout = new Simplelayout();
    var m1 = simplelayout.insertManager();
    var m2 = simplelayout.insertManager();
    var manager1 = simplelayout.managers[m1];
    var manager2 = simplelayout.managers[m2];
    manager1.insertLayout(4);
    manager1.insertLayout(4);
    manager2.insertLayout(4);
    manager2.insertLayout(4);
    manager1.insertBlock(0, 0, null, "textblock");
    manager1.insertBlock(0, 1, null, "textblock");
    manager1.insertBlock(0, 2, null, "textblock");
    manager2.insertBlock(1, 0, null, "listingblock");
    manager2.insertBlock(1, 1, null, "listingblock");
    manager2.insertBlock(1, 2, null, "listingblock");
    var objectString = '{"0":{"layouts":{"0":{"columns":{"0":{"blocks":{"0":{"uid":null,"type":"textblock"}}},"1":{"blocks":{"0":{"uid":null,"type":"textblock"}}},"2":{"blocks":{"0":{"uid":null,"type":"textblock"}}},"3":{"blocks":{}}}},"1":{"columns":{"0":{"blocks":{}},"1":{"blocks":{}},"2":{"blocks":{}},"3":{"blocks":{}}}}}},"1":{"layouts":{"0":{"columns":{"0":{"blocks":{}},"1":{"blocks":{}},"2":{"blocks":{}},"3":{"blocks":{}}}},"1":{"columns":{"0":{"blocks":{"0":{"uid":null,"type":"listingblock"}}},"1":{"blocks":{"0":{"uid":null,"type":"listingblock"}}},"2":{"blocks":{"0":{"uid":null,"type":"listingblock"}}},"3":{"blocks":{}}}}}}}';
    assert.equal(simplelayout.serialize(simplelayout.deserialize(simplelayout.serialize())), objectString);
  });

  suite("Integrationtests", function() {

    var simplelayout;
    var toolbox;

    setup(function() {
      simplelayout = new Simplelayout();
      simplelayout.insertManager();
      simplelayout.attachTo($("div"));
      toolbox = new Toolbox({layouts: [1, 2, 4]});
      toolbox.attachTo($("<div>"));
    });

    test("can attach a toolbox", function() {
      simplelayout.attachToolbox(toolbox);

      assert.isDefined(simplelayout.getToolbox());
    });

  });

});
