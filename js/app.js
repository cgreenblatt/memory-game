/**
/* @description Represents a card
/* @constructor
/* @param {DOM element} cardDOM the DOM element for this card}
*/
let Card = function(cardDOM) {

    this.cardDOM = cardDOM;
    this.cardJQ = $( cardDOM );
    this.iJQ = $( this.cardDOM ).children('i');
    this.clickCnt = 0;
    this.status = 'not matched';
    this.fontChar = this.iJQ.attr('class');
}
/**
/* @description Resets this card to it's initial state
*/
Card.prototype.reset = function() {

    this.clickCnt = 0;
    this.status = 'not matched';
    this.cardJQ.removeClass().addClass('card');
}

/**
/* @description Gets this card's FontAwesome character
/* @returns {string} this card's character, for example 'fa fa-bomb'
*/
Card.prototype.getFontChar = function() {

    return this.fontChar;
}

/**
/* @description Sets this card's FontAwesome character, for example 'fa fa-bomb'
/* @param {string} fontChar the FontAwsome character
*/
Card.prototype.setFontChar = function(fontChar) {

    this.iJQ.removeClass().addClass(fontChar);
    this.fontChar = fontChar;
}

/**
/* @description Adds class to this card's DOM element to cause animation for match
*/
Card.prototype.animateMatch = function() {

    this.status = 'matched';
    this.cardJQ.removeClass().addClass('card distort match');
}

/**
/* @description Adds class to this card's DOM element to cause animation for no match
*/
Card.prototype.animateMatchFail = function() {

    this.status = 'not matched';
    this.cardJQ.removeClass().addClass('card tilt-turn');
}

/**
/* @description Gets the click count for this card
/* @return {number} the click count for this card
*/
Card.prototype.getClickCnt = function() {

    return this.clickCnt;
}

/**
/* @description event handler for card click
*/
Card.prototype.clickHandler = function() {

    this.clickCnt++;
    // this card is already matched or open - do nothing
    if ((this.status === 'matched') || (this.status === 'open'))
        return;

    switch(game.requestResponse(this)) {
        // card needs to be turned face up
        case 'turn':
            this.status = 'open';
            this.cardJQ.removeClass().addClass('card turn');
            break;
        // card needs to be turned face up and distorted, it's a match
        case 'match':
            this.status = 'matched';
            this.cardJQ.removeClass().addClass('card turn-distort match');
            break;
        // card needs to be turned face up, tilted, and turned face down, it's not a match
        case 'no match':
            this.status = 'not matched';
            if (this.clickCnt % 2 === 1)
                this.cardJQ.removeClass().addClass('card turn-tilt-turn1');
            else
                this.cardJQ.removeClass().addClass('card turn-tilt-turn2');
    }
}

/**
/* @description Represents the deck
/* @constructor
*/
let Deck = function() {

    this.cards = [];
    this.deckJQ = $('.deck');
    let cardDOMs = $( '.card' ).toArray();
    for (let i = 0; i < cardDOMs.length; i++) {
        this.cards[i] = new Card(cardDOMs[i]);
        $( this.cards[i].cardDOM ).click(function() {
           game.deck.cards[i].clickHandler();
        });
    }
}

/**
/* @description Hides the deck
*/
Deck.prototype.hide = function() {

    this.deckJQ.removeClass('show').addClass('hide');
}

/**
/* @description Shows the deck
*/
Deck.prototype.show = function() {

    this.deckJQ.removeClass('hide').addClass('show');
}

/**
/* @description Shuffles the deck, algorithm from Stack Overflow
*/
Deck.prototype.shuffle = function() {

    let currentIndex = this.cards.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = this.cards[currentIndex].getFontChar();
        this.cards[currentIndex].setFontChar(this.cards[randomIndex].getFontChar());
        this.cards[randomIndex].setFontChar(temporaryValue);
    }
}

/**
/* @description Prepares the deck for a new game
*/
Deck.prototype.newGame = function() {

    this.shuffle();
    for (let i = 0; i < this.cards.length; i++)
        this.cards[i].reset();
}

/**
/* @description Represents the game won overlay
/* @constructor
*/
let WinOverlay = function() {

    this.winOverlayJQ = $('.win-overlay');
    this.winDataJQ = $('.win-data');
    $('button').click(function() {
        game.buttonHandler();
    });
}

