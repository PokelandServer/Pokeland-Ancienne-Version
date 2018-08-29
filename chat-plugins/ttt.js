//Tic Tac Toe by SilverTactic (Siiilver)
'use strict';

if (!global.ttt) global.ttt = [{}, {}];
var tttgames = global.ttt[0];
var tttplayers = global.ttt[1];

const EXPIRATION_TIME = 90 * 1000;
const INACTIVE_KICK_TIME = 30 * 1000;

var TicTacToe = (function () {
	function TicTacToe(user1, user2, gameNo) {
		this.gameNo = gameNo;
		this.p1 = user1;
		this.p2 = user2;
		this.players = [this.p1, this.p2];
		this.checkPlayer = function (user) {
			if (this.p1.userid === user.userid) return this.p2.name;
			if (this.p2.userid === user.userid) return this.p1.name;
			return false;
		}.bind(this);
		this.markers = {};
		this.markers[this.p1.userid] = 'X';
		this.boxes = {
			'1': 1,
			'2': 2,
			'3': 3,
			'4': 4,
			'5': 5,
			'6': 6,
			'7': 7,
			'8': 8,
			'9': 9
		};
		this.markedCount = 0;
		this.phase = 'waiting';
		this.timer = setTimeout(this.end.bind(this, 'Le défi a été annulé.'), EXPIRATION_TIME);
	}

	TicTacToe.prototype.accept = function () {
		this.markers[this.p2.userid] = 'O';
		this.currentPlayer = this.players[Math.floor(Math.random() * 2)];
		this.phase = 'started';
		this.resetTimer();
		var message = 'Si vous fermez le jeu accidentellement, utilisez <em>/ttt open</em> pour réouvrir le jeu.';
		this.updateUser(this.p1, message);
		this.updateUser(this.p2, message);
	};

	TicTacToe.prototype.switchPlayer = function () {
		if (this.currentPlayer === this.p1) this.currentPlayer = this.p2;
		else this.currentPlayer = this.p1;
	};

	TicTacToe.prototype.getGrid = function (gameOver) {
		var marked = [];
		for (var i in this.boxes) {
			if (typeof this.boxes[i] === 'string') marked.push(this.boxes[i]);
			else marked.push('<button style = "height: 80px%; width: 80px; font-size: 20pt" name = "send" value = "/ttt markbox ' + i + '"><b>' + i + '</b></button>');
		}
		var style = 'width: 100px; height: 100px; font-size: 20pt; ';
		var grid = '<table cellspacing = "0">' +
			//row 1
			'<tr><th style = "' + style + ' border-right: 3px solid; border-bottom: 3px solid;"><center>' + marked[0] + '</center></td>' +
			'<th style = "' + style + ' border-bottom: 3px solid;"><center>' + marked[1] + '</center></th>' +
			'<th style = "' + style + ' border-left: 3px solid; border-bottom: 3px solid;"><center>' + marked[2] + '</center></th></tr>' +
			//row 2
			'<tr><th style = "' + style + ' border-right: 3px solid;"><center>' + marked[3] + '</center></th>' +
			'<th style = "' + style + '"><center>' + marked[4] + '</center></th>' +
			'<th style = "' + style + ' border-left: 3px solid;"><center>' + marked[5] + '</center></th></tr>' +
			//row 3
			'<tr><th style = "' + style + ' border-right: 3px solid; border-top: 3px solid;"><center>' + marked[6] + '</center></th>' +
			'<th style = "' + style + ' border-top: 3px solid;"><center>' + marked[7] + '</center></th>' +
			'<th style = "' + style + ' border-left: 3px solid; border-top: 3px solid;"><center>' + marked[8] + '</center></th></tr></table><br>';
		if (!gameOver) grid += '<button name = "send" value = "/ttt end"><small>Quitter la partie</small></button>';
		return grid;
	};

	TicTacToe.prototype.markBox = function (user, num) {
		if (this.currentPlayer.userid !== user.userid) return this.updateUser(user, 'Ce n\'est pas votre tour.');
		if (!num || num.length > 1 || num.match(/[^1-9]/g)) return this.updateUser(user, 'Ce n\'est pas un nombre valide.');
		if (typeof this.boxes[num] === 'string') return this.updateUser(user, 'Cette case a déjà été marquée.');
		this.boxes[num] = this.markers[this.currentPlayer.userid];
		this.markedCount++;
		if (!this.checkWinner()) {
			this.resetTimer();
			this.switchPlayer();
			this.update();
		}
	};

	TicTacToe.prototype.update = function () {
		var message = '|html|<center><b>Tour de ' + this.currentPlayer.name + '!</b><br/>' + this.getGrid();
		this.players.forEach(function (user) {
			user.popup(message);
		});
	};

	TicTacToe.prototype.updateUser = function (user, issue) {
		var message = '|html|<center><b>Tour de ' + this.currentPlayer.name + '!</b><br>' +
			this.getGrid() + (issue ? '<br>' + issue : '');
		user.popup(message);
	};

	TicTacToe.prototype.checkWinner = function () {
		if ((this.boxes['1'] === this.boxes['2'] && this.boxes['2'] === this.boxes['3']) || (this.boxes['4'] === this.boxes['5'] && this.boxes['5'] === this.boxes['6']) || (this.boxes['7'] === this.boxes['8'] && this.boxes['8'] === this.boxes['9']) || (this.boxes['1'] === this.boxes['4'] && this.boxes['4'] === this.boxes['7']) || (this.boxes['2'] === this.boxes['5'] && this.boxes['5'] === this.boxes['8']) || (this.boxes['3'] === this.boxes['4'] && this.boxes['6'] === this.boxes['9']) || (this.boxes['1'] === this.boxes['5'] && this.boxes['5'] === this.boxes['9']) || (this.boxes['3'] === this.boxes['5'] && this.boxes['5'] === this.boxes['7'])) {
			this.declareWinner();
			return true;
		}
		if (this.markedCount === 9) {
			this.declareDraw();
			return true;
		}
	};

	TicTacToe.prototype.declareDraw = function () {
		var message = '|html|<center><b>Lol, égalité entre ' + this.p1.name + ' et ' + this.p2.name + '!</b><br>' + this.getGrid(true);
		this.players.forEach(function (user) {
			user.popup(message);
		});
		this.end();
	};

	TicTacToe.prototype.declareWinner = function () {
		var message = '|html|<center><b>' + this.currentPlayer.name + ' a gagné la partie!</b><br/>' + this.getGrid(true);
		this.players.forEach(function (user) {
			user.popup(message);
		});
		this.end();
	};

	TicTacToe.prototype.end = function (message) {
		if (message) {
			if (this.phase === 'waiting') this.players.forEach(function (user) {
			});
			else this.players.forEach(function (user) {
				user.popup(message);
			});
		}
		clearTimeout(this.timer);
		delete tttplayers[this.p1.userid];
		delete tttplayers[this.p2.userid];
		delete tttgames[this.gameNo];
	};

	TicTacToe.prototype.resetTimer = function () {
		clearTimeout(this.timer);
		this.timer = setTimeout(this.end.bind(this, 'La partie a été stoppée car l\'un des joueurs est inactif.'), INACTIVE_KICK_TIME);
	};

	return TicTacToe;
})();

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		this.sendReplyBox('<b>Commandes du morpion:</b><br>' +
			'<li>/ttt c <em>Utilisateur</em> - Défie quelqu\'un au morpion. La demande est uniquement envoyé en message privé. (Le défi s\'annule automatiquement après 1,5min sans réponse).<br>' +
			'<li>/ttt accept <em>User</em>  - Accepte le défi de morpion lancé par quelqu\'un d\'autre.<br>' +
			'<li>/ttc decline <em>User</em> - Refuse le défi de morpion lancé par quelqu\'un d\'autre.<br>' +
			'<li>/ttc see or /ttt show - Ouvre le morpion en cours si vous l\'avez fermé par accident.<br>' +
			'<li>/ttc end - Quitte la partie de morpion en cours. Refuse aussi un défi si la partie n\'a pas encore commencée. (Note: La partie se termine automatiquement si un des joueurs est inactif plus de 30 secondes.)<br>'
		);
	},

	chall: 'c',
	challenge: 'c',
	play: 'c',
	c: function (target, room, user, connection, cmd) {
		if (!target || !target.trim()) return this.sendReply('|html|/ttt ' + cmd + ' <em>User</em> - Défie quelqu\'un pour une partie de morpion.');
		var targetUser = (Users.get(target) ? Users.get(target).name : target);
		target = Users.get(target);
		if (!target || !target.connected) return this.sendReply('L\'utilisateur ' + targetUser + ' est hors-ligne.');
		if (user.userid === target.userid) return this.sendReply('Tu ne peux pas jouer au morpion avec toi-même espèce de noob !');
		if (user.userid in tttplayers) {
			var game = tttgames[tttplayers[user.userid]];
			if (game.phase === 'waiting') return this.sendReply('Vous avez déjà défié ' + game.checkPlayer(user) + ' pour une partie de morpion. En attente de sa réponse.');
			if (game.checkPlayer(target)) return this.sendReply('Vous jouez déjà au morpion avec ' + target.name + '!');
			return this.sendReply('Vous jouez déjà au morpion avec quelqu\'un. Vous ne pouvez donc pas défier ' + target.name + ' ,lol...');
		}
		if (target.userid in tttplayers) {
			var game = tttgames[tttplayers[target.userid]];
			if (game.checkPlayer(user)) return this.sendReply(game.checkPlayer(user) + ' vous a déjà envoyé une demande...');
			return this.sendReply(target.name + ' a déjà défié quelqu\'un pour une partie de morpion.');
		}
		for (var i in tttgames)
			if (tttgames[i].checkPlayer(user)) return this.sendReply('Vous avez été défié par ' + tttgames[i].checkPlayer(user) + '. Répondez déjà à cette demande avant de défier quelqu\'un d\'autre.');
		target.send('|pm|' + user.getIdentity() + '|' + target.getIdentity() + '|/html ' + user.getIdentity() + ' wants to play Tic-Tac-Toe!<br>' +
			'<button name = "send" value = "/ttt accept ' + user.userid + '">Accepter</button> <button name = "send" value = "/ttt decline ' + user.userid + '">Refuser</button>'
		);
		user.send('|pm|' + target.getIdentity() + '|' + user.getIdentity() + '|/html Vous avez défié ' + target.getIdentity() + ' pour une partie de morpion. En attente d\'une réponse.');
		var gameId = tttplayers[user.userid] = (Object.keys(tttgames).length ? Object.keys(tttgames).length - 1 : 0);
		tttgames[gameId] = new TicTacToe(user, target, gameId);
	},

	acc: 'accept',
	accept: function (target, room, user, connection, cmd) {
		if (!target || !target.trim()) return this.sendReply('|html|/ttt ' + cmd + ' <em>Utilisateur</em> - Accepte le defi de morpion lancé par un utilisateur.');
		var game = tttgames[tttplayers[user.userid]];
		var targetUser = (Users.get(target) ? Users.get(target).name : target);
		target = Users.get(target);
		if (!target || !target.connected) return this.sendReply('L\'utilisateur ' + targetUser + ' est hors ligne.');
		if (user.userid in tttplayers) {
			if (game.phase === 'waiting') return this.sendReply('Vous avez déjà défié quelqu\'un au morpion. Vous ne pouvez pas accepter le défi de cet utilisateur.');
			if (game.checkPlayer(target)) return this.sendReply(game.checkPlayer(user) + ' joue avec vous en ce moment!');
			return this.sendReply('Vous jouez déjà au morpion avec quelqu\'un d\'autre. Vous ne pouvez pas accepter la requête de ' + target.name + '!');
		}
		if (user.userid === target.userid) return this.sendReply('Vous ne pouvez pas accepter votre propre défi!');
		if (!(target.userid in tttplayers)) return this.sendReply(target.name + ' ne vous a pas défié au morpion.');

		game = tttgames[tttplayers[target.userid]];
		if (game.p2.userid !== user.userid) return this.sendReply(target.name + ' nos vous a pas défié au morpion.');
		tttplayers[user.userid] = tttplayers[target.userid];
		game.accept();
	},

	dec: 'decline',
	decline: function (target, room, user, connection, cmd) {
		if (!target || !target.trim()) return this.sendReply('|html|/ttt ' + cmd + ' <em>Utilisateur</em> - Refuse le défi de morpion lancé par un utilisateur.');
		var targetUser = (Users.get(target) ? Users.get(target).name : target);
		target = Users.get(target);
		if (!target || !target.connected) return this.sendReply('L\'utilisateur ' + targetUser + ' est hors ligne.');
		if (user.userid === target.userid) return this.sendReply('Vous ne pouvez pas utiliser cette commande sur vous-même.');
		var game = tttgames[tttplayers[toId(targetUser)]];
		if (!(target.userid in tttplayers) || !game.checkPlayer(target)) return this.sendReply(target + ' ne vous a pas défié au morpion.');
		if (game.checkPlayer(target) && game.phase == 'started') return this.sendReply('Vous êtes en train de jouer avec ' + game.checkPlayer(user) + ' en ce moment. Si vous voulez arrêter la partie, utilisez /ttt end.');

		if (Users.get(target) && Users.get(target).connected) Users.get(target).send('|pm|' + user.getIdentity() + '|' + Users.get(target).getIdentity() + '|/error Votre défi a été refusé.');
		user.send('|pm|' + Users.get(target) + '|' + user.getIdentity() + '|/erreur Vous avez refusé la demande de jeu.');

		game.end();
	},

	mark: 'markbox',
	markbox: function (target, room, user, connection, cmd) {
		if (!(user.userid in tttplayers)) return this.sendReply('Vous ne jouez pas au morpion en ce moment.');
		var game = tttgames[tttplayers[user.userid]];
		if (game.phase === 'waiting') return this.sendReply('La requête n\'a pas encore été acceptée. Vous ne pouvez pas utiliser cette commande tant que la partie n\'a pas commencée.');
		game.markBox(user, target);
	},

	update: 'see',
	view: 'see',
	show: 'see',
	see: function (target, room, user) {
		if (!(user.userid in tttplayers)) return this.sendReply('Vous ne jouez pas au morpion en ce moment.');
		var game = tttgames[tttplayers[user.userid]];
		if (game.phase === 'waiting') return this.sendReply('La requête n\'a pas encore été acceptée. Vous ne pouvez pas utiliser cette commande tant que la partie n\'a pas commencée.');
		game.update();
	},

	exit: 'end',
	leave: 'end',
	end: function (target, room, user) {
		if (!(user.userid in tttplayers)) return this.sendReply('Vous ne jouez pas au morpion en ce moment.');
		var game = tttgames[tttplayers[user.userid]];
		if (game.phase === 'waiting') game.end('La requête a été retirée.');
		else game.end(user.name + ' a décidé de quitter le jeu.');
	}
};

exports.commands = {
	ttt: 'tictactoe',
	tictactoe: cmds,
	tttend: 'endttt',
	endttt: cmds.end	
}