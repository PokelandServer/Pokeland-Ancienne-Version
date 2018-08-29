//rock paper scissors - wip
// to-do : timeout si afk 
// By Panur 
class RPS {
	constructor(room, maker, bet, opts) {
		this.room  = room;  // obj
		this.bet   = bet;   // number
		this.maker = maker; // obj
		this.opts  = opts;  // idée... bo3/5? 

		this.player1;
		this.player1play;
		this.player2;
		this.player2play;
		this.started = false;
	}

	join(user) {
		if (this.started || (this.player1 && this.player2)) return user.sendTo(this.room, "La partie a commencé.");

		if (!this.player1) {
			this.player1 = user;
			this.room.add('|raw|<b>'+ user.name +' a rejoint la partie</b>');
			return;
		}

		if (!this.player2) {
			if (user.latestIp == this.player1.latestIp) return user.sendTo(this.room, "Vous avez déjà rejoint la partie.");
			this.player2 = user; 
			this.room.add('|raw|<b>'+ user.name +' a rejoint la partie</b>');
			this.started = true;
			this.checkTurn();
			setTimeout(() => {
            	this.timeout();
        	}, 15000);
			return;
		}
	}

	timeout() {
		if (!this.player1play && !this.player2play) return this.onWin(null, false, true);
		if (this.player1play && !this.player2play) return this.onWin(this.player1, false, true);
		if (!this.player1play && this.player2play) return this.onWin(this.player2, false, true);
	}

	play(user, value) { 
		if (user.latestIp == this.player1.latestIp) {
			this.player1play = value; 
			this.checkTurn();
		} else if (user.latestIp == this.player2.latestIp) {
			this.player2play = value; 
			this.checkTurn();
		}
	}

	checkTurn() {
		if (!this.player1play && !this.player2play) {
			this.askPlayers(this.player1);
			this.askPlayers(this.player2);
		}
		if (this.player1play && this.player2play) {
			if (this.player1play == this.player2play) this.onWin(null, true);
			if (this.player1play == 'pierre') {
				if (this.player2play == 'feuille') this.onWin(this.player2, false, false);
				if (this.player2play == 'ciseaux') this.onWin(this.player1, false, false);
			}
			if (this.player1play == 'feuille') {
				if (this.player2play == 'pierre') this.onWin(this.player1, false, false);
				if (this.player2play == 'ciseaux') this.onWin(this.player2, false, false);
			}
			if (this.player1play == 'ciseaux') {
				if (this.player2play == 'pierre') this.onWin(this.player2, false, false);
				if (this.player2play == 'feuille') this.onWin(this.player1, false, false);
			}
		}
	}

	askPlayers(player) {
		let div = '<div class="infobox"><b><u>Choisissez une action</u></b><br /><button name="send" value="/rps play pierre"><i class="fa fa-hand-rock-o"></i> Pierre</button><button name="send" value="/rps play feuille"><i class="fa fa-hand-paper-o"></i> Feuille</button><button name="send" value="/rps play ciseaux"><i class="fa fa-hand-scissors-o"></i> Ciseaux</button>';
		player.sendTo(this.room, '|raw|'+ div);
	}

	insInfos() {
		return "<div class='infobox'><center><h1>Pierre, Feuille, Ciseaux</h1>Partie lancée par <b style='color: "+ hashColor(this.maker.userid) +"'>"+ this.maker.name +"</a><br /><br /><button name='send' value='/rps join'>Rejoindre la partie pour "+ this.bet +" buck(s).</button></center></div>";
	}

	onWin(winner, tie, timeout) {
		if (timeout) {
			if (winner) {
				this.room.add('|raw|<b>'+ winner.name +'</b> gagne car son adversaire n\'a pas pu jouer à temps!');
				Db('money').set(winner.userid, Db('money').get(winner.userid, 0) + (this.bet*2)).get(winner.userid);
				return delete this.room.rps;
			} else {
				this.room.add('|raw|<b>Aucun joueur n\'a joué à temps! Match nul.</b>');
				let val = parseInt(this.bet);
				Db('money').set(this.player1.userid, Db('money').get(this.player1.userid, 0) + val).get(this.player1.userid);
				Db('money').set(this.player2.userid, Db('money').get(this.player2.userid, 0) + val).get(this.player2.userid);
				return delete this.room.rps;
			}
		}
		if (tie) {
			this.room.add('|raw|'+ this.player1.name +' a joué '+ this.player1play +', comme '+ this.player2.name +'. <b>Match Nul!</b>');
			let val = parseInt(this.bet);
			Db('money').set(this.player1.userid, Db('money').get(this.player1.userid, 0) + val).get(this.player1.userid);
			Db('money').set(this.player2.userid, Db('money').get(this.player2.userid, 0) + val).get(this.player2.userid);
			return delete this.room.rps;
		} else {
			this.room.add('|raw|<b>'+ this.player1.name +' a joué '+ this.player1play +' tandis que '+ this.player2.name +' a joué '+ this.player2play +'.</b>');
			this.room.add('|raw|<b>'+ winner.name +' a gagné!</b>');
			Db('money').set(winner.userid, Db('money').get(winner.userid, 0) + (this.bet*2)).get(winner.userid);
			return delete this.room.rps;
		}
	}
}

exports.commands = {
	rps: {
		new: function(target, room, user) {
			if (!this.can('mute')) return false;
			if (!this.canTalk()) return this.errorReply("Impossible en étant mute.");

			let bet = toId(target);
			if (isNaN(bet)) return this.errorReply("La mise doit être un nombre.");
			if (String(bet).includes('.')) return this.errorReply("La mise ne doit pas être un chiffre décimal.");
			if (bet < 1) return this.errorReply("La mise ne doit pas être inférieur à 1 buck.");

			room.rps = new RPS(room, user, bet, null);
			room.add('|raw|'+ room.rps.insInfos());
		},

		join: function(target, room, user) {
			if (!room.rps) return this.errorReply("Il n'y a pas de partie en cours.");
			if (room.rps.started) return this.errorReply("La partie a été lancée.");
			
			if (Db('money').get(user.userid, 0) < room.rps.bet) return this.errorReply("Tu n'as pas assez de bucks pour rejoindre la partie.");
			Db('money').set(user.userid, Db('money').get(user.userid) - room.rps.bet);
			room.rps.join(user);
		},

		end: function(target, room, user) {
			if (!this.can('broadcast')) return false;
			if (!room.rps) return this.errorReply("Il n'y a pas de partie en cours.");

			delete room.rps; 
			this.privateModCommand(user.name + " a arrêté la partie.");
		},

		'': 'info',
		info: function(target, room, user) {
			if (!this.runBroadcast()) return; 
			if (!room.rps) return this.errorReply("Il n'y a pas de partie en cours.");
			if (room.rps.started) {
				this.sendReply('|raw|<b>La partie a commencé.</b>');
			} else {
				this.sendReply('|raw|'+ room.rps.insInfos());
			}
		},

		play: function(target, room, user) {
			if (!room.rps) return false; 
			if (!room.rps.started) return false; 
			if ((user.latestIp == room.rps.player1.latestIp) || (user.latestIp == room.rps.player2.latestIp)) {
				let plays = ['pierre', 'feuille', 'ciseaux'];
				if (plays.indexOf(toId(target)) == -1) return false; 
				room.rps.play(user, toId(target));
				this.sendReply('|raw|Vous avez joué <b>'+ target +'</b>');
			}
		}
	}
};