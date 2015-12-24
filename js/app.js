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
}


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
}


App.prototype.setup = function() {
  return;
  //creation de toutes les Cases
  this.id = 0;
  //pour avoir les 5 cases par ANGLE
  this.radiusMax = this.nbrCase*this.caseWidth;
  while(this.radiusMax>0){
    for(var i=0;i<360;i+=30){
      //creation de case
      this.maCase = new Case(this.centre.x,this.centre.y,this.radiusMax,this.angle,i,this.ctx,this.id,this.caseWidth);
      this.allCases.push(this.maCase);
      this.id++;
    }
    this.radiusMax-=this.caseWidth;
  }
  document.addEventListener("mousemove", this.onMouseMove.bind(this));
  document.addEventListener("click", this.onMouseClick.bind(this));
  this.draw();
}

App.prototype.diceManager = function(val){
  console.log("dice",val);
}

App.prototype.onMouseMove = function(e){
  //JUST FOR ROLLOVER
  for(var i=0;i<this.allCases.length;i++){
    this.allCases[i].check(e.pageX,e.pageY);
  }
}

App.prototype.onMouseClick = function(e){
  this.myCase;
  for(var i=0;i<this.allCases.length;i++){
    this.myCase = this.allCases[i].check(e.pageX,e.pageY);
    if(this.myCase!=undefined){
      break;
    }
  }
  //TWEEN JUST THE SELECTED CIRCLE
  if(this.myCase!=undefined){
    for(var i=0;i<this.allCases.length;i++){
      if(this.allCases[i].radius == this.myCase.radius){
        this.allCases[i].tween(30);
      }
    }
  }
}

App.prototype.draw = function() {
  var self = this;
  TWEEN.update();
  this.ctx.clearRect(0,0,this.w,this.h);
  //dessiner
  for(var i=0;i<this.allCases.length;i++){
    this.allCases[i].display();
  }

  setTimeout(function () {
    self.draw();
  }, 200);

  //requestAnimationFrame(this.draw.bind(this	));
}




