//------------helper functions---------------

//generate a number from 1-100
function generateWinningNumber() {
    var val = Math.floor(Math.random() * 100)+1;
    return val;
}

//Fisher-Yates - https://bost.ocks.org/mike/shuffle/
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

//---------end of helper functions----------

function Game() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

function newGame() {
    return new Game;
}

//----------------Game prototypes----------------

Game.prototype.difference = function() {
   return Math.abs(this.playersGuess - this.winningNumber);
   //to calculate the absolute difrence we can use Math.abs - the point is to get the same result between (1,2) and (2,1): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || Number.isNaN(num)){
        $("#subtitle").text("Guess a number between 1-100!");
        return "That is an invalid guess.";

    }else{
        this.playersGuess = num;
        return this.checkGuess();
    }
}
Game.prototype.gameOver = function() {
    $("#reset").focus();
    $('#hint, #submit, #player-input').prop("disabled",true);
    $('#subtitle').text("Press the Reset button to play again!");
}
Game.prototype.reset = function() {
    $("#guess-list li").text("-");
    $('#hint, #submit, #player-input').prop("disabled",false);
    $("#player-input").val("");
    $("#title").text("Guessing Game!");
    $("#subtitle").text("Take the challenge! Guess a number between 1-100!");
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber){
        this.gameOver();
        $('#guess-list li:nth-child('+ (this.pastGuesses.length +1)+')').text(this.playersGuess);
        return "You Win!";

    }else if( this.pastGuesses.indexOf(this.playersGuess) >= 0) {
        this.whatToGuess();
        return "You have already guessed that number.";

    }else{
        $('#guess-list li:nth-child('+ (this.pastGuesses.length +1)+')').text(this.playersGuess);
        this.pastGuesses.push(this.playersGuess);

        if(this.pastGuesses.length >= 5) {
            this.gameOver();
            return "You Lose. The secret number was: " + this.winningNumber;

        }if(this.difference() < 10) {
            this.whatToGuess();
            return "You're burning up!";

        }else if(this.difference() < 25) {
            this.whatToGuess();
            return "You're lukewarm.";

        }else if(this.difference() < 50) {
            this.whatToGuess();
            return "You're a bit chilly.";
            
        }else{
            this.whatToGuess();
            return "You're ice cold!";
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArr);
}

Game.prototype.whatToGuess = function() {
    if(this.isLower()) {
        $('#subtitle').text("Guess higher!");

    }else{
        $('#subtitle').text("Guess lower!");
    }
}

// -----------------JQUERY---------------------

function makeGuess(gameplay) {
    var input = Number($('#player-input').val());
    $('#title').text(gameplay.playersGuessSubmission(input));
    $('#player-input').val("");
}

$(document).ready(function() {
    var gameplay = newGame();

    //check if browser is on mobile device, change input type
    //check if mobile: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
    //change input type: https://stackoverflow.com/questions/3541514/jquery-change-input-type
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('#player-input').clone().attr('type','number').insertAfter('#player-input').prev().remove();
    }
    
    $('#submit').click(function() {
        makeGuess(gameplay);
        $("#player-input").focus();
    });

    $( "#player-input").keypress(function(event) {
        //checking if the button clicked is enter
        if (event.which == 13 ) {
           makeGuess(gameplay);
        }
    });

    $('#reset').click(function() {
        gameplay = newGame();
        gameplay.reset();
        $("#player-input").focus();
    });

    $('#hint').click(function() {
        $('#title').text('The secret number is one of those '+ gameplay.provideHint());
        $("#player-input").focus();
    });

});
