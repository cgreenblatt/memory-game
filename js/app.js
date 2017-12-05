/*
 * Create a list that holds all of your cards
 */

    let Deck = function() {}

    Deck.prototype.shuffle = function(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
    }


let Game = function() {

    this.symbolToMatch = undefined;
    this.elementToMatch = undefined;
    this.moves = 0;
    this.stars = 3;
    this.matched = 0;
    this.cardsJQ = $(".card");
    this.deckJQ = $(".deck");
    this.deck = new Deck();
    this.movesJQ = $( ".moves" );
    this.restartJQ = $(".restart");
    this.starsJQ = $(".stars");
    this.restartJQ.click(function() {
        game.startNewGame();
    });
    this.buttonJQ = $("button");
    this.buttonJQ.click(function() {
        game.buttonHandler();
    })
    this.winOverlayJQ = $(".win-overlay");
    this.winDataJQ = $(".win-data");
}

Game.prototype.isWon = function() {
    console.log(this.cardsJQ.length + " " + this.matched);
    if (this.matched === 2)return true;
    return (this.matched === this.cardsJQ.length);
}

Game.prototype.showWinOverlay = function() {
    this.winOverlayJQ.addClass("show");
    this.deckJQ.addClass("hide");
}

Game.prototype.addMove = function() {
    this.moves++;
    this.movesJQ.text(this.moves);

}

Game.prototype.addMatched = function() {
    this.matched+=2;
}

Game.prototype.subtractStar = function() {
    this.stars--;
}

Game.prototype.startNewGame = function() {

    this.cardsJQ.removeClass().addClass("card");
    this.cardArray = this.deck.shuffle(this.cardsJQ.toArray());
    this.deckJQ.empty();
    this.deckJQ.append(this.cardArray);
    this.cardsJQ.click(this.clickHandler);
    this.matched = 0;
    this.moves = 0;
    this.movesJQ.text("0");
    this.stars = 3;
    this.starsJQ.empty();
}

Game.prototype.buttonHandler = function() {
    game.startNewGame();
    game.winOverlayJQ.removeClass("show");
    game.deckJQ.removeClass("hide");
}


Game.prototype.clickHandler = function() {

    // ignore clicks on green (matched cards) and current blue card
    if ((this.elementToMatch === this) || $( this ).hasClass("match")) {
        return;
    }

    game.addMove();
    // get symbol of flipped card
    const symbolElement = $( this ).children("i");
    const selectedSymbol = $( this ).children("i").attr("class");

    // if this card is first card of matched pair
    if (game.elementToMatch === undefined) {
        game.elementToMatch = this;  // initialize
        game.symbolToMatch = selectedSymbol;
        $( this ).removeClass().addClass("card turn");

    } else {
        if (game.symbolToMatch === selectedSymbol) {
            game.addMatched();
            $( this ).removeClass().addClass("card turn-distort match");
            $( game.elementToMatch ).removeClass().addClass("card distort match");
            if (game.isWon()) {
                console.log("game is won");
                game.showWinOverlay();
                game.winDataJQ.text( `With ${game.moves} Moves and ${game.stars} ${game.stars === 1? "Star": "Stars"}`);
            }

        } else {  // not a match

            // turn card just clicked on, change to red, tilt, and turn face down
            if ($( this ).hasClass("turn-tilt-turn1"))
                $( this ).removeClass().addClass("card turn-tilt-turn2");

            else
                $( this ).removeClass().addClass("card turn-tilt-turn1");

            // change to red, tilt, and turn face down
            $( game.elementToMatch ).removeClass().addClass("card tilt-turn")
        }
             game.symbolToMatch = undefined;
             game.elementToMatch = undefined;
    }


}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Modify HTML to place all cards face down
//function faceDown(cards) {}

// Shuffle function from http://stackoverflow.com/a/2450976




/* restart.click(startNewGame);
startNewGame(); */

const game = new Game();
game.startNewGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
