let Card = function(cardDOM) {
    this.cardDOM = cardDOM;
    this.cardJQ = $( cardDOM );
    this.iJQ = $( this.cardDOM ).children("i");
    this.clickCnt = 0;
    this.status = "not matched";
    this.fontChar = this.iJQ.attr("class");
}

Card.prototype.reset = function() {

    this.clickCnt = 0;
    this.status = "not matched";
    this.cardJQ.removeClass().addClass("card");
}

Card.prototype.getFontChar = function() {
    return this.fontChar;
}

Card.prototype.setFontChar = function(fontChar) {
    this.iJQ.removeClass().addClass(fontChar);
    this.fontChar = fontChar;
}

Card.prototype.animateMatch = function() {
    this.status = "matched";
    this.cardJQ.removeClass().addClass("card distort match");
}

Card.prototype.animateMatchFail = function() {
    this.status = "not matched";
    this.cardJQ.removeClass().addClass("card tilt-turn");
}

Card.prototype.getClickCnt = function() {

    return this.clickCnt;
}

Card.prototype.clickHandler = function() {
    this.clickCnt++;

    if ((this.status === "matched") || (this.status === "open"))
        return;

    switch(game.getResponse(this)) {
        case "turn":
            this.status = "open";
            this.cardJQ.removeClass().addClass("card turn");
            break;
        case "match":
            this.status = "matched";
            this.cardJQ.removeClass().addClass("card turn-distort match");
            break;
        case "no match":
            this.status = "not matched";
            if (this.clickCnt % 2 === 1)
                this.cardJQ.removeClass().addClass("card turn-tilt-turn1");
            else
                this.cardJQ.removeClass().addClass("card turn-tilt-turn2");
    }
}


let Deck = function() {
    this.cards = [];
    this.deckJQ = $(".deck");
    let cardDOMs = $( ".card" ).toArray();
    for (let i = 0; i < cardDOMs.length; i++) {
        this.cards[i] = new Card(cardDOMs[i]);
        $( this.cards[i].cardDOM ).click(function() {
           game.deck.cards[i].clickHandler();
        });
    }
}

Deck.prototype.hide = function() {

    this.deckJQ.removeClass("show").addClass("hide");
}

Deck.prototype.show = function() {

    this.deckJQ.removeClass("hide").addClass("show");
}

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

Deck.prototype.newGame = function() {

    this.shuffle();
    for (let i = 0; i < this.cards.length; i++)
        this.cards[i].reset();
}

let WinOverlay = function() {

    this.winOverlayJQ = $(".win-overlay");
    this.winDataJQ = $(".win-data");
    $("button").click(function() {
        game.buttonHandler();
    });

}

WinOverlay.prototype.show = function() {
    this.winOverlayJQ.removeClass("hide").addClass("show");
    this.winDataJQ.text( `Game won in ${game.elapsedTime.toFixed(1)} seconds with ${game.moves} Moves and ${game.stars} ${game.stars === 1? "Star": "Stars"}`);
}

WinOverlay.prototype.hide = function() {
    this.winOverlayJQ.removeClass("show").addClass("hide");
}

let Game = function() {

    this.deck = new Deck();
    this.deck.shuffle();
    this.cardToMatch = undefined;
    this.moves = 0;
    this.movesJQ = $( ".moves" );
    this.stars = 3;
    this.starsJQ = $( ".stars" );
    this.matchCnt = 0;
    this.winOverlay = new WinOverlay();
    this.timerJQ = $( ".timer" );
    this.timerFunction = undefined;
    this.elapsedTime = 0;
    this.gameStats = [];
    this.restartJQ = $(".restart");
    $(".restart").click(function() {game.startNewGame();});
}

Game.prototype.startTimer = function() {

    this.timerFunction = setInterval(function() {
        game.elapsedTime += .1;
        game.timerJQ.text(game.elapsedTime.toFixed(1));
    }, 100);
}

Game.prototype.resetTimer = function() {

    if (this.timerFunction != undefined)
        clearInterval(game.timerFunction);
    this.elapsedTime = 0;
    this.timerJQ.text("");
}

Game.prototype.buttonHandler = function () {
        this.startNewGame();
        this.winOverlay.hide();
        this.deck.show();
}

Game.prototype.isWon = function() {

    return (this.matchCnt === this.deck.cards.length);
}


Game.prototype.updateStars = function(clickCnt) {

    if (clickCnt > 2 && this.stars > 0) {
        this.stars--;
        this.starsJQ.children("li").last().remove();
        this.starsJQ.append('<i class="fa fa-star-o"></i>');
    }
}

Game.prototype.resetStars = function() {

    this.stars = 3;
    this.starsJQ.empty().append(`<li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>`);
}

Game.prototype.updateMoves = function() {

    this.moves++;
    this.movesJQ.text(this.moves + " Moves");
}

Game.prototype.resetMoves = function() {

    this.moves = 0;
    this.movesJQ.text(this.moves + " Moves");
}

Game.prototype.processMatch = function() {

        this.cardToMatch.animateMatch();
        this.cardToMatch = undefined;
        this.matchCnt+=2;
}

Game.prototype.processWin = function() {

    clearInterval(game.timerFunction);
    this.gameStats.push(this.elapsedTime.toFixed(1));
    let show = setTimeout(function() {
        game.winOverlay.show();
        game.deck.hide();}, 2000);

}

Game.prototype.getResponse = function(card) {

    if (this.moves === 0)
        this.startTimer();

    this.updateStars(card.getClickCnt());
    this.updateMoves();

    // there is no card to try to match
    if (this.cardToMatch === undefined) {
        this.cardToMatch = card;
        return "turn";
    }

    // match
    if (this.cardToMatch.getFontChar() === card.getFontChar()) {
        this.processMatch();
        if (this.isWon())
            this.processWin();
        return "match";
    }

    // no match
    this.cardToMatch.animateMatchFail();
    this.cardToMatch = undefined;
    return "no match";
}

Game.prototype.startNewGame = function() {


    this.deck.newGame();
    this.resetMoves();
    this.resetStars();
    this.resetTimer();
    this.matchCnt = 0;


}

const game = new Game();
game.startNewGame();