/**
/* @description Shows the game won overlay
*/
WinOverlay.prototype.show = function() {

    this.winOverlayJQ.removeClass('hide').addClass('show');
    this.winDataJQ.text( `Game won in ${game.elapsedTime.toFixed(1)} seconds with ${game.moves} Moves and ${game.stars} ${game.stars === 1? 'Star': 'Stars'}`);
}

/**
/* @description Hides the game won overlay
*/
WinOverlay.prototype.hide = function() {

    this.winOverlayJQ.removeClass('show').addClass('hide');
}

/**
/* @description Represents the game
/* @constructor
*/
let Game = function() {

    this.deck = new Deck();
    this.cardToMatch = undefined;
    this.moves = 0;
    this.movesJQ = $( '.moves' );
    this.stars = 3;
    this.starsJQ = $( '.stars' );
    this.matchCnt = 0;
    this.winOverlay = new WinOverlay();
    this.timerJQ = $( '.timer' );
    this.timerFunction = undefined;
    this.elapsedTime = 0;
    this.gameStats = [];
    this.restartJQ = $('.restart');
    $('.restart').click(function() {
        game.startNewGame();
    });
}

/**
/* @description Starts the timer
*/
Game.prototype.startTimer = function() {

    this.timerFunction = setInterval(function() {
        game.elapsedTime += .1;
        game.timerJQ.text(game.elapsedTime.toFixed(1));
    }, 100);
}

/**
/* @description Resets the timer
*/
Game.prototype.resetTimer = function() {

    if (this.timerFunction != undefined)
        clearInterval(game.timerFunction);
    this.elapsedTime = 0;
    this.timerJQ.text('');
}

/**
/* @description Event handler for button click
*/
Game.prototype.buttonHandler = function () {

        this.startNewGame();
        this.winOverlay.hide();
        this.deck.show();
}

/**
/* @description Determines if game is won
/* @return {boolean} true if game is won
*/
Game.prototype.isWon = function() {

    return (this.matchCnt === this.deck.cards.length);
}

/**
/* @description Updates the score panel stars
/* @param {number} clickCnt number of times card has been clicked on
*/
Game.prototype.updateStars = function(clickCnt) {

    // change full star to half star if card is clicked on more than twice
    if (clickCnt > 2 && this.stars > 0) {
        this.stars--;
        this.starsJQ.children('li').last().remove();
        this.starsJQ.append('<i class="fa fa-star-o"></i>');
    }
}

/**
/* @description Resets the score panel stars to three full stars
*/
Game.prototype.resetStars = function() {

    this.stars = 3;
    this.starsJQ.empty().append(
        `<li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>`);
}

/**
/* @description Updates the score panel moves text
*/
Game.prototype.updateMoves = function() {

    this.moves++;
    this.movesJQ.text(this.moves + ' Moves');
}

/**
/* @description Resets the score panel moves text
*/
Game.prototype.resetMoves = function() {

    this.moves = 0;
    this.movesJQ.text(this.moves + ' Moves');
}

/**
/* @description Processes card match
*/
Game.prototype.processMatch = function() {

    this.cardToMatch.animateMatch();
    this.cardToMatch = undefined;
    this.matchCnt+=2;
}

/**
/* @description Processes game win
*/
Game.prototype.processWin = function() {

    clearInterval(game.timerFunction);
    this.gameStats.push(this.elapsedTime.toFixed(1));
    let show = setTimeout(function() {
        game.winOverlay.show();
        game.deck.hide();}, 2000);

}

/**
/* @description Determines and executes game response to selected card(s)
/* @param {Card} card the most recently clicked on card
/* @return {string} represents the action to be taken by the most recently clicked on card
*/
Game.prototype.requestResponse = function(card) {

    // start timer if first move of game
    if (this.moves === 0)
        this.startTimer();

    // update stars based on card's click count
    this.updateStars(card.getClickCnt());
    this.updateMoves();

    // if this card is first card clicked of pair to match
    if (this.cardToMatch === undefined) {
        this.cardToMatch = card;
        return('turn');
    }

    // if this card is a match
    if (this.cardToMatch.getFontChar() === card.getFontChar()) {
        this.processMatch();
        if (this.isWon())
            this.processWin();
        return('match');
    }

    // this card is not match
    this.cardToMatch.animateMatchFail();

    // reset
    this.cardToMatch = undefined;
    return('no match');
}

/**
/* @description Starts a new game
*/
Game.prototype.startNewGame = function() {

    this.deck.newGame();
    this.resetMoves();
    this.resetStars();
    this.resetTimer();
    this.matchCnt = 0;
}

const game = new Game();
game.startNewGame();







