var TILES = [
    {
        id: 0,
        debugName: "TILE_FLOOR",
        displayName: "Floor",
        backgroundImage: loadImage("res/tiles/floor_bg.png"),
        foregroundImage: loadImage("res/tiles/floor_fg.png"),
        purchaseValue: 0,
        sellValue: 0,
        recipes: [
            {
                inputs: [],
                outputs: []
            }
        ],
        workRate: -1
    },
    {
        id: 1,
        debugName: "TILE_CONVEYOR",
        displayName: "Conveyor Belt",
        backgroundImage: loadImage("res/tiles/conveyor_bg.png"),
        foregroundImage: loadImage("res/tiles/conveyor_fg.png"),
        purchaseValue: 500,
        sellValue: 450,
        recipes: [
            {
                inputs: [1],
                outputs: [1]
            },
            {
                inputs: [2],
                outputs: [2]
            },
            {
                inputs: [3],
                outputs: [3]
            },
            {
                inputs: [4],
                outputs: [4]
            },
            {
                inputs: [5],
                outputs: [5]
            },
            {
                inputs: [6],
                outputs: [6]
            }
        ],
        workRate: -1
    },
    {
        id: 2,
        debugName: "TILE_COPPER_STARTER",
        displayName: "Copper Starter",
        backgroundImage: loadImage("res/tiles/copper_starter_bg.png"),
        foregroundImage: loadImage("res/tiles/copper_starter_fg.png"),
        purchaseValue: 200,
        sellValue: 200,
        recipes: [
            {
                inputs: [],
                outputs: [1]
            }
        ],
        workRate: -1

    },
    {
        id: 4,
        debugName: "TILE_IRON_STARTER",
        displayName: "Iron Starter",
        backgroundImage: loadImage("res/tiles/iron_starter_bg.png"),
        foregroundImage: loadImage("res/tiles/iron_starter_fg.png"),
        purchaseValue: 200,
        sellValue: 200,
        recipes: [
            {
                inputs: [],
                outputs: [2]
            }
        ],
        workRate: -1
    },
    {
        id: 3,
        debugName: "TILE_GOLD_STARTER",
        displayName: "Gold Starter",
        backgroundImage: loadImage("res/tiles/gold_starter_bg.png"),
        foregroundImage: loadImage("res/tiles/gold_starter_fg.png"),
        purchaseValue: 200,
        sellValue: 200,
        recipes: [
            {
                inputs: [],
                outputs: [3]
            }
        ],
        workRate: -1
    },
    {
        id: 5,
        debugName: "TILE_SELLER",
        displayName: "Seller",
        backgroundImage: loadImage("res/tiles/seller_bg.png"),
        foregroundImage: loadImage("res/tiles/seller_fg.png"),
        purchaseValue: 250,
        sellValue: 250,
        recipes: [
            {
                inputs: [],
                outputs: []
            }
        ],
        workRate: -1
    },
    {
        id: 6,
        debugName: "TILE_WIRE_DRAWER",
        displayName: "Wire Drawer",
        backgroundImage: loadImage("res/tiles/wire_drawer_bg.png"),
        foregroundImage: loadImage("res/tiles/wire_drawer_fg.png"),
        purchaseValue: 1000,
        sellValue: 900,
        recipes: [
            {
                inputs: [1],
                outputs: [4]
            },
            {
                inputs: [2],
                outputs: [5]
            },
            {
                inputs: [3],
                outputs: [6]
            },
        ],
        workRate: -1
    }
];

var ITEMS = [
    {
        id: 1,
        debugName: "COPPER_RAW",
        displayName: "Raw Copper",
        itemImage: loadImage("res/items/copper_raw.png"),
        sellValue: 5
    },
    {
        id: 2,
        debugName: "IRON_RAW",
        displayName: "Raw Iron",
        itemImage: loadImage("res/items/iron_raw.png"),
        sellValue: 5
    },
    {
        id: 3,
        debugName: "GOLD_RAW",
        displayName: "Raw Gold",
        itemImage: loadImage("res/items/gold_raw.png"),
        sellValue: 5
    },
    {
        id: 4,
        debugName: "COPPER_WIRE",
        displayName: "Copper Wire",
        itemImage: loadImage("res/items/copper_wire.png"),
        sellValue: 10
    },
    {
        id: 5,
        debugName: "IRON_WIRE",
        displayName: "Iron Wire",
        itemImage: loadImage("res/items/iron_wire.png"),
        sellValue: 10
    },
    {
        id: 6,
        debugName: "GOLD_WIRE",
        displayName: "Gold Wire",
        itemImage: loadImage("res/items/gold_wire.png"),
        sellValue: 10
    },
];

var totalResources = 13;
var loadedResources = 0;

function loadImage(url) {
  var img = new Image();
  img.onload = (function() {loadedResources++;blah();});
  img.src = url;
  return img;
}

function blah() {
    if(loadedResources == totalResources) {
        redraw();
    }
}
