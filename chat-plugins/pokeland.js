'use strict';
const fs = require('fs');
const RESULTS_MAX_LENGTH = 10;
const MAX_REASON_LENGTH = 300;

exports.commands = {

	/*roomlist: function(target, room, user) {
		if (!this.runBroadcast()) return;

		let targetRoomsPub = [];
		let targetRoomsPri = [];
		for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
			let tRoom = Rooms.global.chatRooms[i];
			if (tRoom.isPrivate) {
				targetRoomsPri.push(`<a href="/${tRoom.id}">${tRoom.title}</a> (${tRoom.userCount})`);
			} else {
				targetRoomsPub.push(`<a href="/${tRoom.id}">${tRoom.title}</a> (${tRoom.userCount})`);
			}
		}
		this.sendReplyBox(`<b>Salles publiques</b>:<br />${targetRoomsPub.join(', ')} <br /><br /><b>Salles privées</b>:<br />${targetRoomsPri.join(', ')}`);
	},*/

	pic: 'image',
	image: function(target, room, user) { // if (Users.whitelist[toId(target)])
		if (!target) return this.sendReply('/image [url] - Montre une image.');
		if (this.can('ban')) {
			target = Chat.escapeHTML(target);
			return this.add('|raw|<center><b>' + Chat.escapeHTML(user.name) +'</b> - <a href="'+ target.trim() +'">'+ target +'</a><br><img src="' + target + '">');
		}
	},
	gethex: 'hex',
	hex: function(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!this.canTalk()) return;
		if (!target) target = user.userid;
		return this.sendReplyBox('<b><font color="' + hashColor(target) + '">' + target + '</font></b>.  Le hexcode de ce pseudo est: <code><big><b>' + hashColor(target) + '</b></big></code>');
	},

	declaregreen: 'declarered',
	declarered: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		if (cmd === 'declarered') {
			this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
		} else if (cmd === 'declaregreen') {
			this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
		}
	},

	pmroom: 'roomannounce',
	roomannounce: function(target, room, user) {
		if (!this.can('declare', null, room)) return false;
		if (!target) return this.errorReply('/pmroom [message] - Envoie un message privé à tout les utilisateurs d\'une salle.');

		let pmName = '~Annonce ' + room;

		for(var i in room.users) {
			let user = Users.get(i);
			//if (Users.blocks[user.userid]) continue;
			let message = '|pm|' + pmName + '|' + user.getIdentity() + '|' + target;
			user.send(message);
		}
	},
	
	reports: 'signaler',
	signaler: function(target, room, user) {
		if (!target) return this.errorReply('/signaler - Permet d\'envoyer un problème au staff.');
		if (target.length > 400) this.errorReply('Essayez de rendre vos signalements les plus compactes possible.');

		var rep = '**'+ user.name +' a signalé**: '+ target.trim();

		if (user.isStaff) return this.errorReply('Impossible de signaler quelqu\'un et/ou quelque chose en faisant partie du staff. Pure crétin.')

		Rooms.get('staff').add('|c| [Serveur]|' + rep);
		Rooms.get('staff').update();
		Users.users.forEach(function (user) {
			if (user.isStaff) {
				user.send('|pm| [Serveur]|' + user.getIdentity() + '|' + rep);
			}
		});

	},

	forum: function (target, room, user) {
		if (!this.runBroadcast()) return; 
		var str = "<b>Forum</b><br>" +
			"• <a href='http://pokelandfr.forumactif.com/''><b>Forum</b></a><br />"  
		if (!this.broadcasting && user.isStaff) {
			str += "<br />• <a href='http://pokelandfr.forumactif.com/f5-staff'>Section Staff</a>";
		}
		this.sendReplyBox(str);
	},
	};
