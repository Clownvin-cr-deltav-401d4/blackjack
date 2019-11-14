'use strict';

let blackjack = angular.module('blackjack', []);

function totalHand(hand) {
  return hand.reduce((total, card) => {
    if (card.value === 1) {
      return total + 11 <= 21 ? total + 11 : total + 1;
    } else {
      return total + card.value;
    }
  }, 0);
}

function shouldPlay(opponentValue, handValue, deck, tolerance = 0.5) {
  const cutoff = 21 - handValue;
  const goodDraws = deck.cards.filter((card) => card.value <= cutoff);
  console.log('HERE'+((goodDraws.length / deck.cards.length) > tolerance));
  return opponentValue > handValue && (goodDraws.length / deck.cards.length) > tolerance;
}

blackjack.controller('BlackjackController', ['$scope', function (scope) {
  scope.deck = new Deck();
  scope.hand = [];
  scope.wins = 0;
  scope.losses = 0;
  scope.dealerHand = [];
  scope.dealerValue = 0;
  scope.handValue = 0;
  scope.draw = () => {
    scope.hand.push(scope.deck.draw());
    scope.handValue = totalHand(scope.hand);
    if (scope.handValue > 21) {
      return scope.end(false);
    }
    if (scope.handValue === 21) {
      return scope.end(true);
    }
  };
  scope.start = () => {
    scope.draw();
    scope.dealerDraw();
    scope.draw();
    scope.dealerDraw();
    scope.endscreenClass = 'not-visible';
    if (scope.handValue === 21) {
      scope.victory = true;
      scope.endscreenClass = 'visible';
      scope.wins++;
    }
  }
  scope.dealerDraw = () => {
    if (scope.dealerValue >= 17) return;
    const card = scope.deck.draw();
    if (scope.dealerHand.length === 0) {
      card.hidden = true;
    }
    scope.dealerHand.push(card);
    scope.dealerValue = totalHand(scope.dealerHand);
    if (scope.dealerValue > 21) {
      scope.end(true);
    }
  }
  scope.reset = () => {
    scope.deck.putBack(...scope.hand.splice(0));
    scope.dealerHand[0].hidden = false;
    scope.deck.putBack(...scope.dealerHand.splice(0));
    scope.deck.shuffle();
    scope.handleValue = 0;
    scope.dealerValue = 0;
    delete scope.victory;
    scope.start();
  }
  scope.end = (victory) => {
    while ((victory || typeof victory === 'undefined') && scope.dealerValue < 17) scope.dealerDraw();
    if (typeof victory !== 'undefined' || typeof scope.victory !== 'undefined') {
      scope.victory = victory || scope.victory;
    } else if (scope.handValue <= 21 && scope.handValue >= scope.dealerValue) {
      scope.victory = true;
    } else {
      scope.victory = false;
    }
    if (scope.victory) {
      scope.wins++;
    } else {
      scope.losses++;
    }
    scope.dealerHand[0].hidden = false;
    scope.endscreenClass = 'visible';
  }
  scope.start();
}]);

const SPADES = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮',];
const HEARTS = ['🂱', '🂲', '🂳', '🂴', '🂵', '🂶', '🂷', '🂸', '🂹', '🂺', '🂻', '🂽', '🂾',];
const DIAMONDS = ['🃁', '🃂', '🃃', '🃄', '🃅', '🃆', '🃇', '🃈', '🃉', '🃊', '🃋', '🃍', '🃎'];
const CLUBS = ['🃑', '🃒', '🃓', '🃔', '🃕', '🃖', '🃗', '🃘', '🃙', '🃚', '🃛', '🃝', '🃞',];

class Card {
  constructor(face, value) {
    this.face = face;
    this.value = value;
    this.hidden = false;
  }

  toString() {
    return this.face;
  }
}

class Deck {
  constructor() {
    this.cards = [...SPADES, ...HEARTS, ...DIAMONDS, ...CLUBS]
      .map((face, index) => {
        let value = (index % SPADES.length) + 1;
        if (value > 10) value = 10;
        return new Card(face, value);
      });
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