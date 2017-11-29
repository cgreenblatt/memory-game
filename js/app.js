/*
 * Create a list that holds all of your cards
 */
 const cards = $(".card");
 const deck = $(".deck");
 const restart = $(".restart");
 let symbolToMatch = undefined;
 let elementToMatch = undefined;




/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Modify HTML to place all cards face down
//function faceDown(cards) {}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
 console.log(array);
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function restartGame() {

    cards.removeClass().addClass("card");
    let cardArray = shuffle(cards.toArray());
    deck.empty();
    deck.append(cardArray);
    cards.click(clickHandler);
}

function clickHandler() {

    // ignore clicks on green (matched cards) and current blue card
    if ((elementToMatch === this) || $( this ).hasClass("match")) {
        return;
    }


    // get symbol of flipped card
    const symbolElement = $( this ).children("i");
    const selectedSymbol = $( this ).children("i").attr("class");

    // if this card is first card of matched pair
    if (elementToMatch === undefined) {
        elementToMatch = this;  // initialize
        symbolToMatch = selectedSymbol;
        $( this ).removeClass().addClass("card turn");

    } else {
        if (symbolToMatch === selectedSymbol) {

             $( this ).removeClass().addClass("card turn-distort match");

             $( elementToMatch ).removeClass().addClass("card distort match");
        } else {  // not a match

            // turn card just clicked on, change to red, tilt, and turn face down
            if ($( this ).hasClass("turn-tilt-turn1"))
                $( this ).removeClass().addClass("card turn-tilt-turn2");
            else
                $( this ).removeClass().addClass("card turn-tilt-turn1");
            // change to red, tilt, and turn face down
            $( elementToMatch ).removeClass().addClass("card tilt-turn")
        }
             symbolToMatch = undefined;
             elementToMatch = undefined;
    }


}


restart.click(restartGame);
restartGame();



/*
console.log(cards);
cards.toggleClass("match", false);
cards.toggleClass("open", false);
cards.toggleClass("show", false);
console.log(cards)
*/

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
