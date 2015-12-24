/**
 * Shuffle an array randomly and return the result
 */
function shuffle (array) {
  var rng = Math.random;
  var result = [];
  for (var i = 0; i < array.length; ++i) {
    var j = Math.floor(rng() * (i + 1));
    if (j !== i) {
      result[i] = result[j];
    }
    result[j] = array[i];
  }

  return result;
}


/**
 * Ease in and out cubic tweening function
 * @param {Number} t current time
 * @param {Number} b start value
 * @param {Number} c change in value
 * @param {Number} d duration
 */
function easeInOutCubic (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};



/**
 * Create a new board with R rows and S sectors
 */
var App = function (R, S) {
  // Board structure
  if (S % App.players.length !== 0) { throw "Number of sectors must be a multiple of max number of players (" + App.players.length + ")"; }
  this.R = R;
  this.S = S;
  this.board = [];
  for (var i = 0; i < R; i += 1) {
    this.board[i] = [];
    for (var j = 0; j < S / App.players.length; j += 1) {
      this.board[i] = this.board[i].concat(App.players);
    }
    this.board[i] = shuffle(this.board[i]);
  }

  // Players tokens
  var posishuns = [];
  for (j = 0; j < S; j += 1) {
    posishuns[j] = j;
  }
  posishuns = shuffle(posishuns);
  this.playersPositions = {};
  for (j = 0; j < App.players.length; j += 1) {
    this.playersPositions[App.players[j]] = { row: 0, s: posishuns[j] };
  }

  // Rendering, not the right place to put it but okay for the scope of this project
	this.w 				= window.innerWidth;
	this.h 				= window.innerHeight;
	this.canvas 		= document.getElementById('canvas');
	this.canvas.width 	= this.w;
	this.canvas.height 	= this.h;
	this.ctx 			= this.canvas.getContext('2d');

  this.boardRadius = 0.8 * Math.min(this.w, this.h) / 2;
  this.boardCenter = { x: this.w / 2, y: this.h / 2 };
  this.animationsDuration = 1000;



	this.angle 			= 30*Math.PI/180;
	this.caseWidth 		= 70;
	this.nbrCase		= 5;
	this.allCases 		= [];
	this.centre 		= {"x":window.innerWidth/2,"y":window.innerHeight/2};
}

// Players are referenced by their color
App.players = ['#ff0000', '#ffffff', '#ff00ff', '#0000ff', '#ffff00', '#00ffff'];


/**
 * Rotate internal board's row by val sectors, clockwise
 */
App.prototype.rotateBoard = function (row, val) {
  var self = this;

  // Rotate row
  var newRow = [], newJ;
  for (var j = 0; j < this.board[row].length; j += 1) {
    newJ = j + val;
    if (newJ >= this.board[row].length) { newJ -= this.board[row].length; }
    newRow[newJ] = this.board[row][j];
  }
  this.board[row] = newRow;

  // Update tokens positions after rotation
  App.players.forEach(function (player) {
    if (self.playersPositions[player].row === row) {
      self.playersPositions[player].s += val;
      if (self.playersPositions[player].s >= self.board[row].length) { self.playersPositions[player].s -= self.board[row].length; }
    }
  });

  // Advance if color match
  App.players.forEach(function (player) {
    if (self.board[self.playersPositions[player].row + 1][self.playersPositions[player].s] === player) {
      self.playersPositions[player].row += 1;
    }
  });

  // Check if player won
  App.players.forEach(function (player) {
    if (self.playersPositions[player].row === self.R - 1) {
      console.log(player + ' won! INCREDIBUL!!!');
    }
  });
};


/**
 * For debugging, log board state on console
 */
App.prototype.printBoard = function () {
  var msg;
  for (var i = 0; i < this.board.length; i += 1) {
    msg = "";
    for (var j = 0; j < this.board[i].length; j += 1) {
      msg += this.board[i][j] + "  |  ";
    }
    console.log(msg);
  }
};


/**
 * Get thetasmall/thetabig - the start and end angles - for a sector
 */
App.prototype.getSectorStep = function () {
  return (360 / this.S) * Math.PI / 180;
};

App.prototype.getThetaSmall = function (sector) {
  return sector * this.getSectorStep();
};

App.prototype.getThetaBig = function (sector) {
  return (sector + 1) * this.getSectorStep();
};


/**
 * Draw one "case" given its row and sector
 */
App.prototype.drawCase = function (row, sector, color) {
  this.drawCaseBetweenAngles(row, this.getThetaSmall(sector), this.getThetaBig(sector), color);
};


/**
 * Draw one "case" given its row, start end end angle (used for animations)
 * @param {Number} _options.lineWidth Optional, defaults to 1, width of the row's cases' lines
 */
App.prototype.drawCaseBetweenAngles = function (row, thetasmall, thetabig, color, _options) {
  var options = _options || {};

  // A, B, C, D are the four points delimiting the "case"
  var rstep = this.boardRadius / this.R
    , rbig = rstep * (this.R - row)
    , rsmall = rstep * (this.R - row - 1)
    , ts_vector = { x: Math.sin(thetasmall), y: - Math.cos(thetasmall) }
    , tb_vector = { x: Math.sin(thetabig), y: - Math.cos(thetabig) }
    , a = { x: this.boardCenter.x + rsmall * ts_vector.x, y: this.boardCenter.y + rsmall * ts_vector.y }
    , b = { x: this.boardCenter.x + rbig * ts_vector.x, y: this.boardCenter.y + rbig * ts_vector.y }
    , c = { x: this.boardCenter.x + rbig * tb_vector.x, y: this.boardCenter.y + rbig * tb_vector.y }
    , d = { x: this.boardCenter.x + rsmall * tb_vector.x, y: this.boardCenter.y + rsmall * tb_vector.y }
    ;

  this.ctx.beginPath();
  this.ctx.fillStyle = color;
  this.ctx.strokeStyle = '#8ec448';
  this.ctx.lineWidth = options.lineWidth || 1;
  this.ctx.moveTo(a.x, a.y);
  this.ctx.lineTo(b.x, b.y);
  this.ctx.arc(this.boardCenter.x, this.boardCenter.y, rbig, thetasmall - Math.PI / 2, thetabig - Math.PI / 2);
  this.ctx.lineTo(d.x, d.y);
  this.ctx.arc(this.boardCenter.x, this.boardCenter.y, rsmall, thetabig - Math.PI / 2, thetasmall - Math.PI / 2, true);
  this.ctx.fill();
  this.ctx.stroke();
  this.ctx.closePath();
};


