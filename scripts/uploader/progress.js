define(["jquery", "config"], function($, CONFIG) {

    var progress = {},
        curValue = 0,
        element = null,
        overlayTemplate = '<div></div>',
        doneTemplate = '<img />',
        failTemplate = '<img />',
        increment = 360 / 100,
        that = this,

        init = function(selector) {
            if (!selector) {
                throw "InvalidArgumentException: " + selector;
            }
            build(selector);
            value(curValue);
        },
        build = function(selector) {
            element = $(selector);
            overlay = $(overlayTemplate);
            overlay.className = 'overlay';
            tick = $(doneTemplate);
            tick.id = 'tick';
            fail = $(failTemplate);
            fail.id = 'fail';

            element.append(overlay);
            element.append(tick);
            element.append(fail);
            that.barStHalf = CONFIG.uploader.barStHalf.replace(/\$backColor/g, CONFIG.uploader.backColor);
            that.barStHalf = that.barStHalf.replace(/\$barColor/g, CONFIG.uploader.barColor);
            that.barGtHalf = CONFIG.uploader.barGtHalf.replace(/\$backColor/g, CONFIG.uploader.backColor);
            that.barGtHalf = that.barGtHalf.replace(/\$barColor/g, CONFIG.uploader.barColor);
        },
        value = function(value) {
            if (!value && value !== 0) {
                return curValue;
            }
            if (isNaN(value)) {
                throw "InvalidArgumentException: " + value;
            } else {
                value = Math.abs(Math.round(value));
                if (value > 100) {
                    throw "InvalidArgumentException: " + value + " is larger than 100";
                }
                curValue = value;
                var angle;
                if (curValue < 50) {
                    angle = 90 + increment * curValue;
                    element.css('backgroundImage', that.barStHalf.replace('$nextdeg', angle + 'deg'));
                } else {
                    angle = -90 + (increment * (curValue - 50));
                    element.css('backgroundImage', that.barGtHalf.replace('$nextdeg', angle + 'deg'));
                }
                overlay.innerHTML = curValue + '%';
            }
        },
        done = function() {
            tick.style.display = 'block';
        },
        failure = function() {
            fail.style.display = 'block';
        },
        reset = function() {
            tick.style.display = 'none';
            fail.style.display = 'none';
            hide();
            curValue = 0;
            value(curValue);
        },
        show = function() {
            element.style.display = 'block';
        },
        hide = function() {
            element.style.display = 'none';
        };

    progress.init = init;
    progress.value = value;
    progress.done = done;
    progress.reset = reset;
    progress.show = show;
    progress.hide = hide;
    progress.failure = failure;

    return progress;


});
