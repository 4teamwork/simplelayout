suite('Eventrecorder', function() {
    'use strict';

    var eventSource;
    var Eventrecorder;

    setup(function(done) {
        require(['app/simplelayout/Eventrecorder', 'jqueryui/droppable'], function(_Eventrecorder) {
            Eventrecorder = _Eventrecorder;
            done();
        });
    });

    test('is a constructor function', function() {
        assert.throw(Eventrecorder, TypeError, 'Eventrecorder constructor cannot be called as a function.');
    });

    test('can insert a jqueryui over-event', function() {
        eventSource = $('<div>').droppable();
        var recorder = new Eventrecorder();
        eventSource.on('over', function(e) {
            recorder.record(e);
        });
        eventSource.trigger('over');

        assert.equal(Object.keys(recorder.getEventQueue()).length, 1);

    });

    test('can lookup a jqueryui over-event for jqueryui out-event', function() {
        eventSource = $('<div>').droppable();
        var recorder = new Eventrecorder();

        var originalOverEvent;
        eventSource.on('over', function(e) {
            originalOverEvent = e;
            recorder.record(e);
        });
        eventSource.trigger('over');
        eventSource.on('out', function(e) {
            assert.equal(originalOverEvent, recorder.lookup(e));
        });
        eventSource.trigger('out');
    });

    test('can flush internal Eventqueue', function() {
       eventSource = $('<div>').droppable();
        var recorder = new Eventrecorder();

        var originalOverEvent;
        eventSource.on('over', function(e) {
            recorder.record(e);
        });
        eventSource.trigger('over');

        recorder.flush();

        assert.equal(Object.keys(recorder.getEventQueue()).length, 0);
        assert.equal(recorder.eventId, 0);
    });

    test('empty lookup raises exception', function() {
        eventSource = $('<div>').droppable();
        var recorder = new Eventrecorder();

        var originalOverEvent;
        eventSource.on('over', function(e) {
            recorder.record(e);
        });
        eventSource.trigger('over');

        assert.throws(function() {
            recorder.lookup("e");
        }, Error, "No event for lookup.");
    });
});
