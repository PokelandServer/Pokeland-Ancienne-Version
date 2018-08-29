'use strict';
let path = require('path');
let fs = require('fs');
/**
 * Système d'EXP pour Pokémon Showdown
 
 */
 
const DEFAULT_AMOUNT = 0;
let DOUBLE_XP = false;
 
const minLevelExp = 15;
const multiply = 1.9;
 
function isExp(exp) {
    let numExp = Number(exp);
    if (isNaN(exp)) return "Must be a number.";
    if (String(exp).includes('.')) return "Ne peut pas contenir une décimale.";
    if (numExp < 1) return "Ne peut pas être inférieur à un XP.";
    return numExp;
}
WL.isExp = isExp;
 
let EXP = WL.EXP = {
    readExp: function (userid, callback) {
        userid = toId(userid);
 
        let amount = Db('exp').get(userid, DEFAULT_AMOUNT);
        if (typeof callback !== 'function') {
            return amount;
        } else {
            return callback(amount);
        }
    },
 
    writeExp: function (userid, amount, callback) {
        // In case someone forgot to turn `userid` into an actual ID...
        userid = toId(userid);
 
        // In case someone forgot to make sure `amount` was a Number...
        amount = Number(amount);
        if (isNaN(amount)) {
            throw new Error("EXP.writeExp: Expected amount parameter to be a Number, instead received " + typeof amount);
        }
        let curTotal = Db('exp').get(userid, DEFAULT_AMOUNT);
        Db('exp').set(userid, curTotal + amount);
        let newTotal = Db('exp').get(userid);
        if (callback && typeof callback === 'function') {
            // If a callback is specified, return `newTotal` through the callback.
            return callback(newTotal);
        }
    },
};
function logMoney(message) {
    if (!message) return;
    let file = path.join(__dirname, '../logs/money.txt');
    let date = "[" + new Date().toUTCString() + "] ";
    let msg = message + "\n";
    fs.appendFile(file, date + msg);
}
 
function addExp(user, room, amount) {
    if (!user || !room) return;
    user = Users(toId(user));
    if (Db('expoff').get(user.userid)) return false;
    if (DOUBLE_XP) amount = amount * 2;
    EXP.readExp(user.userid, totalExp => {
        let oldLevel = WL.level(user.userid);
        EXP.writeExp(user.userid, amount, newTotal => {
            let level = WL.level(user.userid);
            if (oldLevel < level) {
                let reward = '';
                switch (level) {
                case 5:
                    logMoney(user.userid + ' a reçu un custom symbol pour avoir atteint le niveau ' + level + '.');
                    user.canCustomSymbol = true;
                    reward = 'a Custom Symbol. Pour réclamer votre custom symbol, utilisez la commande /customsymbol [symbol]';
                    break;
                case 10:
                    logMoney(user.userid + ' a reçu un custom avatar pour avoir attenint le niveau ' + level + '.');
                    if (!user.tokens) user.tokens = {};
                    user.tokens.avatar = true;
                    reward = 'Tu as gagné un custom avatar si tu veux contacte un Administrateur';
                    break;
                case 15:
                    logMoney(user.userid + ' a reçu un custom title pour avoir atteint le niveau ' + level + '.');
                    if (!user.tokens) user.tokens = {};
                    user.tokens.title = true;
                    reward = 'Tu as gagné un title si tu veux contacte un Administrateur';
                    break;
                case 20:
                    logMoney(user.userid + ' a reçu une icon pour avoir atteint le niveau ' + level + '.');
                    if (!user.tokens) user.tokens = {};
                    user.tokens.icon = true;
                    reward = 'Tu as gagné une icon si tu veux contacte un Administrateur';
                    break;
                case 25:
                    logMoney(user.userid + ' a reçu une emote pour avoir atteint le niveau ' + level + '.');
                    if (!user.tokens) user.tokens = {};
                    user.tokens.emote = true;
                    reward = 'Tu as gagné une emote si tu veux contacte un Administrateur';
                    break;
                case 30:
                    logMoney(user.userid + ' a reçu une Custom Color pour avoir atteint le niveau ' + level + '.');
                    if (!user.tokens) user.tokens = {};
                    user.tokens.color = true;
                    reward = 'Tu as gagné une custom color si tu veux contacte un Administrateur';
                    break;
                case 40:
                    logMoney(user.userid + ' a réçu un color text pour avoir atteint le niveau ' + level + '.');
                    Rooms.rooms.get("staff").add('|c|~Notification XP|' + user.name + ' dois avoir un color text');
		Rooms.rooms.get("staff").update();
                    Monitor.adminlog(user.userid + ' Tu as gagné un color text si tu veux contacte un Administrateur ' + level + '!');
                    reward = 'Tu as gagné un color text si tu veux contacte un Administrateur ';
                    break;
                     case 45:
                    logMoney(user.userid + ' a réçu une PmBox pour avoir atteint le niveau ' + level + '.');
                    Rooms.rooms.get("staff").add('|c|~Notification XP|' + user.name + ' dois avoir une PmBox');
		Rooms.rooms.get("staff").update();
                    Monitor.adminlog(user.userid + ' Tu as gagné une PmBox si tu veux contacte un Administrateur ' + level + '!');
                    reward = 'Tu as gagné une PmBox si tu veux contacte un Administrateur ';
                    break;
                         case 50:
                    Db('money').set(user.userid, Db('money').get(user.userid, 0) + 50).get(user.userid);
                    reward = '50 ' + 'bucks' + '.';
                    break;
                          case 75:
                    logMoney(user.userid + ' a réçu un GlobalVoice pour avoir atteint le niveau ' + level + '.');
                    Rooms.rooms.get("staff").add('|c|~Notification XP|' + user.name + ' dois avoir un GlobalVoice');
		Rooms.rooms.get("staff").update();
                    Monitor.adminlog(user.userid + ' Tu as gagné un GlobalVoice si tu veux contacte un Administrateur ' + level + '!');
                    reward = 'Tu as gagné un GlobalVoice si tu veux contacte un Administrateur ';
                    break;
                default:
                Db('money').set(user.userid, Db('money').get(user.userid, 0) + Math.ceil(level * 0.5)).get(user.userid);
                    reward = Math.ceil(level * 0.5) + ' ' + (Math.ceil(level * 0.5) === 1 ? 'buck' : 'bucks') + '.';
                }
                user.sendTo(room, '|html|<center><font size=4><b><i>Level Up!</i></b></font><br />' +
                'Tu as atteint le niveau ' + level + ', et a obtenu ' + reward + '</b></center>');
            }
        });
    });
}
WL.addExp = addExp;
 
