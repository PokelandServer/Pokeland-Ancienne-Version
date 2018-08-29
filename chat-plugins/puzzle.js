//Tile Puzzle by SilverTactic (Siiilver) and ABootToTheHead
//Thanks to ABootToTheHead for letting me use his artwork for the puzzles. You da real mvp :D
'use strict';

const INACTIVE_KICK_TIME = 3 * 60 * 1000; //3 minutes

if (!global.TilePuzzles) global.TilePuzzles = new Map();
let TilePuzzles = global.TilePuzzles;

function getTime(ms) {
	let total = [];
	let time = Date.now() - ms;
	let secs = Math.floor(time / 1000);
	let mins = Math.floor(secs / 60);
	if (mins) total.push(mins + ' minute' + (mins === 1 ? '' : 's'));
	if (secs %= 60) total.push(secs + ' second' + (secs === 1 ? '' : 's'));
	return total.join(' and ');
}

let tiles = [
	//froslass
	[
		'http://i.imgur.com/aOWDjKB.png', 'http://i.imgur.com/f3pdEFj.png', 'http://i.imgur.com/PQACa4o.png', 'http://i.imgur.com/cilSfXs.png',
		'http://i.imgur.com/RQAspHT.png', 'http://i.imgur.com/mdJOumj.png', 'http://i.imgur.com/l4dHZ4c.png', 'http://i.imgur.com/HJIrJu3.png',
		'http://i.imgur.com/5ZIx1Ku.png', 'http://i.imgur.com/t2hMBJn.png', 'http://i.imgur.com/1JZkruP.png', 'http://i.imgur.com/AKkFUgV.png',
		'http://i.imgur.com/3U1A9uz.png', 'http://i.imgur.com/BYsVznB.png', 'http://i.imgur.com/6h88DRj.png', 'http://i.imgur.com/zEBK5yf.png',
	],
	//mega ampharos
	[
		'http://i.imgur.com/BUOfuWb.png', 'http://i.imgur.com/GEWEHVI.png', 'http://i.imgur.com/7k8xZev.png', 'http://i.imgur.com/EYePYvD.png',
		'http://i.imgur.com/Ayjoojw.png', 'http://i.imgur.com/zImILQg.png', 'http://i.imgur.com/G2qxSXl.png', 'http://i.imgur.com/6iYbTPr.png',
		'http://i.imgur.com/WeOXhwS.png', 'http://i.imgur.com/pwdOJdo.png', 'http://i.imgur.com/hpRSMJy.png', 'http://i.imgur.com/itCpjGW.png',
		'http://i.imgur.com/ZHKnYYE.png', 'http://i.imgur.com/HkzF7Zf.png', 'http://i.imgur.com/mgA1Jgc.png', 'http://i.imgur.com/k0SHvwc.png',
	],
	//mega gardevoir
	[
		'http://i.imgur.com/FnKhIuw.png', 'http://i.imgur.com/CAhJS9Y.png', 'http://i.imgur.com/vhZcokf.png', 'http://i.imgur.com/Wh6jslP.png',
		'http://i.imgur.com/q6e7d4r.png', 'http://i.imgur.com/ZO8quaM.png', 'http://i.imgur.com/S9XhOVt.png', 'http://i.imgur.com/G656j7T.png',
		'http://i.imgur.com/jvk2WMJ.png', 'http://i.imgur.com/EDYkFTx.png', 'http://i.imgur.com/3HprrDX.png', 'http://i.imgur.com/QbArTOc.png',
		'http://i.imgur.com/pdkBHiy.png', 'http://i.imgur.com/agegAYh.png', 'http://i.imgur.com/N8ylGLP.png', 'http://i.imgur.com/80Xgi0t.png',
	],
].map((tileSet) => {
	return tileSet.map((tile) => {
		return {
			'tile': tile,
			'angle': 0,
		};
	});
});

