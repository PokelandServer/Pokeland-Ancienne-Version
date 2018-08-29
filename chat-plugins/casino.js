
const casinoAuthDataFile = 'authcasino.json';

var fs = require('fs');

if (!fs.existsSync(casinoAuthDataFile))
	fs.writeFileSync(casinoAuthDataFile, '{}');

var casinoOwners = JSON.parse(fs.readFileSync(casinoAuthDataFile).toString());
var defaultPermission = 'ban';

var tourBets = {};
var tourStatus = false;
var tourPrize = 0;

var wheelStatus = false;
var wheelOptions = [];
var wheelBets = {};
var prize = 0;

var bingoStatus = false;
var bingoNumbers = [];
var bingoSaidNumbers = {};
var actualValue = 0;
var tables = {};
var bingoPrize = 0;

function writeCasinoData() {
	fs.writeFileSync(casinoAuthDataFile, JSON.stringify(casinoOwners));
}

function getUserName (user) {
	var targetUser = Users.get (user);
	if (!targetUser) return toId(user);
	return targetUser.name;
}

function getBingoNumbers() {
	var data = [];
	for (var i = 0; i < 50; ++i) {
		data.push(i + 1);
	}
	return data;
}

function checkBingo(room) {
	var winners = [];
	var endGame = false;
	var targetTable;
	var tableComplete;
	for (var i in tables) {
		targetTable = tables[i];
		tableComplete = 0
		for (var j = 0; j < targetTable.length; ++j) {
			if (!bingoSaidNumbers[targetTable[j]]) break;
			++tableComplete;
		}
		if (tableComplete === targetTable.length) {
			endGame = true;
			winners.push(i);
		}
	}
	if (endGame) {
		var winData = '';
		for (var n = 0; n < (winners.length - 1); ++n) {
				var amnt = Db('money').get(winners[n]);
				var tt = Db('money').set(winners[n], amnt + bingoPrize).get(winners[n]);
			//Shop.giveMoney(toId(winners[n]), bingoPrize);
			if (n === 0) {
				winData += getUserName(winners[n]);
			} else {
				winData += ', ' + getUserName(winners[n]);
			}
		}
				var amnt = Db('money').get(toId(winners[winners.length - 1]));
				var tt = Db('money').set(toId(winners[winners.length - 1]), amnt + bingoPrize).get(winners[winners.length - 1]);
		//Shop.giveMoney(toId(winners[winners.length - 1]), bingoPrize);
		if (winners.length > 1) winData += ' et ';
		winData += getUserName(winners[winners.length - 1]);
		room.addRaw("<div class=\"broadcast-blue\"><b><h2>BINGO ! Un énorme cri annonce un vainqueur !<h2></b><br />Félicitations à  " + winData + " pour sa victoire. Premier prix : " + bingoPrize + " bucks!</div>");
		room.update();
		bingoStatus = false;
	}
}

function forceEndTourBets() {
	for (var i in tourBets) {
		Shop.giveMoney(i, tourBets[i].pd);
		tourPrize += (- tourBets[i].pd);
	}
	tourBets = {};
	tourPrize = 0;
}

