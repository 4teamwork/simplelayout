define([], function() {

  "use strict";

  function Eventrecorder() {

    if (!(this instanceof Eventrecorder)) {
      throw new TypeError("Eventrecorder constructor cannot be called as a function.");
    }

    return {

      eventId: 0,

      eventQueue: {},

      record: function(event) {
        $(event.target).data("event-id", this.eventId);
        this.eventQueue[this.eventId] = event;
        this.eventId++;
      },

      lookup: function(event) {
        var eventLookup = this.eventQueue[$(event.target).data("event-id")];
        if (!eventLookup) {
          throw new Error("No event for lookup.");
        }
        return eventLookup;
      },

      getEventQueue: function() {
        return this.eventQueue;
      },

      flush: function() {
        this.eventQueue = {};
        this.eventId = 0;
      }
    };

  }

  return Eventrecorder;

});