function level(userid) {
    userid = toId(userid);
    let curExp = Db('exp').get(userid, 0);
    return Math.floor(Math.pow(curExp / minLevelExp, 1 / multiply) + 1);
}
WL.level = level;
 
function nextLevel(user) {
    let curExp = Db('exp').get(toId(user), 0);
    let lvl = WL.level(toId(user));
    return Math.floor(Math.pow(lvl, multiply) * minLevelExp) - curExp;
}
WL.nextLevel = nextLevel;
 
exports.commands = {
    '!exp': true,
    level: 'exp',
    xp: 'exp',
    exp: function (target, room, user) {
        if (!this.runBroadcast()) return;
        let targetId = toId(target);
        if (target || !target && this.broadcasting) {
            if (!target) targetId = user.userid;
            EXP.readExp(targetId, exp => {
                this.sendReplyBox('<b>' + hashColors(targetId, true) + '</b> a ' + exp + ' exp et son niveau est ' + WL.level(targetId) + ' et a besoin de ' + WL.nextLevel(targetId) + ' pour atteindre le niveau suivant.');
            });
        } else {
            EXP.readExp(user.userid, exp => {
                this.sendReplyBox("Nom : " + hashColors(user.userid, true) + "<br />Niveau actuel: " + WL.level(user.userid) + "<br />Exp nécessaire pour atteindre le niveau suivant: " + WL.nextLevel(user.userid) +
                    "<br />Toutes les récompenses ne peuvent s'utiliser qu'une seule fois! <br /><br />" +
                    "Le niveau 5 débloque un Custom Symbol gratuit. <br /><br />" +
                    "Le niveau 10 débloque un Custom Avatar gratuit. <br /><br />" +
                    "Le niveau 15 débloque un Titre de Profil gratuit. <br /><br />" +
                    "Le niveau 20 débloque une Icon gratuite. <br /><br />" +
                    "Le niveau 25 débloque une Emote gratuite. <br /><br />" +
                    "Le niveau 30 débloque une Custom Color gratuite.  <br /><br />" +
                    "Le niveau 40 débloque un color text gratuite . <br /><br />" +
                    "Le niveau 45 débloque un PmBox gratuite . <br /><br />" +
                    "Le niveau 50 débloque 50 bucks . <br /><br />" +
                    "Le niveau 75 débloque un Globalvoice gratuit . <br /><br />" 
                );
            });
        }
    },
 
    givexp: 'giveexp',
    giveexp: function (target, room, user) {
        if (!this.can('roomowner')) return false;
        if (!target || target.indexOf(',') < 0) return this.parse('/help giveexp');
 
        let parts = target.split(',');
        let username = parts[0];
        let uid = toId(username);
        let amount = isExp(parts[1]);
 
        if (amount > 1000) return this.sendReply("Vous ne pouvez pas donner plus de 1000 exp à la fois.");
        if (username.length >= 19) return this.sendReply("Les noms d'utilisateurs sont requis pour être plus grand que 19 caractères.");
        if (typeof amount === 'string') return this.errorReply(amount);
        if (!Users.get(username)) return this.errorReply("L'utilisateur n'a peut-être pas été trouvé.");
 
 
        WL.addExp(uid, this.room, amount);
        this.sendReply(uid + " has received " + amount + ((amount === 1) ? " exp." : " exp."));
    },
    giveexphelp: ["/giveexp [utilisateur], [montant] - Donne à un utilisateur de l'expérience."],
 
    resetexp: 'resetxp',
    confirmresetexp: 'resetxp',
    resetxp: function (target, room, user, conection, cmd) {
        if (!target) return this.errorReply('USAGE: /resetxp (USER)');
        let parts = target.split(',');
        let targetUser = parts[0].toLowerCase().trim();
        if (!this.can('roomowner')) return false;
        if (cmd !== 'confirmresetexp') {
            return this.popupReply('|html|<center><button name="send" value="/confirmresetexp ' + targetUser + '"style="background-color:red;height:300px;width:150px"><b><font color="white" size=3>Confirm XP reset of ' + hashColors(targetUser, true) + '; c est seulement utilisé en cas d urgence, ne peut pas être annulé!</font></b></button>');
        }
        Db('exp').set(toId(target), 0);
        if (Users.get(target)) Users.get(target).popup('Votre expérience a été réinitialisé par un Administrateur. Cela ne peut pas être annulé et personne en dessous du rang d Administrateur peut vous aider ou répondre à ces questions.');
        user.popup("|html|Vous avez réinitialisé l'exp de " + hashColors(targetUser, true) + ".");
        Monitor.adminlog('[EXP Monitor] ' + user.name + ' a réinitialisé l exp de ' + target);
        room.update();
    },
 
    doublexp: 'doubleexp',
    doubleexp: function (target, room, user) {
        if (!this.can('roomowner')) return;
        DOUBLE_XP = !DOUBLE_XP;
        return this.sendReply('Double XP a été tourné en : ' + (DOUBLE_XP ? 'ON' : 'OFF') + '.');
    },
 
    /*expon: function (target, room, user) {
        if (!this.can('root')) return false;
        Db('expoff').remove(user.userid);
        this.sendReply("Vous n'êtes plus dispensé d'XP");
    },
 
    expoff: function (target, room, user) {
        if (!this.can('root')) return false;
        Db.expoff.set(user.userid, true);
        this.sendReply("Vous êtes maintenant dispensé d'XP");
    },*/
 
    '!xpladder': true,
    expladder: 'xpladder',
    xpladder: function (target, room, user) {
        if (!target) target = 100;
        target = Number(target);
        if (isNaN(target)) target = 100;
        if (!this.runBroadcast()) return;
        let keys = Db('exp').keys().map(name => {
            return {name: name, exp: Db('exp').get(name)};
        });
        if (!keys.length) return this.sendReplyBox("EXP ladder is empty.");
        keys.sort(function (a, b) { return b.exp - a.exp; });
        this.sendReplyBox(rankLadders('Exp Ladder', "EXP", keys.slice(0, target), 'exp') + '</div>');
    },
};
'use strict';

