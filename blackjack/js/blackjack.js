// Constructor for Card object
function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
}
Card.prototype = {
  image: function() { 
    return 'img/' + this.rank + this.suit + ".png";
  }
};

// Constructor for Deck object
// 1  = A
// 11 = J
// 12 = Q
// 13 = K
function Deck() {
  this.cards = new Array(52);
  for (var i = 1; i <= 13; i++) {
    this.cards[i-1] =  new Card(i, "c"); // clubs
    this.cards[i+12] = new Card(i, "d"); // diamonds
    this.cards[i+25] = new Card(i, "h"); // hearts
    this.cards[i+38] = new Card(i, "s"); // spades
  }
}

Deck.prototype = {
  // Shuffle deck using Fisher-Yates algorithm
  shuffle: function () {
    for (var i = this.cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  },
  dealCard: function() { 
    return this.cards.pop();
  }
};

var deck = new Deck();

function newGame() {

  // reset game
  $("#newGameBtn").popover('destroy');
  $("#dealerScore").html("");
  $('.card').remove();

  deck.shuffle();
  dealer_hand = new Array([]);
  player_hand = new Array([]);

  // Dealer's first card is a hole card and is not shown
  dealer_hand[0] = deck.dealCard();
  showDealerImage("img/holecard.png");
  dealer_hand[1] = deck.dealCard();
  showDealerImage(dealer_hand[1].image());

  player_hand[0] = deck.dealCard();
  showPlayerImage(player_hand[0].image());
  player_hand[1] = deck.dealCard();
  showPlayerImage(player_hand[1].image());

  $("#playerScore").html("Score: " + score(player_hand));

  game_over = false;
}


function hit() {
  var total = 0;
  var new_card = 0;
  if ( game_over ) {
    $("#newGameBtn").popover({ title: 'Game ended!', content: 'Go again?' });
    $("#newGameBtn").popover('show');
  } else {
    new_card = player_hand.length;
    player_hand[new_card] = deck.dealCard();
    showPlayerImage(player_hand[new_card].image());
    total = score(player_hand);
      if (total > 21) {
         $("#playerScore").html("Busted! (" + total + ")");
         document.images[0].src = dealer_hand[0].image();
         $("#dealerScore").html("Score: " + score(dealer_hand));
         winner();
         game_over = true;
       } else {
         $("#playerScore").html("Score: " + total);
       }
     }
}

function stand() {
  var total = 0;
  var new_card = 0;
  if (game_over) {
    $("#newGameBtn").popover({ title: 'Game ended!', content: 'Go again?' });
    $("#newGameBtn").popover('show');
  } else {
      document.images[0].src = dealer_hand[0].image();
      while (score(dealer_hand) < 17 ) {
        new_card = dealer_hand.length;
        dealer_hand[new_card] = deck.dealCard();
        showDealerImage(dealer_hand[new_card].image());
      }

      total = score(dealer_hand);
      if (total > 21) {
        $("#dealerScore").html("Busted! (" + total + ")");
      } else {
        $("#dealerScore").html("Score: " + total);
      }
   }
   winner();
   game_over = true;
}


function score(hand) {
  var total = 0;
  var soft = 0;
  var pips = 0;
  for (i = 0; i < hand.length; i++) {
    pips = hand[i].rank;
    if (pips == 1) { 
      soft = soft + 1;
      total = total + 11;
    } else {
      if (pips == 11 || pips == 12 || pips == 13) {
        total = total + 10;
      } else {
        total = total + pips;
      }
    }
  }
  while (soft > 0 && total > 21) {
    total = total - 10;
    soft = soft - 1;
  }
return total;
}


function winner() {
  var player_total = score(player_hand);
  var dealer_total = score(dealer_hand);
  if (player_total > 21) {
    $("#newGameBtn").popover('destroy');
    $("#newGameBtn").popover({ title: 'Dealer Wins!', content: 'Go again?' });
    $("#newGameBtn").popover('show');
  } else {
      if (dealer_total > 21) {
        $("#newGameBtn").popover('destroy');
        $("#newGameBtn").popover({ title: 'Player Wins!', content: 'Go again?' });
        $("#newGameBtn").popover('show');
      } else {
       if (player_total == dealer_total) {
        $("#newGameBtn").popover('destroy');
        $("#newGameBtn").popover({ title: 'Tie Game!', content: 'Go again?' });
        $("#newGameBtn").popover('show');
      } else {
        if (player_total > dealer_total) {
          $("#newGameBtn").popover('destroy');
          $("#newGameBtn").popover({ title: 'Player Wins!', content: 'Go again?' });
          $("#newGameBtn").popover('show');
       } else {
           $("#newGameBtn").popover('destroy');
           $("#newGameBtn").popover({ title: 'Dealer Wins!', content: 'Go again?' });
           $("#newGameBtn").popover('show');
       }
     }
   }
 }
}

function showDealerImage(image) {
  $("#dealerDiv").append("<img src=" + image + " class='card'></img>");
}

function showPlayerImage(image) {
  $("#playerDiv").append("<img src=" + image + " class='card'></img>");
}

$("#newGameBtn").click(function() {
  newGame();
});

$("#hitBtn").click(function() {
  hit();
});

$("#standBtn").click(function() {
  stand();
});
