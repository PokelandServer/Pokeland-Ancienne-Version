//wip usage plugin by panur

let http = require('http');
//to-do: fonction qui choppe le lien directement 
let getLink = function() {
	return 'http://www.smogon.com/stats/2017-02/';
	// wip 
}

let getData = function(link, callback) {
	//de sparkychild
    http.get(link, res => {
        let data = '';
        res.on('data', part => {
            data += part;
        });
        res.on('end', () => {
            callback(data);
        });
    });
}

let getTier = function(targetMon) {
	let temp = Tools.getTemplate(targetMon);
	if (!temp.tier || temp.tier === 'Illegal') return false;
	if (temp.tier === 'Uber') return 'ubers';
 	if (temp.tier === 'New') return 'uu';
 	if (temp.tier === 'AG') return 'anythinggoes';
 	if (temp.tier === 'BL') return 'ou';
	return temp.tier; 
}

var eeon = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

var make_a_word = function() {
	var word = ''; 
	for(var i = 0; i < 12; i++) {
		word += eeon.charAt(Math.floor(Math.random() * eeon.length));
	}
	console.log(word);
}

let getLadderData = function(format, callback) {
	getData('http://pokemonshowdown.com/ladder/'+ format +'.json', data => {
		try {
			data = JSON.parse(data).toplist;
			callback(data);
		}
		catch (e) {
			callback(false);
			return console.log(e);
		}
	});
}

