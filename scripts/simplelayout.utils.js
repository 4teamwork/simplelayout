define(["jquery", "config"], function($, CONFIG) {

    var utils = {};

    utils.getGrid = function() {
        var grid = {};
        grid.x = CONFIG.contentwidth / CONFIG.columns;
        grid.y = 10;
        return grid;
    };

    utils.getImageGrid = function() {
        return CONFIG.contentwidth / CONFIG.columns / CONFIG.images;
    };

    utils.getGridHeight = function() {
        return parseInt($(CONFIG.contentarea).css('font-size').slice(0, 2));
    };

    utils.isImage = function(file) {
        // minimal check if it is an image.
        // TODO: This can be improved.
        return file.type.indexOf('image') === 0;
    };

    utils.reloadBlock = function(e) {
        // reload_block needs a event as parameter with simplelayout settings + container.
        var $block = $(this);
        var uuid = $block.data('uuid');

        $('.block-view-wrapper', $block).load(
            './@@sl-ajax-reload-block-view', {
                uuid: uuid
            },
            function() {
                $block.trigger('sl-block-reloaded', {
                    settings: e.data.settings,
                    container: e.data.container
                });
            });
        return;
    };

    utils.getImageWidthBasedOnBlockWidth = function(image_width, origin_block_width, new_block_width) {
        var grid_x = this.getGrid();

        var imagegrid = this.getImageGrid();
        var orig_with_in_columns = origin_block_width / grid_x;
        var new_with_in_columns = new_block_width / grid_x;
        var diff_in_columns = new_with_in_columns - orig_with_in_columns;
        var img_width_in_columns = (image_width + CONFIG.margin_right) / imagegrid;
        var new_img_width_in_columns = img_width_in_columns + diff_in_columns;
        var new_img_width;

        if (new_img_width_in_columns < 1) {
            // The image can not be smaller than one image column.
            new_img_width = imagegrid - CONFIG.margin_right;

        } else if (img_width_in_columns / CONFIG.images === orig_with_in_columns) {
            // Special case if the image has the same size as the block.
            new_img_width = new_with_in_columns * CONFIG.images * imagegrid - CONFIG.margin_right;

        } else if (new_img_width_in_columns / CONFIG.images > new_with_in_columns) {
            // The image can not be bigger than the block.
            new_img_width = new_with_in_columns * CONFIG.images * imagegrid - CONFIG.margin_right;

        } else {
            // Asynchronous resize
            new_img_width = new_img_width_in_columns * imagegrid - CONFIG.margin_right;
        }

        return new_img_width;

    };

    return utils;
});


