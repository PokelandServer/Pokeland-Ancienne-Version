'use strict';
 
class PassTheBomb extends Rooms.RoomGame {
    constructor(room, seconds) {
        super(room);
 
        this.gameid = 'ptb';
        this.title = 'Pass The Bomb';
        this.players = new Map();
        this.round = 0;
        this.room = room;
        if (this.room.bombCount) {
            this.room.bombCount++;
        } else {
            this.room.bombCount = 1;
        }
        this.timeLeft = Date.now() + seconds * 1000;
 
        this.room.add('|uhtml|bomb' + this.room.bombCount + this.round + '|<div class = "infobox"><center>Une partie de <strong>Pass the Bomb</strong> a commencé!<br>' +
            'The game will begin in <strong>' + seconds + '</strong> seconds!<br>' +
            '<button name = "send" value = "/passthebomb join">Join!</button></center></div>'
        );
        this.timer = setTimeout(() => {
            if (this.players.size < 3) {
                this.room.add('|uhtmlchange|bomb' + this.room.bombCount + this.round + '|<div class = "infobox"><center>Cette partie de Pass a été arrêtée à cause du manque de joueurs.</center></div>').update();
                return this.end();
            }
            this.nextRound();
        }, seconds * 1000);
    }
    updateJoins() {
        let msg = 'bomb' + this.room.bombCount + this.round + '|<div class = "infobox"><center>Une partie de <strong>Pass the Bomb</strong> a commencé!<br>' +
            'La partie commencera dans<strong>' + Math.round((this.timeLeft - Date.now()) / 1000) + '</strong> secondes<br>' +
            '<button name = "send" value = "/passthebomb join">Join!</button></center>';
        if (this.players.size > 0) {
            msg += '<center><strong>' + this.players.size + '</strong> ' + (this.players.size === 1 ? 'user has' : 'users have') + ' joined: ' + Array.from(this.players).map(player => hashColors(player[1].name)).join(', ') + '</center>';
        }
        this.room.add('|uhtmlchange|' + msg + '</div>');
    }
    join(user, self) {
        if (this.round > 0) return self.sendReply('Vous ne pouvez pas rejoindre une partie de Pass The Bomb si celle-ci a déjà commencé.');
        if (!user.named) return self.errorReply("Vous devez choisir un nom pour rejoindre la partie de Pass The Bomb.");
        if (this.players.has(user.userid)) return self.sendReply('Vous avez déjà rejoint la partie de Pass The Bomb.');
 
        let players = Array.from(this.players).map(playerinfo => playerinfo[1]);
        let joined = players.filter(player => player.ip === user.latestIp);
        if (joined.length) return self.errorReply("Vous avez déjà rejoint la partie de Pass The Bomb sous le nom de '" + joined[0].name + "'. Utilisez plutôt cet alt/nom.");
 
        this.players.set(user.userid, {'name': user.name, 'ip': user.latestIp, 'status': 'alive', 'warnings': 0});
        this.updateJoins();
    }
    leave(userid, self) {
        if (!this.players.has(userid)) return self.sendReply('You haven\'t joined this game of Pass The Bomb yet.');
 
        if (!this.round) {
            this.players.delete(userid);
            this.updateJoins();
            self.sendReply("Vous avez quitté la partie de Pass The Bomb.");
        } else {
            this.removeUser(userid, true);
        }
    }
    getSurvivors() {
        return Array.from(this.players).filter(player => player[1].status === 'alive');
    }
    setBomb(userid) {
        if (!userid) {
            let players = this.getSurvivors();
            this.holder = players[Math.floor(Math.random() * players.length)][0];
        } else {
            this.holder = userid;
        }
    }
    getMsg() {
        let msg = 'bomb' + this.room.bombCount + this.round + '|<div class = "infobox"><center><strong>Round ' + this.round + '</strong><br>' +
            'Players: ' + this.getSurvivors().map(player => hashColors(player[1].name)).join(', ') +
            '<br><small>Utilisez /pb ou /passbomb [joueur] pour passer la bombe à un autre joueur!</small>';
        return msg;
    }
    nextRound() {
        clearTimeout(this.timer);
        this.canPass = false;
        if (this.checkWinner()) return this.getWinner();
        this.players.forEach((details, user) => {
            if (this.players.get(user).status === 'alive') {
                this.players.get(user).warnings = 0;
            }
        });
 
        this.round++;
        this.madeMove = false;
        this.room.add('|uhtml|' + this.getMsg() + '<br><i>Wait for it...</i></div>').update();
 
        this.release = setTimeout(() => {
            this.setBomb();
            let player = this.players.get(this.holder).name;
            this.room.add('|uhtmlchange|' + this.getMsg() + '<br><strong style = "font-size: 10pt;">La bombe a été passée à </strong>' + hashColors(this.holder, true) + hashColors(player, true) + '</div>').update();
            this.canPass = true;
            this.resetTimer();
        }, (Math.floor(Math.random() * 12) + 3) * 1000);
    }
    pass(user, target, self) {
        let getUser = this.players.get(user.userid);
        if (!getUser) return self.sendReply("Vous n'êtes pas un joueur de la partie de Pass the Bomb.");
        if (!this.round) return self.sendReply("La partie n'a pas encore commencé!");
 
        if (getUser.status === 'dead') return self.sendReply("Vous avez déjà été tué!");
 
        if (!target || !target.trim()) return self.sendReply("Vous devez un choisir un joueur pour passer la bombe.");
 
        let targetId = toId(target);
        let targetUser = Users.getExact(targetId) ? Users(targetId).name : target;
        if (!this.players.has(targetId)) return self.sendReply(targetUser + ' n est pas un joueur!');
        if (this.players.get(targetId).status === 'dead') return self.sendReply(this.players.get(targetId).name + ' a déjà été tué!');
        if (targetId === user.userid) return self.sendReply('You\'re already in possession of the bomb! You can\'t pass it to yourself!');
 
        if (!this.canPass || this.holder !== user.userid) {
            if (getUser.warnings < 2) {
                this.players.get(user.userid).warnings++;
                return self.sendReply("Vous n'êtes pas en possession de la bombe!");
            }
            this.removeUser(user.userid);
            self.sendReply("Vous avez été disqualifié pour avoir spammé /passbomb.");
            self.privateModCommand("(" + user.name + " a été disqualifié pour avoir spammé /passbomb.)");
            return;
        }
 
        this.madeMove = true;
        this.setBomb(targetId);
        this.room.add('|html|' + hashColors(user.name) + ' a passé la bombe à ' + hashColors(targetId, true)  + '</strong>!');
 
        if (this.checkWinner()) this.getWinner();
    }
    resetTimer() {
        this.timer = setTimeout(() => {
            let player = this.players.get(this.holder).name;
            this.room.add('|html|La bombe a explosé et a tué <span style = "' + hashColors(this.holder, true) + '">' + player + '</span>').update();
            this.players.get(this.holder).status = 'dead';
            this.canPass = false;
            setTimeout(() => {
                this.nextRound();
                this.room.update();
            }, 1200);
        }, (Math.floor(Math.random() * 26) + 5) * 1000);
    }
    dq(user, target, self) {
        if (!this.round) return self.sendReply('Vous pouvez seulement disqualifier un joueur après le premier round.');
        let targetId = toId(target);
 
        let getUser = this.players.get(targetId);
        if (!getUser) return self.sendReply(target + ' n est pas un joueur!');
        if (getUser.status === 'dead') return self.sendReply(getUser.name + ' a déjà été tué!');
 
        self.privateModCommand("(" + getUser.name + " a été disqualifié par " + user.name + ".)");
        this.removeUser(targetId);
    }
    removeUser(userid, left) {
        if (!this.players.has(userid)) return;
 
        this.room.add('|html|' + hashColors(this.players.get(userid).name, true) + ' a ' + (left ? 'left' : 'a été disqualifié de') + ' la partie.');
        this.players.delete(userid);
        this.madeMove = true;
        if (this.checkWinner()) {
            this.getWinner();
        } else if (!this.canPass) {
            this.room.add('|uhtmlchange|' + this.getMsg() + '<br><i>Wait for it...</i></div>').update();
        } else if (this.holder === userid) {
            this.setBomb();
            let player = this.players.get(this.holder).name;
            this.room.add('|html|La bombe a été passée à ' + hashColors(player, true) + '!').update();
        }
    }
    checkWinner() {
        if (this.getSurvivors().length === 1) return true;
    }
    getWinner() {
        let winner = this.getSurvivors()[0][1].name;
        let msg = `|html|<div class = "infobox"><center>Le gagnant de la partie de Pass The Bomb est ${hashColors(winner, true)}! Gg!</center>`;
        if (this.room.isOfficial) {

            msg += `${hashColors(winner, true)} a aussi gagné 5 EXP pour avoir gagné cette partie de Pass the Bomb.(pas encore issou)`;
        }
        this.room.add(msg).update();
        this.end();
    }
    end(user) {
        if (user) {
            let msg = '<div class = "infobox"><center>Cette partie de Pass The Bomb a été arrêté de force par ' + hashColors(user.name, true) + '.</center></div>';
            if (!this.madeMove) {
                this.room.add('|uhtmlchange|bomb' + this.room.bombCount + this.round + '|' + msg).update();
            } else {
                this.room.add('|html|' + msg).update();
            }
        }
        if (this.release) clearTimeout(this.release);
        clearTimeout(this.timer);
        delete this.room.passthebomb;
    }
}
 
