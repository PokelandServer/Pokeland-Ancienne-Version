/**
 *
 * Slots.js Made By Dragotic and refactored by AlfaStorm.
 * Slots is a casino game.
 *
 **/

'use strict';

// To get hash colors of the names
const color = require('../config/color');

// Available slots for the game
const slots = {
	'bulbasaur': 3,
	'squirtle': 5,
	'charmander': 7,
	'pikachu': 11,
	'eevee': 13,
	'snorlax': 15,
	'dragonite': 17,
	'mew': 21,
	'mewtwo': 23,
	'dialga': 34,
	'palkia': 45,
	'giratina':54,
};

function moneyName(amount) {
	let name = " buck";
	return name;
}

// Trozei sprites for each pokemon
const slotsTrozei = {
	'bulbasaur': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/bulbasaur.png',
	'squirtle': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/squirtle.png',
	'charmander': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/charmander.png',
	'pikachu': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/pikachu.png',
	'eevee': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/eevee.png',
	'snorlax': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/snorlax.png',
	'dragonite': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/dragonite.png',
	'mew': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/mew.png',
	'mewtwo': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/mewtwo.png',
	'dialga': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/dialga.png',
	'palkia': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/palkia.png',
	'giratina': 'http://www.pokestadium.com/assets/img/sprites/misc/pmd2/giratina.png',
};

const availableSlots = Object.keys(slots);

function spin() {
	return availableSlots[Math.floor(Math.random() * availableSlots.length)];
}

function rng() {
	return Math.floor(Math.random() * 100);
}

function display(result, user, slotOne, slotTwo, slotThree) {
	let display = '<div style="padding: 3px; background: #000000; padding: 5px; border-radius: 5px; text-align: center;">' +
	'<center><img src="http://i.imgur.com/p2nObtE.gif" width="300" height="70"></center><br />' +
	'<center><img style="padding: 3px; border: 1px inset gold; border-radius: 5px; box-shadow: inset 1px 1px 5px white;" src="' + slotsTrozei[slotOne] + '">&nbsp;&nbsp;&nbsp;' + '<img style="padding: 3px; border: 1px inset gold; border-radius: 5px; box-shadow: inset 1px 1px 5px white;" src="' + slotsTrozei[slotTwo] + '">&nbsp;&nbsp;&nbsp;' + '<img style="padding: 3px; border: 1px inset gold; border-radius: 5px; box-shadow: inset 1px 1px 5px white;" src="' + slotsTrozei[slotThree] + '"></center>' +
	'<font style="color: white;"><br />';
	if (!result) {
		display += 'Mdr! Perdu <b><font color="' + color(user) + '">' + user + '</font></b>. T\'auras plus de chance la prochaine fois!</font>';
	}
	if (result) {
		display += 'Bravo, <b><font color="' + color(user) + '">' + user + '</font></b>. T\'as gagné ' +
		slots[slotOne] + ' bucks!!</font>';
	}
	return display + '</div>';
}

exports.commands = { //wetezosamo
	slots: {
		start: 'spin',
		spin: function (target, room, user) {
			if (room.id !== 'casino') return this.errorReply('Casino games can only be played in the "Casino".');
			if (!this.runBroadcast()) return false;
			if (!this.canTalk()) return this.errorReply('/slots spin - Access Denied.');

			const amount = Db('money').get(user.userid, 0);
			if (amount < 3) return this.errorReply('Vous n\'avez pas assez de bucks pour jouer à ce jeu. Vous avez besoin ' + (3 - amount) + moneyName(amount) + ' plus.');
			const result = spin();
			const chancePercentage = rng();
			const chancesGenerated = 68 + availableSlots.indexOf(result) * 4;

			if (chancePercentage >= chancesGenerated) {
				Db('money').set(user.userid, (amount + slots[result]));
				return this.sendReplyBox(display(true, user.name, result, result, result));
			}

			// Incase all outcomes are same, it'll resort to changing the first one.
			let outcomeOne = spin();
			let outcomeTwo = spin();
			let outcomeThree = spin();

			while (outcomeOne === outcomeTwo === outcomeThree) {
				outcomeOne = spin();
			}

			Db('money').set(user.userid, (amount -3));
			return this.sendReplyBox(display(false, user.name, outcomeOne, outcomeTwo, outcomeThree));
		},
		'': function (target, room, user) {
			return this.parse('/help slots');
		},
	},
	slotshelp: ['Le slots spin est exclusif au casino. ' +
	'Tentez votre chance pour gagner jusqu\'à 54 bucks! Il est interdit de spam cette commande' + '\n' +
	'Bulbasaur: 3 bucks' + '\n' +
	'Squirtle: 5 bucks' + '\n' +
	'Charmander: 7 bucks' + '\n' +
	'Pikachu: 11 bucks' + '\n' +
	'Eevee: 13 bucks' + '\n' +
	'Snorlax: 15 bucks' + '\n' +
	'Dragonite: 17 bucks' + '\n' +
	'Mew: 21 bucks' + '\n' +
	'Mewtwo: 23 bucks'  + '\n' +
	'Dialga: 34 bucks'  + '\n' +
	'Palkia: 45 bucks'  + '\n' +
	'Giratina: 54 bucks'  + '\n' +
	'Bonne chance!'],
};