/**
 * Draw the entire board
 */
App.prototype.drawBoard = function () {
  this.ctx.clearRect(0, 0, this.w, this.h);

  for (var row = 0; row < this.R; row += 1) {
    for (var sector = 0; sector < this.S; sector += 1) {
      this.drawCase(row, sector, this.board[row][sector]);
    }
  }
};


/**
 * Redraw a specific row
 * @param {Number} _options.angleOffset Optional, defaults to 0, clockwise angle offset. Authoritative if both angle and sector offsets are supplied.
 * @param {Number} _options.sectorOffset Optional, defaults to 0, sector offset.
 * @param {Number} _options.lineWidth Optional, defaults to 1, width of the row's cases' lines
 */
App.prototype.redrawRow = function (row, _options) {
  var options = _options || {};
  var angleOffset = 0;
  if (options.sectorOffset) { angleOffset = options.sectorOffset * this.getSectorStep(); }
  if (options.angleOffset) { angleOffset = options.angleOffset; }

  for (var sector = 0; sector < this.S; sector += 1) {
    this.drawCaseBetweenAngles(row, this.getThetaSmall(sector) + angleOffset, this.getThetaBig(sector) + angleOffset, this.board[row][sector], { lineWidth: options.lineWidth });
  }
};


/**
 * Animate row rotation from current position to sector offset for the given duration
 * @param {Number} row Row to animate
 * @param {Number} sectorOffset How many sectors should the row move to, clockwise
 * @param {Number} duration Duration of animation
 * @param {Number} beginning INTERNAL, don't supply it
 */
App.prototype.animateRowRotation = function (row, sectorOffset, duration, beginning) {
  var self = this;
  if (beginning === undefined) { beginning = Date.now(); }
  self.redrawRow(row, { sectorOffset: easeInOutCubic(Date.now() - beginning, 0, sectorOffset, duration) });

  this.animating = true;   // Keep track that we're animating canvas to avoid repainting due to mouseover

  if (Date.now() - beginning < duration) {
    requestAnimationFrame(function () {
      self.animateRowRotation(row, sectorOffset, duration, beginning);
    });
  } else {
    this.animating = false;
  }
};


/**
 * Play dice value on a given row (updates internal state and animates the row)
 */
App.prototype.playDiceValue = function (row, val) {
  var self = this;

  this.drawBoard();   // Remove any highlight before animation

  // Wait for animation to have ended before updating internal board to avoid interferences
  function checkAnimationDoneAndUpdateBoard () {
    if (! self.animating) {
      self.rotateBoard(row, val);
      self.drawBoard();
    } else {
      requestAnimationFrame(checkAnimationDoneAndUpdateBoard);
    }
  }

  this.animateRowRotation(row, val, this.animationsDuration);
  setTimeout(checkAnimationDoneAndUpdateBoard, this.animationsDuration);
};


/**
 * Get row corresponding to given coordinates
 * Returns null if outside of the board
 */
App.prototype.getRow = function (x, y) {
  var d = Math.sqrt((this.boardCenter.x - x) * (this.boardCenter.x - x) + (this.boardCenter.y - y) * (this.boardCenter.y - y))
    , rstep = this.boardRadius / this.R
    , row = Math.floor(d / rstep)
    ;

  row = this.R - 1 - row;

  if (row >= 0) { return row; } else { return null; }
};


/**
 * Given a mousemove event, gets coordinates of cursor and highlight the corresponding row
 */
App.prototype.highlightRow = function (evt) {
  if (!evt.offsetX || !evt.offsetY) { return; }   // Don't throw error as it can be an edge case
  if (this.animating) { return; }   // No highlight during animation

  var row = this.getRow(evt.offsetX, evt.offsetY);

  if (row !== null) {
    this.drawBoard();
    this.redrawRow(row, { lineWidth: 8 });
  } else {
    this.drawBoard();
  }
};


/**
 * Given a mouse click event, rotate row
 */
App.prototype.onMouseClick = function (evt) {
  if (!evt.offsetX || !evt.offsetY) { return; }   // Don't throw error as it can be an edge case
  if (this.animating) { return; }   // No highlight during animation

  var row = this.getRow(evt.offsetX, evt.offsetY);


  if (row !== null) {
    if (this.currentDiceValue === undefined) { return console.log("No dice available to play"); }
    console.log("Rotating row " + row + ", " + this.currentDiceValue + " steps");
    this.playDiceValue(row, this.currentDiceValue);
    delete this.currentDiceValue;   // Can't play same dice twice
  }
};


/**
 * Update current dice value
 */
App.prototype.newDiceValue = function (val) {
  this.currentDiceValue = val;
};


/**
 * Initialization
 */
App.prototype.setup = function() {
  var self = this;
  this.drawBoard();
  this.canvas.addEventListener('mousemove', function (e) { self.highlightRow(e); });
  this.canvas.addEventListener("click", function (e) { self.onMouseClick(e); });
}