exports.commands = {
	ladder: function(target, room, user) {
		if (!this.runBroadcast()) return;
		//getLadderData('ou', toId(target), data => {
		//	console.log(data);
		//});
		if (!this.can('kill')) return false;
		make_a_word();
		let buffer = '<table cellspacing="0" cellpadding="0" border="0" width="325">';
		buffer += '<tr><td><table cellspacing="0" cellpadding="1" border="1" width="100%">';
		buffer += '<tr style="background-color:grey">';
		buffer += '<th>Ladder</th>';
		buffer += '</tr></table></td></tr><tr><td><div style="width:330px; height:160px; overflow:auto;">';
		buffer += '<table cellspacing="0" cellpadding="1" border="1" width="300">';
		getLadderData(toId(target), data => {
			if (!Object.keys(data).length) return this.errorReply('Format introuvable');
			let rank = 1;
			for(let i in data) {
				buffer += '<tr><td>#'+ rank +'</td><td>'+ data[i].username +'</td><td><b>'+ Math.round(data[i].elo) +'</b></td><td>'+ data[i].w +'W</td><td>'+ data[i].l +'L</td></tr>';
				rank++;
			}
			buffer += '</table></div></td></tr></table>';
			this.sendReply('|raw|'+ buffer);
		});
	},

	'!rank': true,
	rank: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) target = user.name;

		let getGXEColor = function(gxe) {
			let color; 
			if (gxe <= 40) {
				color = 'FF0000';
			} else if (gxe <= 45) {
				color = 'FF3300';
			} else if (gxe <= 50) {
				color = 'FF6600';
			} else if (gxe <= 55) {
				color = 'FF9900';
			} else if (gxe <= 60) {
				color = 'FFCC00';
			} else if (gxe <= 65) {
				color = 'FFFF00';
			} else if (gxe <= 70) {
				color = 'CCFF00';
			} else if (gxe <= 75) {
				color = '99FF00';
			} else if (gxe <= 80) {
				color = '66FF00';
			} else if (gxe <= 85) {
				color = '33FF00';
			} else if (gxe <= 90) {
				color = '00FF00';
			} else {
				color = '00FF33';
			}
			return color;
		};

		let buffer = '<div class="ladder" style="max-height: 250px; overflow-y: auto; width: 320px;"><table style="width: 300px;">';
		buffer += '<tr><td colspan="8"><strong>Rankings • ' + Chat.escapeHTML(target) + '</strong></td></tr>';
		Ladders.visualizeAll(target).then(values => {			
			buffer += '<tr><th colspan="8" style="background: #bbbbbb;">Pokeland</th></tr>';

			let ratings = values.join('');
			if (!ratings) {
				buffer += '<tr><td colspan="8"><em>Cet utilisateur n\'a pas encore joué sur le ladder.</em></td></tr>';
			} else {
				buffer += '<tr><th width="90">Format</th><th width="48"><abbr title="Elo rating">Elo</abbr></th><th width="8">W</th><th width="8">L</th><th width="8">Total</th>';
				buffer += ratings;
			}
			buffer += '</table>';
			// main serveur 

			let request = require('request');
			let targetid = toId(target); 
			let self = this; 
			request('http://pokemonshowdown.com/users/' + targetid + '.json', function (error, response, body) {
				let data = JSON.parse(body);
				let ratings = data['ratings'];
				let buffermain = '';

				buffermain += '<table style="width: 300px;">';
				buffermain += '<tr><th colspan="8" style="background: #bbbbbb;">Smogon U</th></tr>';
				if (!Object.keys(ratings).length) {
					buffermain += '<tr><td colspan="8"><em>Cet utilisateur n\'a pas encore joué sur le ladder.</em></td></tr>';
				} else {
					buffermain += '<tr><th width="90">Format</th><th width="48"><abbr title="Points Elo">Elo</abbr></th><th width="24"><abbr title="GXE (Glicko X-Act Estimate)">GXE</abbr></th></tr>'; 
				}

				let formatRanking = [];
				let count = 0, sumGXE = 0, sumElo = 0;
				for(let i in ratings) {
					formatRanking.push({
						format: i,
						elo: Math.round(ratings[i].elo),
						gxe: Math.round(ratings[i].gxe)
					});
					count++;
					sumGXE += Math.round(ratings[i].gxe);
					sumElo += Math.round(ratings[i].elo);
				}
				if (count > 1) buffermain += '<tr><td><strong>Moyenne</strong></td><td><strong>'+ Math.round(sumElo / count) +'</strong></td><td><abbr style="color: #'+ getGXEColor(Math.round(sumGXE / count)) +'; font-weight: bold;">'+ Math.round(sumGXE / count) +'</abbr></td></tr>';

				let byGXE = formatRanking.slice(0);
				byGXE.sort(function(a, b) {
					return b.gxe - a.gxe; 
				});

				for(let i in byGXE) {
					buffermain += '<tr><td>' + byGXE[i].format + '</td><td><strong>' + byGXE[i].elo + '</strong></td><td><abbr style="color: #'+ getGXEColor(byGXE[i].gxe) +';">'+ byGXE[i].gxe +'</abbr></td></tr>';
				}

				buffermain += '</table></div>';
				if (!room) return false;
				self.sendReply('|raw|' + buffer + buffermain);
				room.update();
			});
			
		});
	},

	rpgderue: function(target, room, user) {
		if (!this.runBroadcast()) return;
		target = target.split(',');
		if (!target[0] || !target[1]) return false; 
		var replies = [];
		var hp_player1 = 1000;
		var hp_player2 = 1000;
		var attac = {
			1: {name: "eeee", damage: 100},
			2: {name: "Coudkeu", damage: 120},
			3: {name: "Jet de Sperme", damage: 150},
			4: {name: "Urophilie", damage: 100},
			5: {name: "Leak Firmament", damage: 50},
			6: {name: "Zzé Ultime", damage: 190},
			7: {name: "GNER", damage: 100},
			8: {name: "Zzé Strike", damage: 180},
			9: {name: "Débilité", damage: 80},
			10: {name: "JUGEMENT DU DIEU GIVRIX", damage: 200},
			11: {name: "Fist", damage: 170},
			12: {name: "Petite Claque", damage: 20},
			13: {name: "Grande Colère de Speks", damage: 1},
			14: {name: "Permaban", damage: 190},
			15: {name: "Spam", damage: 70}, 
			16: {name: "GNER Roar", damage: 150},
			17: {name: "Coup de SKATE", damage: 130}, 
			18: {name: "Haine du Rageux Ultime", damage: 40},
			19: {name: "Clash Mondial", damage: 190},
			20: {name: "Clash de SPEKS", damage: 1},
			21: {name: "Ego de TOM", damage: 50},
			22: {name: "Lol, c'est random comme attaque. n_n", damage: Math.round(Math.random()*750)}, // dégâts random 
			23: {name: "mais rigole pas avec moi omg", damage: 170},
			24: {name: "azi cbon jte heal poto :p", damage: -100},
			25: {name: "aglouglou slurp", damage: -1500},
			26: {name: "Luck de TF", damage: 110},
			27: {name: "SLASH", damage: 130},
			28: {name: "Randomisateur", damage: 120},
			29: {name: "Ligne de poing", damage: 180},
			30: {name: "Coup de joint", damage: 30},
			31: {name: "Autisme", damage: 40},
			32: {name: "Lame Plotéenne", damage: 140},
			33: {name: "Clash régional", damage: 70},
			34: {name: "Koud'Pied", damage: 150},
			35: {name: "PUTIN SA SOUL!!", damage: 250}
		};
		//var nom_attaques = ['eeeee', 'Coudkeu', 'Jet de sperme', 'Urophilie', 'Leak Firmament', 'Keu 2 Fer', 'Zzé Ultime', 'GNER', 'Zzé\' Strike.', 'JUGEMENT DU DIEU GIVRIX', 'Débilité'];
		target[0] = '<b style="color: '+ hashColor(target[0]) +'">'+ target[0] +'</b>';
		target[1] = '<b style="color: '+ hashColor(target[1]) +'">'+ target[1] +'</b>';
		let turn = 1;
		while (hp_player2 > -1 || hp_player1 > -1) {
			replies.push('<b>TOUR '+ turn +'</b>');
			replies.push('• HP de '+ target[0] +': '+ hp_player1);
			replies.push('• HP de '+ target[1] +': '+ hp_player2);

			//var attaque1, attaque2;
			var attaque1 = attac[Math.round(Math.random() * 34) + 1];
			if (Math.random() > 0.95 || toId(attaque1.name) === 'luckdetf') {
				attaque1.name += ' (COUP CRITIQUE) ';
				attaque1.damage = attaque1.damage * 2; 
			}
			var attaque2 = attac[Math.round(Math.random() * 34) + 1];
			if (Math.random() > 0.95 || toId(attaque2.name) === 'luckdetf') {
				attaque2.name += ' (COUP CRITIQUE) ';
				attaque2.damage = attaque2.damage * 2; 
			}


			hp_player1 = hp_player1 - attaque1.damage;
			replies.push(target[1] +' utilise <i>'+ attaque1.name +'!</i> '+ target[0] +' perd '+ attaque1.damage +' HP.');
			if (hp_player1 <= 0) {
				replies.push(target[0] +' est mort.');
				break; 
			}

			hp_player2 = hp_player2 - attaque2.damage;
			replies.push(target[0] +' utilise <i>'+ attaque2.name +'!</i> '+ target[1] +' perd '+ attaque2.damage +' HP.');
			if (hp_player2 <= 0) {
				replies.push(target[1] +' est mort.');
				break; 
			}
			turn++;
		}
		this.sendReplyBox('<details style="border: 2px solid black ; text-align: center ; border-radius: 5px ; padding: 3px ; display: inline-block"><summary style="padding-right: 20px"><span style="font-weight: bold">COMBAT ENTRE '+ target[0] +' ET '+ target[1] +' EN '+ turn +' tour(s)</span></summary><p align="left">'+ replies.join('<br> ') +'</p></details>')

	},
	/*usage1500: 'usage',
	usage: function(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		let link = getLink();
		if (!target) return this.sendReplyBox('<a href="'+ link +'">Statistiques d\'utilisation</a>');

		if (!this.can('ban')) return; 
		let tier = getTier(toId(target));
		//if (!tier) return this.errorReply('Format introuvable');
		if (!tier) tier = 'ou';
		tier = 'gen7' + tier.toLowerCase();

		let opts = (cmd === 'usage1500') ? link + 'chaos/'+ tier + '-1500.json' : link + 'chaos/'+ tier + '-0.json';
		getData(opts, data => {
			try {
				data = JSON.parse(data).data;
				let targetMon, placement = {};
				for(let i in data) {
					if (toId(i) === toId(target)) {
						targetMon = {
							'name': i,
							'data': data[i]
						};
					}
					placement[toId(i)] = data[i].usage;
				}
				if (!targetMon) return this.errorReply('Pokémon introuvable');
				targetMon.placement = Object.keys(placement).sort((a, b) => {
					if (placement[a] > placement[b]) return -1;
					return 1;
				}).indexOf(toId(target)) + 1;

				// ITEMS
				let items = Object.keys(targetMon.data["Items"]).sort(function(a, b) {
					return targetMon.data["Items"][b] - targetMon.data["Items"][a];
				})
				let sorteditems = '';
				for(let j in items) {
					let percentage = ((targetMon.data["Items"][items[j]]/targetMon.data["Raw count"])*100).toFixed(2);
					if (percentage < 10 || parseInt(j) === 5) break;
					sorteditems += '- #'+ (parseInt(j) + 1) + ' <b>' + Tools.getItem(items[j]) + '</b> ('+ percentage +'%) <br />';
				}

				//MOVES
				let moves = Object.keys(targetMon.data["Moves"]).sort(function(a, b) {
					return targetMon.data["Moves"][b] - targetMon.data["Moves"][a];
				})
				let sortedmoves = '';
				for(let j in moves) {
					let percentage = ((targetMon.data["Moves"][moves[j]]/targetMon.data["Raw count"])*100).toFixed(2);
					if (percentage < 10 || parseInt(j) === 8) break;
					sortedmoves += '- #'+ (parseInt(j) + 1) + ' <b>' + Tools.getMove(moves[j]) + '</b> ('+ percentage +'%) <br />';
				}

				//SPREADS
				let spreads = Object.keys(targetMon.data["Spreads"]).sort(function(a, b) {
					return targetMon.data["Spreads"][b] - targetMon.data["Spreads"][a];
				})
				let sortedspreads = '';
				for(let j in spreads) {
					let percentage = ((targetMon.data["Spreads"][spreads[j]]/targetMon.data["Raw count"])*100).toFixed(2);
					if (percentage < 5 || parseInt(j) === 5) break;
					sortedspreads += '- #'+ (parseInt(j) + 1) + ' <b>' + spreads[j] + '</b> ('+ percentage +'%) <br />';
				}
				// Mettre fonction pour traiter les données selon tier, si le tier n'est pas trouvé, refaire le traitement avec tier OU 

				this.sendReplyBox(
					"<b>" + targetMon.name + "</b>: N°" + targetMon.placement + " en " + tier.toUpperCase() + "  (<b>" + (targetMon.data.usage * 100).toFixed(2) + "%</b> d'usage) <br /><br />" +
					"<u><b>Objets:</b></u> <br />" + sorteditems + "<br />" +
					"<u><b>Attaques:</b></u> <br />"+ sortedmoves + "<br />" +
					"<u><b>Répartitions:</b></u> <br />"+ sortedspreads + "<br />" +
					"<small>Statistiques générales du serveur principal"+ ((cmd === "usage1500") ? " (1500+)" : "") +", recense seulement les choix les plus populaires (+10% d'usage pour les attaques et objets, +5% pour les répartitions)</small>"
				);
				room.update();
			}
			catch (e) {
				console.log(e);
				return this.errorReply('Format / Pokémon introuvable');
			}
		});
	}*/
}