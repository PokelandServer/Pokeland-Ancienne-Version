'Use strict';
 
var color = require('../config/color');
 
/**
 * Checks if the money input is actually money.
 *
 * @param {String} money
 * @return {String|Number}
 */
function isMoney(money) {
    var numMoney = Number(money);
    if (isNaN(money)) return "Must be a number.";
    if (String(money).includes('.')) return "Cannot contain a decimal.";
    if (numMoney < 1) return "Cannot be less than one buck.";
    return numMoney;
}
 
/**
 * Card Constructor
 *
 * @param {Number|String} rank
 * @param {String} suit
 */
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
}
 
/**
 * Get all the ranks!
 *
 * @static
 * @return {Array[Number|String]}
 */
Card.Ranks = function () {
    return [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
};
 
/**
 * Get suits.
 *
 * @static
 * @return {Array[String]}
 */
Card.Suits = function () {
    return ['♠', '♥', '♦', '♣'];
};
 
/**
 * Get the value of a card.
 *
 * @param {Object} card
 * @return {Number}
 */
Card.getValue = function (card) {
    if (typeof card.rank === 'number') {
        return card.rank;
    } else if (card.rank === 'A') {
        return 1;
    } else {
        return 10;
    }
};
 
/**
 * Get string representation of a card.
 *
 * @return {String}
 */
Card.prototype.toString = function () {
    return this.rank + ' ' + this.suit;
};
 
/**
 * Deck Constructor
 */
function Deck() {
    this.cards = [];
    Card.Suits().forEach(function (suit) {
        Card.Ranks().forEach(function (rank) {
            this.cards.push(new Card(rank, suit));
        }.bind(this));
    }.bind(this));
}
 
/**
 * Draw a random card from the deck.
 *
 * @return {Card}
 */
Deck.prototype.drawCard = function () {
    var randomNumber = Math.floor(Math.random() * this.cards.length);
    return this.cards.splice(randomNumber, 1)[0];
};
 
/**
 * Get string representation of a deck.
 *
 * @return {String}
 */
Deck.prototype.toString = function () {
    return this.cards.join(", ");
};
 
var BJView = {
    busted: function (player) {
        this.addRaw("<b>" + player.name + " a dépassé 21 points!</b>");
    },
 
    create: function (creator, pot) {
        var output = "<div class='infobox'><center><h2><b>Partie de Blackjack</b></h2>";
        output += "<span style='padding:20px'><b>Créée par:</b> " + creator + "</span>";
        output += "<span style='padding:20px'>Pot: <span style='color:red'>" + pot + "</span></span>";
        output += "<br /><button name='send' value='/bj join' style='margin: 5px'>Join</button>";
        output += "</center></div>";
        this.addRaw(output);
    },
 
    end: function (winner) {
        var output = "<b>La partie de Blackjack est terminée, félicitations à <font color='#24678d'> qui la remporte!";
        output += winner.name + "</font> with " + winner.hand.join(", ") + " in hand!</b>";
        this.addRaw(output);
    },
 
    hit: function (player, card, hand) {
        this.addRaw("<b>" + player + " a pioché " + card + ". Maintenant, " + player + " a les cartes suivantes dans la main: " + hand + "</b>");
    },
 
    join: function (player) {
        this.addRaw("<b>" + player + " a rejoint la partie de Blackjack.</b>");
    },
 
    noWinner: function () {
        this.addRaw("<b>La putain de partie de Blackjack a pris fin. Il n'y a pas de gagnant.");
    },
 
    start: function (players, getPlayer) {
        var output = "<div class='infobox'><center><b>La partie de Blackjack a commencé !</b><br />";
        output += "<b>Il y a " + players.length + " joueurs.</b><br />";
        players.forEach(function (player) {
            output += "<b><font color='" + color(player) + "'>" + player + ": </font></b> " + getPlayer[player].hand.join(", ") + "<br />";
        });
        output += "</center></div>";
        this.addRaw(output);
    },
 
    turn: function (player) {
        this.addRaw("<b>C'est à " + player + " de jouer.</b>");
    }
};
 
/**
 * Blackjack Constructor
 *
 * @param {Number} number
 * @param {Object} room
 * @param {String} creator - the user who created the Blackjack game
 */
function Blackjack(pot, room, creator) {
    // Create a new deck.
    this.deck = new Deck();
 
    // The prize money to be won.
    this.pot = pot;
 
    // Boolean to check if a blackjack game has started or not.
    this.started = false;
 
    // All players containing their name, hand, and hand total.
    this.players = {};
 
    // The order of player's turn.
    this.turns = [];
 
    // The current turn of a blackjack game.
    this.currentTurn = '';
 
    // The room in which the blackjack game is played in.
    this.room = room;
 
    // Display that a new blackjack game has been created.
    BJView.create.call(this.room, creator, pot);
}
 
/**
 * Start a blackjack game.
 */
Blackjack.prototype.startGame = function () {
    this.started = true;
    this.turns = Object.keys(this.players);
 
    this.turns.forEach(function (player) {
        this.hit(player, true);
        this.hit(player, true);
    }.bind(this));
 
    BJView.start.call(this.room, this.turns, this.players);
 
    this.nextTurn();
};
 
/**
 * Changes the current turn.
 * Ends the game if the all players have finished their turns.
 */
Blackjack.prototype.nextTurn = function () {
    this.currentTurn = this.turns.shift();
    if (!this.currentTurn) {
        var winner = this.chooseWinner();
        this.endGame(winner);
    } else {
        BJView.turn.call(this.room, this.currentTurn);
    }
};
 
/**
 * Choose the winner of the blackjack game.
 *
 * @return {Object} winner;
 */
Blackjack.prototype.chooseWinner = function () {
    var winner = Object.keys(this.players).reduce(function (acc, cur) {
        var accP = this.players[acc];
        var curP = this.players[cur];
        if (!curP) return accP;
        if (!accP) return curP;
        return accP.total > curP.total ? accP : curP;
    }.bind(this));
 
    if (typeof winner === 'string') {
        winner = this.players[winner];
    }
 
    return winner;
};
 
/**
 * End the blackjack game.
 *
 * @param {Object} winner
 */
Blackjack.prototype.endGame = function (winner) {
    BJView.end.call(this.room, winner);
    this.room.bj = null;
};
 
/**
 * Checks if a player is in the blackjack game.
 *
 * @param {String} player
 * @return {Boolean}
 */
Blackjack.prototype.isPlayerInGame = function (player) {
    return this.players.hasOwnProperty(player) === true;
};
 
/**
 * Checks if it a player's turn.
 *
 * @param {String} player
 * @return {Boolean}
 */
Blackjack.prototype.isPlayerTurn = function (player) {
    return this.currentTurn === player;
};
 
/**
 * Add a player to the blackjack game.
 *
 * @param {String} player
 */
Blackjack.prototype.addPlayer = function (player) {
    this.players[player] = {name: player, hand: [], total: 0};
 
    BJView.join.call(this.room, player);
};
 
/**
 * Add a card to your hand.
 *
 * @param {String} player
 * @param {Boolean} silence - Don't display to the room
 */
Blackjack.prototype.hit = function (player, silence) {
    var card = this.deck.drawCard();
    this.players[player].hand.push(card);
    this.players[player].total += Card.getValue(card);
 
    if (silence) return;
 
    BJView.hit.call(this.room, player, card.toString(), this.players[player].hand.join(', '));
};
 
/**
 * Check to see if a player won or bust.
 *
 * @param {String} player
 */
Blackjack.prototype.hasPlayerWinOrBust = function (player) {
    var total = this.players[player].total;
    if (total === 21) {
        this.endGame(this.players[player]);
    } else if (total > 21) {
        BJView.busted.call(this.room, this.players[player]);
        delete this.players[player];
 
        // Special case when all players are busted.
        if (Object.keys(this.turns).length === 0) {
            this.room.bj = null;
            return BJView.noWinner.call(this.room);
        }
 
        this.nextTurn();
    }
};
 
exports.commands = {
        bjhelp: 'blackjackhelp',
        blackjackhelp: function(target, room, user) {
                       this.sendReplyBox("<center><b><u>Commandes du Blackjack</u></b><br /></center><b>/bj [new/create] [bucks]</b> - lance une partie avec un pot de la récompense voulue.<br /><b>/bj [end]</b> - annule la partie lancée.<br /><b>/bj [start]</b> - permet de lancer la partie une fois que les participants s'y sont inscrits.<br /><b>/bjhelp</b> - montre cette commande<br />");
               },
    bj: 'blackjack',
    blackjack: {
        new: 'create',
        create: function (target, room, user) {
            if (!this.can('broadcast', null, room)) return false;
                if (room.id !== 'casino') return this.sendReply('|html|Il n\'est possible de jouer au Blackjack que dans le <button name = "send" value = "/join casino">Casino</button>');
   
            if (room.bj) return this.sendReply("Une partie de Blackjack a déjà été lancée.");
 
            var amount = isMoney(target);
            if (typeof amount === 'string') return this.sendReply(amount);
 
            room.bj = new Blackjack(amount, room, user.name);
        },
 
        start: function (target, room, user) {
            if (!this.can('broadcast', null, room)) return false;
            if (!room.bj) return this.sendReply("Aucune partie n'a été lancée. Pour en créer une, utilisez <b>/blackjack new</b>.");
            if (room.bj.started) return this.sendReply("Une partie de Blackjack a déjà été lancée.");
            if (Object.keys(room.bj.players).length < 2) return this.sendReply("|raw|<b>Il n'y a pas assez de participants.</b>");
 
            room.bj.startGame();
        },
 
        join: function (target, room, user) {
            if (!room.bj) return this.sendReply("Aucune partie n'a été lancée. Pour en créer une, utilisez <b>/blackjack new</b>.");
            if (room.bj.started) return this.sendReply("La partie a déjà commencé.");
            if (room.bj.isPlayerInGame(user.userid)) return this.sendReply("Vous vous êtes déjà inscrit à cette partie.");
 
            // check if they have enough money for pot
 
            room.bj.addPlayer(user.userid);
        },
 
        hit: function (target, room, user) {
            if (!room.bj) return this.sendReply("Il n'y a aucune partie de Blackjack actuellement.");
            if (!room.bj.started) return this.sendReply("La partie de Blackjack n'a pas encore commencé.");
            if (!room.bj.isPlayerInGame(user.userid)) return this.sendReply("Vous ne participez pas à cette partie.");
            if (!room.bj.isPlayerTurn(user.userid)) return this.sendReply("Ce n'est pas votre tour.");
 
            room.bj.hit(user.userid);
            room.bj.hasPlayerWinOrBust(user.userid);
        },
 
        hand: function (target, room, user) {
            if (!room.bj) return this.sendReply("Il n'y a aucune partie de Blackjack actuellement.");
            if (!room.bj.started) return this.sendReply("La partie de Blackjack n'a pas encore commencé.");
            if (!room.bj.isPlayerInGame(user.userid)) return this.sendReply("Vous ne participez pas à cette partie."); //ici ça se répète @Panur, c le isPlayerTurn qu'il faut mettre à la place ?
 
            this.sendReply("Votre main: " + room.bj.players[user.userid].hand.join(', '));
        },
 
        stand: function (target, room, user) {
            if (!room.bj) return this.sendReply("Il n'y a aucune partie de Blackjack actuellement.");
            if (!room.bj.started) return this.sendReply("ALa partie de Blackjack n'a pas encore commencé.");
            if (!room.bj.isPlayerInGame(user.userid)) return this.sendReply("Vous ne participez pas à cette partie.");
            if (!room.bj.isPlayerTurn(user.userid)) return this.sendReply("Ce n'est pas votre tour.");
 
            room.bj.nextTurn();
        },
 
        deck: function (target, room, user) {
            if (!this.can('declare', null, room)) return false;
            if (!room.bj) return this.sendReply("Il n'y a aucune partie de Blackjack actuellement.");
            if (room.bj.isPlayerInGame(user.userid)) return this.sendReply("Vous ne pouvez pas voir le deck si vous participez.");
 
            this.sendReply("Deck de la partie actuelle: " + room.bj.deck.toString());
        },
 
        stop: 'end',
        end: function (target, room, user) {
            if (!user.can('broadcast', null, room)) return false;
            if (!room.bj) return this.sendReply("Il n'y a aucune partie de Blackjack actuellement.");
 
            room.bj = null;
            room.addRaw("<b>" + user.name + " a terminé de force la partie de Blackjack.</b>");
        }
    }
};
