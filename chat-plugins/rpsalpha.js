/*
Plugin RPS 2
WIP (0.1%)

Notes: 
- utiliser uhtml
- possibilité de quitter la partie avant qu'un 2e joueur rejoigne
- fonction claimVictory(user)
- startTime, gameID
- saveLogs (pas une priorité)
- getWinner() > false si ex-aequo ou retourne user, ne peut pas être lancée s'il manque un des deux plays
- getPlayer()
- end() lorsque les deux joueurs ont joués 
- rps ladder | infos sur profil 
- classement avec elo 
- Deux displays uhtml: les ins => de quoi jouer
- pas oublier check ip 
*/
class RPSplayer extends Rooms.RoomGamePlayer { // this.name = version sanitized username?
	constructor(user, id) {
		//WIP
		this.play = null;
		this.playTime = null;
		this.hasPlayed = false;
	}

	play() {

	}

	quit() {

	}

	display() {

	}

	update() {

	}

}

class RPSgame extends Rooms.RoomGame { 
	constructor(room, creator, number, ranked) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.gameid = 'rps';
		this.title = 'Rock, Paper, Scissors';
		this.creator = creator.name.replace(/[^a-zA-Z0-9 ]+/g, '');
		this.creatorid = creator.userid;

		this.isRanked = ranked;

		this.state = 'signups';
		this.startTime = null;
	}

	/*
	Initier la partie

	*/
	init() {
		this.room.add(`|uhtml|rps${this.room.gameNumber}signups|${this.entries()}`);
	}

	/*
	Genère l'infobox
	des ins

	*/
	entries() {
		let output = `<div class="infobox"><center><h1>Pierre Feuille Ciseaux</h1><button class="bb-button" style="border-radius: 14px"><small><i>Rejoindre la partie</i></small></button>`;
		output += `<ul style="list-style-type:none; border: 1px solid white; margin: 20px 30% 20px 30%; padding: 10px; text-align: left;">`;
		output += `<li>Type: ${this.isRanked ? '<b title="L\'issue de cette partie modifiera votre classement Elo">Partie Classée</b>' : '<b>Normale</b>'}</li>`;
		output += `<li>Créée par: <b style="color: ${hashColor(this.creatorid)}">${this.creator}</b></li>`;
		output += `<li>Joueurs: `;
		let temp = Object.values(this.players);
		for (let i = 0; i < temp.length; i++) {
			output += Chat.escapeHTML(temp[i].name);
			if (i < temp.length - 1) {
				output += ', ';
			}
		}
		output += `</li>`;
		output += `<li>ID: <i>1</i></li></ul></center></div>`;
		return output;
	}

	/*
	Mettre à jour l'infobox

	*/
	update() {
		if (this.state === 'signups') {
			this.room.add(`|uhtmlchange|rps${this.room.gameNumber}signups|${this.entries()}`);
		} else {
			this.room.add(`|uhtmlchange|rps${this.room.gameNumber}signups|<div class="infobox">(Partie ${this.isRanked ? 'classée' : 'normale'} entre x et x en cours)</div>`);
		}
	}

	/*
	Tentative de 
	rejoindre la partie

	*/
	join(user) {
		if (this.state !== 'signups') return user.sendTo(this.room, `La partie a commencé.`);
		if (this.addPlayer(user)) {
			this.update();
			if (this.playerCount === 2) this.start();
		} else {
			return user.sendTo(this.room, `Vous avez déjà rejoint la partie.`);
		}
	}

	/*
	Quitter une partie
	pas encore lancée

	*/
	leave(user) {
		if (this.state !== 'signups') return user.sendTo(this.room, `Impossible de quitter car la partie a commencé. Vous pouvez néanmoins abandonner la partie.`);
		if (!(user.userid in this.players)) return user.sendTo(this.room, `Vous n'avez pas rejoint la partie.`);

		this.removePlayer(user);
		this.update();
	}

	/*
	Lancer la partie

	*/
	start() {
		this.state = 'started';

	}

	/*
	Mettre à jour l'infobox
	des joueurs

	*/
	updategame() {

	}

	/*
	Retourne le vainqueur
	ou false si ex-aequo

	*/
	winner() {

	}

	/*
	Termine la partie

	*/
	end() {

	}
}

exports.commands = {
	/*
	rps: {
		new: function(target, room, user) {
			if (!this.can('kill')) return false;

			room.game = new RPSgame(room, user, 0, false);
		},

		join: function(target, room, user) {
			if (!this.can('kill')) return false;
		},

		leave: function(target, room, user) {
			if (!this.can('kill')) return false;
		},

		end: function(target, room, user) {
			if (!this.can('kill')) return false;
		},

		log: function(target, room, user) { // Debug 
			if (!this.can('kill')) return false;
		}
	}*/
}