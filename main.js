var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.imageSmoothingEnabled= false

var canvasWidth = 640;
var canvasHeight = 640;

var gameGridWidth = 20;
var gameGridHeight = 20;

//stores the 20x20 game grid in a 400-length array
var gameGrid = [];

for(var i = 0; i < 400; i++) {
    gameGrid[i] = {id: 0};
}

//DEBUG DEBUG DEBUG
gameGrid[0] = {id: 1};
gameGrid[399] = {id: 2};
//END DEBUG

var panningEnabled = false;

var hovered = false;
var hoverId;
var selected = false;
var selectedId;

var oldX;
var oldY;

var displayZoomRatio = 32;
var displayXStart = 0;
var displayYStart = 0;

function redraw() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for(var i = 0; i < 400; i++) {
        var tile = gameGrid[i];
        var tilePosition = gridIndexToXY(i);

        context.drawImage(TILES[tile.id].backgroundImage, (tilePosition.x-displayXStart)*displayZoomRatio, (tilePosition.y-displayYStart)*displayZoomRatio, displayZoomRatio, displayZoomRatio);
        context.drawImage(TILES[tile.id].foregroundImage, (tilePosition.x-displayXStart)*displayZoomRatio, (tilePosition.y-displayYStart)*displayZoomRatio, displayZoomRatio, displayZoomRatio);
    }

    if(hovered) {
        context.fillStyle = "rgba(0, 63, 255, 0.5)";
        hoverTileCoords = gridIndexToXY(hoverId);
        context.fillRect((hoverTileCoords.x-displayXStart)*displayZoomRatio, (hoverTileCoords.y-displayYStart)*displayZoomRatio, displayZoomRatio, displayZoomRatio);
    }

    if(selected) {
        context.fillStyle = "rgba(0, 255, 0, 0.5)";
        selectedTileCoords = gridIndexToXY(selectedId);
        context.fillRect((selectedTileCoords.x-displayXStart)*displayZoomRatio, (selectedTileCoords.y-displayYStart)*displayZoomRatio, displayZoomRatio, displayZoomRatio);
    }
}

canvas.addEventListener('wheel', function(e) {
    if(e.deltaY < 0) {
        displayZoomRatio *= Math.sqrt(2);
        if(displayZoomRatio > Math.min(canvasWidth, canvasHeight)) {
            displayZoomRatio = Math.min(canvasWidth, canvasHeight);
        }
    }else{
        displayZoomRatio /= Math.sqrt(2);
        if(displayZoomRatio < Math.max(canvasWidth/gameGridWidth, canvasHeight/gameGridHeight)) {
            displayZoomRatio = Math.max(canvasWidth/gameGridWidth, canvasHeight/gameGridHeight);
        }
    }

    var impliedDisplayXEnd = displayXStart + canvasWidth/displayZoomRatio;
    var impliedDisplayYEnd = displayYStart + canvasHeight/displayZoomRatio;
    if(displayXStart < 0) {
        displayXStart = 0;
    }
    if(displayYStart < 0) {
        displayYStart = 0;
    }
    if(impliedDisplayXEnd > gameGridWidth) {
        displayXStart = gameGridWidth - canvasWidth/displayZoomRatio;
    }
    if(impliedDisplayYEnd > gameGridHeight) {
        displayYStart = gameGridHeight - canvasHeight/displayZoomRatio;
    }

    redraw();
});

canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if(panningEnabled) {
        var dx = x - oldX;
        var dy = y - oldY;
        oldX = x;
        oldY = y;
        displayXStart = displayXStart - dx/displayZoomRatio;
        displayYStart = displayYStart - dy/displayZoomRatio;
        var impliedDisplayXEnd = displayXStart + canvasWidth/displayZoomRatio;
        var impliedDisplayYEnd = displayYStart + canvasHeight/displayZoomRatio;
        if(displayXStart < 0) {
            displayXStart = 0;
        }
        if(displayYStart < 0) {
            displayYStart = 0;
        }
        if(impliedDisplayXEnd > gameGridWidth) {
            displayXStart = gameGridWidth - canvasWidth/displayZoomRatio;
        }
        if(impliedDisplayYEnd > gameGridHeight) {
            displayYStart = gameGridHeight - canvasHeight/displayZoomRatio;
        }
    }else{
        hovered = true;
        hoverId = canvasPositionToGridIndex(x+displayXStart*displayZoomRatio, y+displayYStart*displayZoomRatio);
    }

    redraw();
});

canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if(e.button == 0) { //left click
        panningEnabled = true;
        oldX = x;
        oldY = y;
    }

    if(e.button == 2) { //right click
        var temp = canvasPositionToGridIndex(x+displayXStart*displayZoomRatio, y+displayYStart*displayZoomRatio);
        if(temp == selectedId && selected) {
            selected = false;
        }else{
            selected = true;
            selectedId = temp;
        }
        redraw();
    }
});

canvas.addEventListener('mouseup', function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if(e.button == 0) { //left click
        panningEnabled = false;
    }
});

canvas.addEventListener('mouseout', function(e) {


    hovered = false;
})

function canvasPositionToGridIndex(x, y) {
    return XYtoGridIndex(Math.floor(x/displayZoomRatio), Math.floor(y/displayZoomRatio))
}

function XYtoGridIndex(x, y) {
    return y*gameGridWidth + x;
}

function gridIndexToXY(gridIndex) {
    return {x: gridIndex % gameGridWidth, y: Math.floor(gridIndex/gameGridWidth)};
}