let commands = {
    '': 'help',
    help: function () {
        this.parse('/help passthebomb');
    },
    'new': 'start',
    begin: 'start',
    start: function (target, room, user) {
        if (room.passthebomb) return this.sendReply("Il y a déjà une partie de Pass The Bomb en cours dans cette room.");
        if (!this.canTalk()) return this.errorReply("Vous ne pouvez pas utiliser cette commande pendant que vous ne pouvez pas parler.");
        if (!user.can('broadcast', null, room)) return this.sendReply("Vous devez être de rang + ou plus pour start une partie de Pass The Bomb.");
 
        if (!target || !target.trim()) target = '60';
        if (isNaN(target)) return this.sendReply('\'' + target + '\' is not a valid number.');
        if (target.includes('.') || target > 180 || target < 10) return this.sendReply('Le nombre de secondes ne doit pas être un décimal et doit être entre 10 et 180.');
 
        room.passthebomb = new PassTheBomb(room, Number(target));
    },
    join: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
        if (!this.canTalk()) return this.errorReply("Vous ne pouvez pas utiliser cette commande pendant que vous ne pouvez pas parler.");
 
        room.passthebomb.join(user, this);
    },
    leave: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
 
        room.passthebomb.leave(user.userid, this);
    },
    proceed: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
        if (!this.canTalk()) return this.errorReply("Vous ne pouvez pas utiliser cette commande pendant que vous ne pouvez pas parler.");
        if (!user.can('broadcast', null, room)) return this.sendReply("Vous devez être de rang + ou plus dans cette room pour commencer de force le premier round d'une partie de Pass The Bomb.");
 
        if (room.passthebomb.round) return this.sendReply('Cette partie de Pass The Bomb a déjà commencé!');
        if (room.passthebomb.players.size < 2) return this.sendReply('There aren\'t enough players yet. Wait for more to join!');
        room.add('(' + user.name + ' forcibly started round 1)');
        room.passthebomb.nextRound();
    },
    disqualify: 'dq',
    dq: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
        if (!this.canTalk()) return this.errorReply("Vous ne pouvez pas utiliser cette commande pendant que vous ne pouvez pas parler.");
        if (!user.can('mute', null, room)) return this.sendReply("Vous devez être de rang % ou plus pour disqualifier un utilisateur pendant cette partie de Pass The Bomb.");
 
        room.passthebomb.dq(user, target, this);
    },
    passbomb: 'pass',
    pass: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
        if (!this.canTalk()) return this.errorReply("Vous ne pouvez pas utiliser cette commande pendant que vous ne pouvez pas parler.");
 
        room.passthebomb.pass(user, target, this);
    },
    cancel: 'end',
    end: function (target, room, user) {
        if (!room.passthebomb) return this.sendReply("Il n'y a pas de partie de Pass The Bomb en cours.");
        if (!user.can('mute', null, room)) return this.sendReply("Vous devez être de rang % ou plus pour terminer cette partie de Pass The Bomb.");
 
        room.passthebomb.end(user);
    },
};
 
exports.commands = {
    ptb: 'passthebomb',
    passthebomb: commands,
    pb: 'passbomb',
    passbomb: commands.pass,
    passthebombhelp: [
        '/passthebomb start [secondes] - Start une partie de Pass The Bomb sur la room. Le premier round commencera après le nombre de secondes mentionnés (1 minute par défaut). Requiert le rang + ou plus pour utiliser cette commande.',
        '/passthebomb join/leave - Rejoint/Quitte la partie de Pass The Bomb.',
        '/passthebomb proceed - Start de force le premier round de la partie. Requert le rang + ou plus pour utiliser cette commande.',
        '/passthebomb dq [Utilisateur] - Disqualifie une joueur de la partie de Pass The Bomb. Requiert % ou plus pour utiliser cette commande.',
        '/passthebomb pass [Utilisateur] - Passe la bombe à un autre joueur. (NOTE: Spammer ça peut vous faire disqualifier)',
        '/passthebomb end - Termine de force la partie de Pass The Bomb. Requiert le rang % ou plus pour utiliser cette commande.',
        '(/ptb is a valid alias for /passthebomb)',
    ],
};