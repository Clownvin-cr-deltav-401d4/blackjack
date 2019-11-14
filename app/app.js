'use strict';

let blackjack = angular.module('blackjack', []);

function totalHand(hand) {
  return hand.reduce((total, card) => total + card.value, 0);
}

blackjack.controller('BlackjackController', ['$scope', function (scope) {
  scope.deck = new Deck();
  scope.hand = [];
  scope.dealerHand = [];
  scope.dealerValue = 0;
  scope.handValue = 0;
  scope.draw = () => {
    scope.hand.push(scope.deck.draw());
    scope.handValue = totalHand(scope.hand);
    if (scope.handValue > 21) {
      scope.victory = false;
    } else {
      scope.victory = true;
    }
  };
  scope.reset = () => {
    scope.deck.putBack(scope.hand.splice(0, scope.hand.length));
    scope.deck.shuffle();
    scope.handleValue = 0;
    scope.draw();
    scope.endscreenClass = 'not-visible';
  }
  scope.end = () => {
    scope.endscreenClass = 'visible';
  }
  scope.draw();
  scope.victory = false;
  scope.endscreenClass = 'not-visible';
}]);

const SPADES = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮',];
const HEARTS = ['🂱', '🂲', '🂳', '🂴', '🂵', '🂶', '🂷', '🂸', '🂹', '🂺', '🂻', '🂽', '🂾',];
const DIAMONDS = ['🃁', '🃂', '🃃', '🃄', '🃅', '🃆', '🃇', '🃈', '🃉', '🃊', '🃋', '🃍', '🃎'];
const CLUBS = ['🃑', '🃒', '🃓', '🃔', '🃕', '🃖', '🃗', '🃘', '🃙', '🃚', '🃛', '🃝', '🃞',];

class Card {
  constructor(face, value) {
    this.face = face;
    this.value = value;
  }

  toString() {
    return this.face;
  }
}

class Deck {
  constructor() {
    this.cards = [...SPADES, ...HEARTS, ...DIAMONDS, ...CLUBS]
      .map((face, index) => new Card(face, (index % SPADES.length) + 1));
    this.back = '🂠';
    this.shuffle();
  }

  shuffle() {
    //Move each card into random spot
    for (let i = 0; i < this.cards.length * 5; i++) {
      this.cards.push(this.cards.splice(Math.floor(Math.random() * this.cards.length), 1)[0]);
    }
  }

  size() {
    return this.cards.length;
  }

  draw() {
    if (this.size() < 1) throw `No more cards to draw`;
    return this.cards.splice(0, 1)[0];
  }

  putBack(...cards) {
    this.cards.push(...cards);
  }

  *[Symbol.iterator]() {
    for (const card of this.cards) {
      yield card;
    }
  }
}