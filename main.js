var CELL_SIZE = 10;
var HEIGHT = null;
var WIDTH = null;
var CELL_COUNT = null;
var canvas = document.getElementById("c");
var context = canvas.getContext('2d');
var cells = [];
var neighborMap = [];
var timeOfLastFrame = new Date().getTime();
var running = false;

function init() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  HEIGHT = Math.floor(canvas.height / CELL_SIZE);
  WIDTH = Math.floor(canvas.width / CELL_SIZE);
  CELL_COUNT = HEIGHT * WIDTH;
}

function paint() {
  for(var i = 0; i < CELL_COUNT; i++) {
    if (cells[i] === 1) {
      var x = i % WIDTH;
      var y = (i - (i % WIDTH)) / WIDTH;
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function paintGrid() {
  context.strokeStyle = '#ddd';

  for(var i = 0; i < WIDTH; i++) {
    context.beginPath();
    context.moveTo(i * 10, 0);
    context.lineTo(i * 10, canvas.height);
    context.stroke();
  }

  for(var j = 0; j < HEIGHT; j++) {
    context.beginPath();
    context.moveTo(0, j * 10);
    context.lineTo(canvas.width, j * 10);
    context.stroke();
  }
}

function getNeighborLocations(i) {
  var topLeft = i - WIDTH - 1;
  var topMiddle = i - WIDTH;
  var topRight = i - WIDTH + 1;
  var middleLeft = i - 1;
  var middleRight = i + 1;
  var bottomLeft = i + WIDTH - 1;
  var bottomMiddle = i + WIDTH;
  var bottomRight = i + WIDTH + 1;
  var neighbors = [topLeft, topMiddle, topRight, middleLeft, middleRight, bottomLeft, bottomMiddle, bottomRight];
  return neighbors;
}

function tick() {
  neighborMap = [];
  for(var i = 0; i < CELL_COUNT; i++) {
    if (cells[i] === 1) {
      // Increase neightbor count in neightbor map
      var neighbors = getNeighborLocations(i);
      for(var j = 0; j < neighbors.length; j++) {
        var cellLocation = neighbors[j];
        neighborMap[cellLocation] = neighborMap[cellLocation] ? neighborMap[cellLocation] + 1 : 1;
      }
    }
  }

  for(var i = 0; i < CELL_COUNT; i++) {
    if (neighborMap[i] < 2) {
      cells[i] = 0;
    }
    else if (neighborMap[i] === 3 && !cells[i]) {
      cells[i] = 1;
    }
    else if ((neighborMap[i] >= 2 && neighborMap[i] <= 3) && cells[i] === 1) {
      cells[i] = 1;
    }
    else {
      cells[i] = 0;
    }
  }
}

function clear() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function animate() {
  var currentTime = new Date().getTime();

  if ((currentTime - timeOfLastFrame) >= (1000 / 3) && running) {
    clear();
    tick();
    paint();
    timeOfLastFrame = new Date().getTime();
  }
  requestAnimationFrame(animate);
}

document.addEventListener("keypress", function(e) {
  if (e.keyCode === 32) {
    e.preventDefault();
    running = !running;
    if (!running) {
      paintGrid();
    }
  }
});

canvas.addEventListener("click", function(e) {
  var row = Math.floor(e.clientY / CELL_SIZE);
  var col = Math.floor(e.clientX / CELL_SIZE);
  cellLocation = (row * WIDTH) + col;
  cells[cellLocation] = cells[cellLocation] ? 0 : 1;
  clear();
  paint();
  if (!running) {
    paintGrid();
  }
});

init();
paintGrid();
animate();