exports.commands = {
	
	nuevobingo: 'newbingo',
	newbingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut être utilisée que dans la salle du Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (bingoStatus) return this.sendReply("Il y a déjà un Bingo en cours.");
		bingoStatus = true;
		bingoNumbers = getBingoNumbers().randomize();
		bingoSaidNumbers = {};
		actualValue = 0;
		tables = {};
		bingoPrize = 0;
		this.privateModCommand('(' + user.name + ' a lancé un jeu de Bingo!)');
		room.addRaw("<div class=\"broadcast-blue\"><b>On a lancé un nouveau jeu de Bingo!</b><br />Pour participer, achète une grille à 2 bucks avec la commande /buytable<br><center><button name='send' value='/buytable'>Acheter une grille</button></center></div>");
		room.update();
		var loop = function () {
			setTimeout(function () {
				if (!bingoStatus) return;
				if (actualValue >= bingoNumbers.length) {
					bingoStatus = false;
					room.addRaw("<div class=\"broadcast-blue\"><b>Le Bingo est terminé!</b><br />Malheureusement personne n'a participé, il n'y a donc pas de gagnants!</div>");
					room.update();
					return;
				}
				room.add('|c| [Serveur]|**Bingo:** Numéro tiré : **' + bingoNumbers[actualValue] + '**');
				bingoSaidNumbers[bingoNumbers[actualValue]] = 1;
				++actualValue;
				room.update();
				checkBingo(room);
				loop();
			}, 1000 * 3);
		};
		loop();
	},
	
	comprartablilla: 'buytable',
	comprartabla: 'buytable',
	buytable: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!bingoStatus) return this.sendReply("Il n'y a aucun Bingo en cours.");
		if (tables[user.userid]) return this.sendReply("Vous avez déjà acheté un ticket de Bingo.");
		var amount = Db('money').get(user.userid, 0);
		if (amount < 2) return this.sendReply("Vous n'avez pas assez d'argent.");
		var cost = 2;
		var total = Db('money').set(user.userid, amount - cost).get(user.userid);

		//if (Shop.getUserMoney(user.name) < 10) return this.sendReply("Vous n'avez pas assez d'argent.");
		//Shop.removeMoney(user.name, 10);
		//Shop.giveMoney('casino', 5);
		var numbers = getBingoNumbers().randomize();
		var cells = [];
		for (var i = 0; i < 5; ++i) {
			cells.push(numbers[i]);
		}
		tables[user.userid] = cells;
		bingoPrize += 2;
		this.sendReply("Vous avez acheté un ticket de Bingo. Pour voir vos nombres, utilisez la commande /bingo.");
		this.parse('/bingo');
		checkBingo(room);
	},
	
	vertablilla: 'bingo',
	tablilla: 'bingo',
	bingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!this.canBroadcast()) return;
		if (!bingoStatus) return this.sendReply("Il n'y a pas de Bingo en cours.");
		var targetUserId = user.userid;
		if (tables[toId(target)]) targetUserId = toId(target);
		if (tables[targetUserId]) {
			var html = '<b>Jeu de bingo:</b> Grille de ' + getUserName(targetUserId) + '<br /><br />';
			html += '<table border="1" cellspacing="0" cellpadding="3" target="_blank"><tbody><tr>';
			for (var n = 0; n < tables[targetUserId].length; ++n) {
				if (!bingoSaidNumbers[tables[targetUserId][n]]) {
					html += '<td><center><b>' + tables[targetUserId][n] + '</b></center></td>';
				} else {
					html += '<td><center><font color="red"><b>' + tables[targetUserId][n] + '</b></font></center></td>';
				}
			}
			html += '</tr></tbody></table><br />';
		} else {
			var html = '<b>Bingo:</b> Vous n\'avez pas acheté de ticket. Vous pouvez en acheter un avec /buytable<br /><br />';
		}
		html += '<b>Récompense actuelle: </b>' + bingoPrize + ' bucks.';
		this.sendReplyBox(html);
	},
	abrirapuestas: 'openbets',
	openbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (tourStatus) return this.sendReply("Les paris sont déjà ouverts.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourBets = {};
			return this.sendReply("Il n'y a pas de tournois dans la salle.");
		}
		tourStatus = true;
		this.privateModCommand('(' + user.name + ' a ouvert les paris pour le tournoi !)');
		room.addRaw("<div class=\"broadcast-green\"><b>Les paris on été ouverts pour ce tournoi !</b><br />Vous pouvez parier 10; 20 ou 30pd pour votre joueur favori avec la commande /tourbet [joueur], [10/20/30].</div>");
		room.update();
	},
	
	cerrarapuestas: 'closebets',
	closebets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (!tourStatus) return this.sendReply("Les paris ne sont pas ouverts.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("Il n'y a aucun tournoi dans la salle. Les paris ont été enlevés.")
		}
		tourStatus = false;
		this.privateModCommand('(' + user.name + ' a arrêté les paris pour le tournoi)');
		room.addRaw("<div class=\"broadcast-green\"><b>Les paris pour ce tournoi sont arrêtés!</b><br />À la fin du tournoi, les paris seront vérifiés.</div>");
		room.update();
	},
	
	apostartour: 'tourbet',
	tourbet: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!tourStatus) return this.sendReply("Les paris ne sont pas ouverts.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("Il n'y a aucun tournoi dans la salle.");
		}
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /tourbet [player], [10/20/30]");
		var money = parseInt(params[1]);
		if (!params[0]) return this.sendReply("Il n'y a pas de gagnant spécifié");
		var tourUsers = Tournaments.tournaments[room.id].generator.getUsers();
		var isInTour = false;
		for (var i = 0; i < tourUsers.length; ++i) {
			if (toId(params[0]) === toId(tourUsers[i])) {
				isInTour = true;
				break;
			}
		}
		if (!isInTour) return this.sendReply("Vous ne pouvez parier que pour un membre du tournoi");
		if (tourBets[user.userid]) this.parse('/canceltourbet');
		if (!money || (money !== 10 && money !== 20 && money !== 30) || money > Shop.getUserMoney(user.name)) return this.sendReply("Vous ne pouvez parier que 10; 20 ou 30pd. Il est possible que vous n'ayez pas la somme requise.");
		tourBets[user.userid] = {
			pd: money,
			player: toId(params[0])
		};
		tourPrize += money;
		Shop.removeMoney(user.name, money);
		return this.sendReply("Vous pariez " + money + " pd pour le gagnant " + getUserName(params[0]) + ". Vous pouvez modifier ou annuler votre pari avec /canceltourbet.");
	},
	
	cancelarapuesta: 'canceltourbet',
	canceltourbet: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino");
		if (!tourStatus) return this.sendReply("Les paris ne sont pas ouverts.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("Il n'y a aucun tounoi dans la salle.");
		}
		if (!tourBets[user.userid]) return this.sendReply("Vous n'avez pas parié, vous ne pouvez donc pas annuler votre pari.");
		Shop.giveMoney(user.name, tourBets[user.userid].pd);
		tourPrize += (- tourBets[user.userid].pd);
		delete tourBets[user.userid];
		return this.sendReply("Votre pari a été annulé.");
	},
	
	apuestas: 'tourbets',
	tourbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut être utilisée que dans le Casino.");
		if (!this.canBroadcast()) return;
		var betList = '';
		for (var i in tourBets) {
			betList += '<b>' + getUserName(i) + '</b> a parié <b>' + tourBets[i].pd + ' pd</b> pour le joueur <b>' + getUserName(tourBets[i].player) + '</b>. <br />';
		}
		if (betList === '') {
			this.sendReplyBox('Il n\'y avait pas de paris enregistré.');
		} else {
			this.sendReplyBox(betList);
		}
	},
	
	endtourbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut être utilisée que dans le Casino.");
		if (toId(user.name) !== toId(Bot.config.name) && !this.can('casino')) return false;
		if (!target) return this.sendReply("Aucun gagnant n'est spécifié.");
		var winners = [];
		var empty = true;
		for (var i in tourBets) {
			empty = false;
			if (toId(tourBets[i].player) === toId(target)) winners.push(i);
		}
		if (empty) return this.sendReply("Il n'y a pas de paris.");
		if (!winners || winners.length < 1) {
			Shop.giveMoney('casino', tourPrize);
			room.addRaw("<div class=\"broadcast-green\"><b>Le tournoi avec les paris est terminé !</b><br /> Malheureusement personne n'a parié pour " + getUserName(target) + "</div>");
			room.update();
		} else {
			var winData = '';
			var targetUser;
			for (var n = 0; n < (winners.length - 1); ++n) {
				Shop.giveMoney(toId(winners[n]), tourPrize * (tourBets[toId(winners[n])].pd / 10));
				targetUser = Users.get(winners[n]);
				if (targetUser && targetUser.connected) targetUser.popup('Félicitation, vous avez gagné ' + tourPrize * (tourBets[toId(winners[n])].pd / 10) + ' pd pour avoir gagné vos paris lors de ce tournoi dans le Casino ! ');
				if (n === 0) {
					winData += getUserName(winners[n]);
				} else {
					winData += ', ' + getUserName(winners[n]);
				}
			}
			Shop.giveMoney(toId(winners[winners.length - 1]), tourPrize * (tourBets[toId(winners[n])].pd / 10));
			targetUser = Users.get(winners[winners.length - 1]);
			if (targetUser && targetUser.connected) targetUser.popup('Félicitation, vous avez gagné ' + tourPrize * (tourBets[toId(winners[winners.length - 1])].pd / 10) + '  pd pour avoir gagné vos paris lors de ce tournoi dans le Casino !');
			if (winners.length > 1) winData += ' y ';
			winData += getUserName(winners[winners.length - 1]);
			room.addRaw("<div class=\"broadcast-green\"><b> Le tournoi à paris est terminé ! </b><br />Félicitations à " + winData + " pour avoir gagné. Le prix dépend des paris :  " + tourPrize + " pd (x1/x2/x3)</div>");
			room.update();
		}
		tourBets = {};
		tourStatus = false;
		tourPrize = 0;
	},
	
	/*nr: 'newwheel',
	nuevaruleta: 'newwheel',
	newwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut être utilisée ailleurs que dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (wheelStatus) return this.sendReply("Il y a déjà un jeu de roulette en marche.");
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /nuevaruleta [initprize], [size]");
		var initPrize = parseInt(params[0]);
		var wheelSize = parseInt(params[1]);
		if (initPrize && initPrize > 1000 && !casinoOwners[user.userid] && user.can('casino')) return this.sendReply("Vous n'avez pas l'autorisation de parier plus de 1000pd pour un jeu de roulette.");
		if (!wheelSize || wheelSize < 8 || wheelSize > 20) return this.sendReply("Il doit y avoir entre 8 et 20 Pokémon");
		if (initPrize && initPrize >= 10 && initPrize <= Shop.getUserMoney('casino')) {
			prize = initPrize;
			Shop.removeMoney('casino', initPrize);
		} else {
			return this.sendReply("Vous devez définir une somme de départ supérieure à 10pd, mais inférieur aux revenus totaux du casino.");
		}
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		wheelOptions = [];
		wheelStatus = true;
		for (var i in Tools.data.FormatsData) {
			if (Tools.data.FormatsData[i].randomBattleMoves) {
				keys.push(i);
			}
		}
		keys = keys.randomize();
		for (var i = 0; i < keys.length && pokemonLeft < wheelSize; i++) {
			var template = Tools.getTemplate(keys[i]);
			if (template.species.indexOf('-') > -1) continue;
			if (template.species === 'Pichu-Spiky-eared') continue;
			if (template.tier !== 'LC') continue;
			wheelOptions.push(template.species);
			++pokemonLeft;
		}
		var htmlDeclare = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			htmlDeclare += '<img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(wheelOptions[j]) + '.gif" title="' + wheelOptions[j] +'" />&nbsp;';
		}
		htmlDeclare += '<br /><br /><b>Usa /apostar [pokemon]Pour jouer au jeu de la roulotte. Cela vous coûtera 10 pd.</b><br /><b>Le ou les gagnant recevons un prix de ' + prize + ' pd + 20pd par participants.</b></center></div>';
		this.privateModCommand('(' + user.name + ' a lancé un jeu de roulette. Prix de départ :  ' + initPrize + ' pd ; Nombre de Pokémon : ' + wheelSize + ')');
		room.addRaw('<div class="broadcast-blue"><center><h1>Jeu de la roulette</h1><b>' + htmlDeclare);
		room.update();
	},
	
	finruleta: 'endwheel',
	endwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (!wheelStatus) return this.sendReply("Il n'y a pas de jeu de roulette en marche.");
		var pkm = wheelOptions[Math.floor(Math.random() * wheelOptions.length)];
		var htmlDeclare = '<div class="broadcast-green"><center><h1>Le jeu de la roulette est terminé!o</h1><h3>Le jeu de la roulette est terminé ! La roulette s\'est arrêtée sur ' + pkm + '</h3><img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(pkm) + '.gif" title="' + pkm + '" /> <br /><br /><b>';
		var winners = [];
		for (var i in wheelBets) {
			if (toId(wheelBets[i]) === toId(pkm)) winners.push(i);
		}
		if (!winners || winners.length < 1) {
			htmlDeclare += 'Malheureusement personne n\'a parié pour ce pokémon.</b>';
			Shop.giveMoney('casino', prize);
		} else if (winners.length === 1) {
			htmlDeclare += '&iexcl; Félicitation à ' + getUserName(winners[0]) + 'pour avoir gagné le jeu de la roulette ! <b /> Prix décerné aux gagnants : ' + prize + ' pd.</b>';
			Shop.giveMoney(toId(winners[0]), prize);
		} else {
			htmlDeclare += '&iexcl; Félicitation à ';
			for (var n = 0; n < (winners.length - 1); ++n) {
				Shop.giveMoney(toId(winners[n]), prize);
				if (n === 0) {
					htmlDeclare += getUserName(winners[n]);
				} else {
					htmlDeclare += ', ' + getUserName(winners[n]);
				}
			}
			Shop.giveMoney(toId(winners[winners.length - 1]), prize);
			htmlDeclare += ' y ' + getUserName(winners[winners.length - 1]) + ' pour avoir gagné au jeu de la roulette! <b /> Prix décerné aux gagnants :  ' + prize + ' pd.</b>';
		}
		htmlDeclare += '</center></div>';
		wheelStatus = false;
		wheelOptions = [];
		wheelBets = {};
		prize = 0;
		this.privateModCommand('(' + user.name + 'a mis fin au jeu de la roulette.)');
		room.addRaw(htmlDeclare);
		room.update();
	},
	
	ruleta: 'wheel',
	wheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Celle commande ne peut pas être utilisée ailleurs que dans le Casino.");
		if (!wheelStatus) return this.sendReply("Il n'y a pas de jeu de la roulette en marche.");
		if (!this.canBroadcast()) return;
		var optionsList = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			optionsList += wheelOptions[j] + ", ";
		}
		return this.sendReplyBox("<b>Options de la roulette :</b> " + optionsList + '<br /><b>Prix: </b>' + (prize) + ' pd.');
	},
	
	apostar: 'betwheel',
	betwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut pas être utilisée ailleurs que dans le Casino.");
		if (!wheelStatus) return this.sendReply("Il n'y a pas de jeu de la roulette en marche.");
		var pokemonId = toId(target);
		var validPkm = false;
		for (var j = 0; j < wheelOptions.length; j++) {
			if (pokemonId === toId(wheelOptions[j])) validPkm = true;
		}
		if (!validPkm) return this.sendReply(pokemonId + " n'est pas une option du jeu de la roulette. Pour voir les options, tapez /ruleta");
		if (wheelBets[user.userid]) {
			wheelBets[user.userid] = pokemonId;
			return this.sendReply("Vous avez changé votre pari pour " + pokemonId);
		} else {
			if (Shop.getUserMoney(user.name) < 10) return this.sendReply("Vous n'avez pas assez d'argent");
			wheelBets[user.userid] = pokemonId;
			Shop.removeMoney(user.name, 10);
			prize += 20;
			return this.sendReply("Vous avez parié sur " + pokemonId + ". Vous pouvez changer votre pari en relançant la commande mais un autre Pokémon, sans coûts supplémentaires, jusqu'à ce que le jeu de la roulette soit terminé.");
		}
	},*/
	
	beneficios: 'casinomoney',
	casinomoney: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut être utilisée que dans le Casino.");
		if (!this.canBroadcast()) return;
		var money = Shop.getUserMoney('casino');
		if (money < 1) return this.sendReply("Le Casino n'a aucun bénéfices.");
		return this.sendReply("Bénéfices du Casino: " + money + ' Pd');
	},
	
	darfondos: 'addcasinomoney',
	addcasinomoney: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can('givemoney')) return false;
		var money = Shop.getUserMoney(user.name);
		var targetMoney = parseInt(target);
		if (!targetMoney || targetMoney < 1) return this.sendReply("La quantité que vous avez insérée n'est pas valide.");
		if (money < targetMoney) return this.sendReply("Vous n'avez pas assez d'argent.");
		Shop.transferMoney(user.name, 'casino', targetMoney);
		this.privateModCommand('(' + user.name + ' a fait un don de ' + targetMoney + ' Pds pour le Casino. Merci ! )');
	},

	retirarfondos: 'transfercasinomoney',
	obtenerfondos: 'transfercasinomoney',
	transfercasinomoney: function (target, room, user) {
		//if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!casinoOwners[user.userid] && !this.can('givemoney')) return false;
		var money = Shop.getUserMoney('casino');
		var targetMoney = parseInt(target);
		if (!targetMoney || targetMoney < 1) return this.sendReply("La quantité que vous avez insérée n'est pas valide.");
		if (money < targetMoney) return this.sendReply("Il n'y a pas de bénéfices suffisants dans le Casino.");
		Shop.transferMoney('casino', user.name, targetMoney);
		this.privateModCommand('(' + user.name + ' a retiré ' + targetMoney + ' Pds des fonds du Casino.)');
	},

	//		var cost = 2;
	//et total = Db('money').set(user.userid, amount - cost).get(user.userid);
		//var total = Db('money').set(user.userid, amount - cost).get(user.userid);