global.rankLadders = function (title, type, array, prop, group) {
	let groupHeader = group || 'Username';
	const ladderTitle = '<center><h4><u>' + title + '</u></h4></center>';
	const thStyle = 'class="rankladder-headers default-td" style="background: -moz-linear-gradient(#576468, #323A3C); background: -webkit-linear-gradient(#576468, #323A3C); background: -o-linear-gradient(#576468, #323A3C); background: linear-gradient(#576468, #323A3C); box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
	const tableTop = '<div style="max-height: 310px; overflow-y: scroll;">' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr>' +
			'<th ' + thStyle + '>Rank</th>' +
			'<th ' + thStyle + '>' + groupHeader + '</th>' +
			'<th ' + thStyle + '>' + type + '</th>' +
		'</tr>';
	const tableBottom = '</table></div>';
	const tdStyle = 'class="rankladder-tds default-td" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
	const first = 'class="first default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
	const second = 'class="second default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
	const third = 'class="third default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
	let midColumn;

	let tableRows = '';

	for (let i = 0; i < array.length; i++) {
		if (i === 0) {
			midColumn = '</td><td ' + first + '>';
			tableRows += '<tr><td ' + first + '>' + (i + 1) + midColumn + hashColors(array[i].name, true) + midColumn + array[i][prop] + '</td></tr>';
		} else if (i === 1) {
			midColumn = '</td><td ' + second + '>';
			tableRows += '<tr><td ' + second + '>' + (i + 1) + midColumn + hashColors(array[i].name, true) + midColumn + array[i][prop] + '</td></tr>';
		} else if (i === 2) {
			midColumn = '</td><td ' + third + '>';
			tableRows += '<tr><td ' + third + '>' + (i + 1) + midColumn + hashColors(array[i].name, true) + midColumn + array[i][prop] + '</td></tr>';
		} else {
			midColumn = '</td><td ' + tdStyle + '>';
			tableRows += '<tr><td ' + tdStyle + '>' + (i + 1) + midColumn + hashColors(array[i].name, true) + midColumn + array[i][prop] + '</td></tr>';
		}
	}
	return ladderTitle + tableTop + tableRows + tableBottom;
};