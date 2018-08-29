class RPSplayer {
	constructor(room, user, id) {
		this.room = room;
		this.user = user;
		this.id = id;

		this.play; 				
		this.playTime; 
		this.hasPlayed = false; 


	}

	play(choice) {
		if (this.hasPlayed) return user.sendTo(this.room, 'Vous avez déjà joué.');
		let viableChoices = ['pierre', 'feuille', 'ciseaux'];
		if (viableChoices.indexOf(toId(choice)) > -1) {
			this.play = toId(choice);			// choix du joueur
			this.playTime = new Date();			// temps du play
			this.hasPlayed = true;				// a joué => true
			this.display_act();					// update l'infobox du joueur
			return this.room.rps.checkTurn();	// retour à l'engine 
		} else {
			return this.user.sendTo(this.room, 'Choix impossible.');
		}

	}

	display_play() {

	}

	display_act() {

	}
}

class RPSgame {
	constructor(room, maker, ranked) {
		this.room   = room; 	// Object
		this.maker  = maker;	// Object
		this.ranked = ranked;	// Bool

		this.startTime = new Date();
		this.started = false;
		this.players = {};

		if (room.rpsgameid) {
			room.rpsgameid++;
		} else {
			room.rpsgameid = 1;
		}
	}

	join(user) {

	}

	leave(user) {

	}

	start() {

	}

	checkTurn() {

	}

	claimVictory(user) {

	}

	getWinner() {

	}

	end() {

	}

	saveLogs() {

	}

	display_join() {

	}

	display_ongoing() {

	}

	display_end() {

	}
} 