define(["jquery", "config"], function($, CONFIG) {

    var uploader = {},
        dropzone = null,
        dragging = 0,
        done = false,
        fail = false,
        tests = {
            filereader: null,
            dnd: null,
            formdata: null,
            progress: null
        },
        readfile = function(file) {
            var formData = tests.formdata ? new FormData() : null;
            reset();
            dropzone.className = 'uploading';
            if (tests.formdata) {
                formData.append('file', file);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', CONFIG.uploader.uploadURL);
                xhr.onload = function() {
                    progress.value(0);
                };

                if (tests.progress) {
                    xhr.upload.onprogress = function(event) {
                        if (event.lengthComputable) {
                            var complete = (event.loaded / event.total * 100 | 0);
                            dropzone.trigger('progress', [{
                                'progress': complete
                            }]);
                        }
                    };
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        dropzone.attr('class', 'done');
                        done = true;
                        dropzone.trigger('done');

                    } else if (xhr.readyState == 4 && xhr.status != 200) {
                        dropzone.attr('class', 'fail');
                        fail = true;
                        dropzone.trigger('fail', [{
                            'statusText': xhr.statusText
                        }]);
                    }
                };
                xhr.send(formData);
            }
        },
        bindEvents = function() {
            unbindEvents();
            if (tests.dnd) {
                $(document).on('dragenter', function(event) {
                    dragging++;
                    event.preventDefault();
                    dropzone.trigger('active');
                }).on('drop', function(event) {
                    event.preventDefault();
                    $target = $(event.target);
                    if (!($target.is(dropzone) || $target.parent().is(dropzone))) {
                        reset();
                    }
                }).on('dragleave', function(event) {
                    dragging--;
                    if (dragging === 0) {
                        if (!fail) {
                            reset();
                        }
                        dropzone.trigger('inactive');
                    }
                }).on('dragover', function(event) {
                    event.preventDefault();
                });

                dropzone.on('dragover', function(event) {
                    done ? this.className = 'done hover' : this.className = 'hover';
                    fail ? this.className = 'fail hover' : this.className = 'hover';
                    event.preventDefault();
                    dropzone.trigger('entered');
                }).on('dragleave', function() {
                    done ? this.className = 'done' : this.className = '';
                    fail ? this.className = 'fail' : this.className = '';
                    dropzone.trigger('left');
                }).on('drop', function(event) {
                    $(this).className = '';
                    readfile(event.dataTransfer.files[0]);
                    event.preventDefault();
                    dropzone.trigger('uploadStart');
                });
            }
        },
        unbindEvents = function() {
            dropzone.off('dragover').off('dragleave').off('drop');
            $(document).off('dragenter').off('dragleave').off('drop');
        },
        init = function(selector) {
            if (!selector) {
                throw "InvalidArgumentException: " + selector;
            }
            $.event.props.push("dataTransfer");
            dropzone = $(selector);
            tests.filereader = !!window.FileReader;
            tests.dnd = 'draggable' in document.createElement('span');
            tests.formdata = !!window.FormData;
            tests.progress = 'upload' in new XMLHttpRequest();
            if (!tests.filereader || !tests.dnd || !tests.formdata) {
                $dragAndDropHint.hide();
            }
            bindEvents();
            return dropzone;
        },
        reset = function(soft) {
            dropzone.trigger('cancel');
            dropzone.attr('class', '');
            bindEvents();
            done = false;
            fail = false;
            dragging = 0;
        };

    uploader.init = init;
    return uploader;

});
