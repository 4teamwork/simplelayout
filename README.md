# Simplelayout

Javascript Library for organising Layouts with drag and drop.

## Dependencies

JQuery 1.6+

jsrender 1.0.0-beta (https://github.com/BorisMoore/jsrender)

JQueryUI 1.10.2 (draggable/droppable/sortable)

npm 2.0.0

## Install

### Install Node Dependencies
```bash
npm install
```
### Install Bower Dependencies
```bash
bower install
```
### Build

Dev (default):
Does not optimize javascript and CSS files.
Starts grunt watcher.
Executes eslinter.
```bash
grunt
```

Prod:
Optimizes javascript and CSS files for production. Executes eslinter.
```bash
grunt prod
```
## Get started

With existing DOM ready to serialize.

```javascript
(function() {
  "use strict";
  $(document).ready(function() {
    var simplelayout = new Simplelayout({
      width: "900px",
      source: "#simplelayout"
    });

    var toolbox = new Toolbox({
      layouts: [1, 2, 4],
      components: {
        listingblock: {
          title: "Listingblock",
          description: "can list things",
          contentType: "listingblock",
          formUrl: "http://www.google.com",
          actions: {
            edit: {
              name: "edit",
              description: "Edit this block"
            }
          }
        },
        textblock: {
          title: "Textblock",
          description: "can show text",
          contentType: "textblock",
          formUrl: "http://www.bing.com",
          actions: {
            edit: {
              name: "edit",
              description: "Edit this block"
            },
            download: {
              name: "download",
              description: "Download this content"
            }
          }
        }
      }
    });

    toolbox.attachTo($("body"));
    simplelayout.attachToolbox(toolbox);
    simplelayout.getLayoutmanager().deserialize();
  });
}());
```

#Toolbox

## Options

Select layouts that can be dragged from the toolbox.
```javascript
{layouts : [1]} // --> Raises exeption when no layouts are defined
```

Select the provided components
```javascript
components: {
  listingblock: {
    title: "Listingblock",
    description: "can list things",
    contentType: "listingblock",
    formUrl: "http://www.google.com",
    actions: {
      edit: {
        name: "edit",
        description: "Edit this block"
      }
    }
  },
  textblock: {
    title: "Textblock",
    description: "can show text",
    contentType: "textblock",
    formUrl: "http://www.bing.com",
    actions: {
      edit: {
        name: "edit",
        description: "Edit this block"
      },
      download: {
        name: "download",
        description: "Download this content"
      }
    }
  }
}
```

title --> Title in toolbox.
description --> Used for title attribute
contentType --> Must be unique. Used for internal reasons.
formUrl --> URL will be called when adding that block.
actions --> Define actions for this block.
  name --> Used for generating elements class.
  description --> Used for title attribute.

## API

Attach Element to JQuery Node
```javascript
toolbox.attachTo($('body'));
```

#Simplelayout

## Options

Select number of image per column (oriented on biggest layout in toolbox)
```javascript
{imageCount : 1} // Default is 1
```

Define width of layoutmanager
```javascript
{width : '800px'} // Default is 100%
```

## API

Attach Element

Must have been called before attaching a toolbox. Otherwise will raise an exception so the layoutmanager knows his context
```javascript
simplelayout.attachTo($('body'));
```

Get JQuery Element
```javascript
simplelayout.getElement();
```

Attach Toolbox
```javascript
simplelayout.attachToolbox(toolbox);
```

Eventbinding
```javascript
simplelayout.on(eventType, callbackFunction);
```

## Eventtypes

layoutInserted(event, layoutId)

layoutDeleted(event)

layoutsCommited(event)

blocksInserted(event, layoutId, columnId, blockId)

blockDeleted(event, layoutId, columnId, blockId)

blocksCommitted(event)

blockMoved(event, oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId)

deserialized(event)

# Plone-Intergration

## Endpoints

Saving: /save_state
Produces JSON.

```javascript
{
  "layouts": [1, 2, 1],
  "blocks": [{
    "layoutPos": 0,
    "columnPos": 0,
    "blockPos": 0,
    "uid": "fe0cd15feedb49469033e783d1340545"
  }, {
    "layoutPos": 1,
    "columnPos": 0,
    "blockPos": 0,
    "uid": "35df1fc8aadb11e489d3123b93f75cba"
  }, {
    "layoutPos": 1,
    "columnPos": 1,
    "blockPos": 0,
    "uid": "1951bb7caadb11e489d3123b93f75cba"
  }, {
    "layoutPos": 2,
    "columnPos": 0,
    "blockPos": 0,
    "uid": "fe0cd15feedb49469033e783d1340545"
  }]
}
```

- The numbers in the layouts Array defines total columns.
- uid represents the object in the database.

Loading: /load_state
Produces HTML.

```html
<div id="simplelayout" class="sl-simplelayout ui-droppable ui-sortable" style="width:900px;">
  <div class="sl-layout">
    <div class="sl-column sl-col-1 ui-droppable ui-sortable">
      <div data-type="textblock" data-uid="fe0cd15feedb49469033e783d1340545" class="sl-block">
        <!-- Block content -->
      </div>
    </div>
  </div>
  <div class="sl-layout">
    <div class="sl-column sl-col-2 ui-droppable ui-sortable">
      <div data-type="textblock" data-uid="35df1fc8aadb11e489d3123b93f75cba" class="sl-block">
        <!-- Block content -->
      </div>
    </div>
    <div class="sl-column sl-col-2 ui-droppable ui-sortable">
      <div data-type="textblock" data-uid="1951bb7caadb11e489d3123b93f75cba" class="sl-block">
        <!-- Block content -->
      </div>
    </div>
  </div>
  <div class="sl-layout">
    <div class="sl-column sl-col-1 ui-droppable ui-sortable">
      <div data-type="textblock" data-uid="fe0cd15feedb49469033e783d1340545" class="sl-block">
        <!-- Block content -->
      </div>
    </div>
  </div>
</div>
```

Loading Toolbox definition: /addable_blocks
Produces JSON
```Javascript
{
  listingblock: {
    title: "Listingblock",
    description: "can list things",
    contentType: "listingblock",
    formUrl: "http://www.google.com",
    actions: {
      edit: {
        name: "edit",
        description: "Edit this block"
      }
    }
  },
  textblock: {
    title: "Textblock",
    description: "can show text",
    contentType: "textblock",
    formUrl: "http://www.bing.com",
    actions: {
      edit: {
        name: "edit",
        description: "Edit this block"
      },
      download: {
        name: "download",
        description: "Download this content"
      }
  }
}
```

Deleting Blocks: /delete_blocks

data: A list of uids.
confirmed: If true the blocks will be deleted otherwise not.

Comsumes JSON
```Javascript
{
  blocks: [
    "41274c3ab9df4eb38e1fc12cff5df1e0",
    "8dc61996b4bb42a8a2904b8c41f6c9d3",
    "42d3b4c6f3984773b55fb4e9dfc93499"
  ],
  confirmed: false/true
}