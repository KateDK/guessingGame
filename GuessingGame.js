/**Game
V-Game.prototype.playersGuessSubmission
V-Game.prototype.checkGuess
V-Game.prototype.difference
V-Game.prototype.isLower
Game.prototype.provideHint
V-generateWinningNumber
newGame
V-shuffle */


//generate a number from 1-100
function generateWinningNumber() {
    var val = Math.floor(Math.random() * 100)+1;
    return val;
}

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }


  
    return array;
  }

//end of helper functions


function Game(){
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

function newGame(){
    return new Game;
}

//Game prototypes

Game.prototype.difference = function(){
   return Math.abs(this.playersGuess - this.winningNumber);
   //to calculate the absolute difrence we can use Math.abs - the point is to get the same result between (1,2) and (2,1): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
    if (num < 1 || num > 100 || typeof num !== 'number'){
        throw "That is an invalid guess.";
    }else{
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function(){
    if(this.playersGuess === this.winningNumber){
        return "You Win!";
    }else if( this.pastGuesses.indexOf(this.playersGuess) >= 0){
        return "You have already guessed that number.";
    }else{
        this.pastGuesses.push(this.playersGuess);
        if(this.pastGuesses.length >= 5){
            return "You Lose.";
        }if(this.difference() < 10){
            return "You're burning up!";
        }else if(this.difference() < 25){
            return "You're lukewarm.";
        }else if(this.difference() < 50){
            return "You're a bit chilly."
        }else{
            return "You're ice cold!";
        }
    }
}

Game.prototype.provideHint = function(){
    var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArr);
}