// var amount = Db('money').get(idUser, 0);
// 				var amnt = Db('money').get(winners[n]);
			//var tt = Db('money').set(winners[n], amnt + bingoPrize).get(winners[n]);
			//var tot = Db('money').set(user.id, amount + money).get(user.id);
			//var tot = Db('money').set(user.userid, amount + money).get(user.userid);


	casinoowner: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino. ");
		if (!this.can('casino')) return;
		if (!target) return this.sendReply("Vous n'avez spécifié aucun utisateur.");
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("L'utilisateur que vous avez spécifié n'existe pas ou n'est pas disponible.");
		casinoOwners[targetUser.userid] = 1;
		this.addModCommand(targetUser.name + " a été nommé propriétaire du Casino par " + user.name + '.');
		writeCasinoData();
	},
	
	casinodeowner: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!this.can('casino')) return;
		if (!target) return this.sendReply("Vous n'avez spécifié aucun utisateur.");
		var targetUser = Users.get(target);
		var userName;
		if (!targetUser) {
			userName = toId(target);
		} else {
			userName = targetUser.name;
		}
		if (!casinoOwners[toId(target)]) return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		delete casinoOwners[toId(target)];
		this.privateModCommand("(" + userName + " s'est vu retiré le rang de propriétaire du Casino par " + user.name + '.)');
		if (targetUser && targetUser.connected) targetUser.popup(user.name + " t'a dégradé du poste de propriétaire du Casino.");
		writeCasinoData();
	},
	
	permisoevento: 'eventspermission',
	permisoeventos: 'eventspermission',
	eventspermission: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Cette commande ne peut que être utilisée dans le Casino.");
		if (!target) return this.sendReply("Vous n'avez spécifié aucun rang.");
		if (defaultPermission === 'casino' && !casinoOwners[user.userid] && !this.can('casino')) return false;
		switch (target.trim()) {
			case '+':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'broadcast';
				this.privateModCommand("(" + user.name + " établi le rang minimal pour utiliser les commandes du Casino à +)");
				break;
			case '%':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'staff';
				this.privateModCommand("(" + user.name + "établi le rang minimal pour utiliser les commandes du Casino à %)");
				break;
			case '@':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'ban';
				this.privateModCommand("(" + user.name + "établi le rang minimal pour utiliser les commandes du Casino à @)");
				break;
			case '#':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'declare';
				this.privateModCommand("(" + user.name + "établi le rang minimal pour utiliser les commandes du Casino à #)");
				break;
			case '~':
			case 'OFF':
			case 'off':
				if (!casinoOwners[user.userid] && !this.can('casino')) return false;
				defaultPermission = 'casino';
				this.privateModCommand("(" + user.name + "établi le rang minimal pour utiliser les commandes du Casino à ~)");
				break;
			default:
				return this.sendReply("Rangos: +, %, @, # y ~");
		}
	}
}