class TilePuzzle {
	constructor(user) {
		this.user = user;
		this.answer = tiles[Math.floor(Math.random() * tiles.length)];
		this.tiles = this.answer.slice(0);
		let a, b, i = this.tiles.length;
		//randmozing the tiles
		while (i) {
			a = Math.floor(Math.random() * i);
			b = this.tiles[--i];
			this.tiles[i] = this.tiles[a];
			this.tiles[a] = b;
		}
		this.tiles.map(function (tile) {
			tile.angle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
			return tile;
		});

		this.display = [];
		for (let i = 0; i < this.tiles.length; i++) {
			this.display.push('<div style = "display: inline-block; width: 50px; height: 50px; border-top: 1px solid #fff; border-left: 1px solid #fff;' +
				'border-right: 2px solid rgba(0, 0, 0, 0.4); border-bottom: 2px solid rgba(0, 0, 0, 0.3);">' +
				'<button name = "send" value = "/tilepuzzle select ' + (i + 1) + '" style = "width: inherit; height: inherit;' +
				'border: none; background: url(' + this.tiles[i].tile + '); transform: rotate(' + this.tiles[i].angle + 'deg);"></button></div>'
			);
		}
		this.startTime = Date.now();
		this.timer = setTimeout(this.end.bind(this, 'inactive'), INACTIVE_KICK_TIME);
	}
	update(message) {
		let help = '<br><button name = "send" value = "/tilepuzzle help"><small>Comment jouer</small></button> <button name = "send" value = "/tilepuzzle end"><small>Quitter jeu</small></button>';
		this.user.popup('|html|<center><div style = "width: 220px;"><b>Tile Puzzle!<b><br>' +
			this.display.join('') + '</div>' + (message ? '<br>' + message : '') + help + '</center>' +
			'<button name = "send" value = "/tilepuzzle rotate" style = "float: right" ' + (isNaN(this.selection) ? 'disabled' : '') + '>Faire pivoter le carreau</button>'
		);
	}
	resetTimer() {
		clearTimeout(this.timer);
		this.timer = setTimeout(this.end.bind(this, 'inactive'), INACTIVE_KICK_TIME);
	}
	isFinished() {
		for (let i = 0; i < this.answer.length; i++) {
			if (this.answer[i].tile !== this.tiles[i].tile || this.tiles[i].angle !== 0) return false;
		}
		return true;
	}
	getTile(num, border) {
		return '<div style = "display: inline-block; width: 50px; height: 50px; border-top: 1px solid #fff; border-left: 1px solid #fff;' +
			'border-right: 2px solid rgba(0, 0, 0, 0.4); border-bottom: 2px solid rgba(0, 0, 0, 0.3); ' + (border ? 'border: ' + border : '') + '">' +
			'<button name = "send" value = "/tilepuzzle select ' + (num + 1) + '" style = "width: inherit; height: inherit;' +
			'border: none; background: url(' + this.tiles[num].tile + '); transform: rotate(' + this.tiles[num].angle + 'deg);"></button></div>';
	}
	selectTile(tileNumber) {
		if (!isNaN(this.selection) && (tileNumber === this.selection)) {
			this.display[tileNumber] = this.getTile(tileNumber);
			delete this.selection;
		} else if (!isNaN(this.selection)) {
			let selectedTile = this.tiles[this.selection];
			this.tiles[this.selection] = this.tiles[tileNumber];
			this.tiles[tileNumber] = selectedTile;

			this.display[this.selection] = this.getTile(this.selection);
			this.display[tileNumber] = this.getTile(tileNumber);
			delete this.selection;
		} else {
			this.selection = tileNumber;
			this.display[tileNumber] = this.getTile(tileNumber, '1px solid red');
		}
		this.resetTimer();
		if (!this.isFinished()) this.update();
		else this.end(true);
	}
	rotateTile() {
		if (isNaN(this.selection)) return this.update('Vous n\'avez pas sélectionné une tuile pour tourner encore.');
		let selected = this.tiles[this.selection];
		selected.angle += 90;
		if (selected.angle >= 360) selected.angle = 0;
		console.log(selected.angle);
		this.display[this.selection] = this.getTile(this.selection, '1px solid red');
		this.update();
	}
	end(status) {
		if (status === 'inactive') this.user.popup('Le jeu de Tile Puzzle a été terminé en raison de l\'inactivité.');
		else if (status) this.update('Vous avez terminé le puzzle dans ' + getTime(this.startTime) + '! Bon travail!');
		else this.user.popup('Vous avez décidé de quitter le jeu à mi-chemin.');
		clearTimeout(this.timer);
		global.TilePuzzles.delete(this.user);
	}
}

let cmds = {
	'': 'start',
	start: function (target, room, user) {
		if (TilePuzzles.has(user)) return TilePuzzles.get(user).update();
		TilePuzzles.set(user, new TilePuzzle(user));
		TilePuzzles.get(user).update('Astuce: si vous fermez accidentellement cette boîte contextuelle, utilisez <b>/tilepuzzle</b> Pour reprendre le jeu.');
	},

	help: function (target, room, user) {
		let help = 'Cliquez sur un carreau pour le sélectionner. Après avoir sélectionné un carreau, cliquer sur un autre carreau échangera ce carreau avec le carreau sélectionnée. ' +
			'Les carreaux sélectionnés auront une bordure rouge. Vous pouvez désélectionner la mosaïque sélectionnée en cliquant dessus à nouveau. Réorganisez les carreaux pour former l\'image correcte!';
		if (TilePuzzles.has(user)) return TilePuzzles.get(user).update(help);
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<center><b>Tile Puzzle</b><br><br>' + help + '<br><button name = "send" value = "/tilepuzzle"><b>Joue maintenant!</b></button>');
	},

	select: function (target, room, user) {
		let Game = TilePuzzles.get(user);
		if (!Game) return this.errorReply("Vous ne jouez pas actuellement à un jeu de Tile Puzzle.");
		if (!Number(target) || target.length > 2 || Number(target) < 1 || Number(target) > 16) return Game.update("Numéro de calque invalide. Vous ne pouvez choisir qu'un numéro de carreau entre 1 à 16.");

		Game.selectTile(Number(target) - 1);
	},

	rotate: function (target, room, user) {
		let Game = TilePuzzles.get(user);
		if (!Game) return this.errorReply("Vous ne jouez pas actuellement à un jeu de Tile Puzzle.");

		Game.rotateTile(Number(target) - 1);
	},

	forfeit: 'end',
	end: function (target, room, user) {
		let Game = TilePuzzles.get(user);
		if (!Game) return this.errorReply("Vous ne jouez pas actuellement à un jeu de Tile Puzzle.");

		Game.end();
	},
};

exports.commands = {
	tilepuzzle: cmds,
	selecttile: cmds.select,
	endpuzzle: cmds.end,
};