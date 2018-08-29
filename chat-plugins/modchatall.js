'use strict';

exports.commands = {
	lmc: 'laddermodchat',
	laddermodchat: function (target, room, user, connection) {
		if (!Config.gmodchatlock) {
			if (target === 'off') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/laddermodchat - Access denied.");
				}
				if (Config.laddermodchat === false) return this.errorReply("Ladder Modchat is already disabled!");
				Config.laddermodchat = false;
				this.popupReply("Ladder Modchat disabled.");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">Ladder modchat was disabled!</div>").update();
			});
			} else if (target === 'ac' || target === '+') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/pmmodchat - Access denied.");
				}
				if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
				Config.laddermodchat = target;
				this.popupReply("Ladder Modchat set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
				});
			} else if (target === '%' || target === '@' || target === '*' || target === '$' || target === '&' || target === '~') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/pmmodchat - Access denied.");
				}
				if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
				Config.laddermodchat = target;
				this.popupReply("Ladder Modchat set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global')curRoom.addRaw("<div class=\"broadcast-red\">Ladder Modchat was set to " + target + ".</div>").update();
				});
			} else if (Config.gmodchatlock) {
				return this.errorReply("You did not select an approate value. Correct values are : off, autoconfirmed, +, %, @, *, $, &, ~");
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},
		
	pmc: 'pmmodchat',
	pmmodchat: function (target, room, user, connection) {
		if (!Config.gmodchatlock) {
			if (target === 'off') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/pmmodchat - Access denied.");
				}
				if (Config.pmmodchat === false) return this.errorReply("PM Modchat is already disabled!");
				Config.pmmodchat = false;
				this.popupReply("PM Modchat disabled.");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">PM modchat was disabled!</div>").update();
			});
			} else if (target === 'ac' || target === '+') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/pmmodchat - Access denied.");
				}
				if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
				Config.pmmodchat = target;
				this.popupReply("PM Modchat set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
				});
			} else if (target === '%' || target === '@' || target === '*' || target === '$' || target === '&' || target === '~') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/pmmodchat - Access denied.");
				}
				if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
				Config.pmmodchat = target;
				this.popupReply("PM Modchat set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global')curRoom.addRaw("<div class=\"broadcast-red\">PM Modchat was set to " + target + ".</div>").update();
				});
			} else if (Config.gmodchatlock) {
				return this.errorReply("You did not select an approate value. Correct values are : off, ac, +, %, @, *, $, &, ~");
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},
	
	rmc: 'roommodchat',
	roommodchat: function (target, room, user, connection) {
		if (!Config.gmodchatlock) {
			if (target === 'off') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/roommodchat - Access denied.");
				}
				if (Config.chatmodchat === false) return this.errorReply("Global room modchat is currently disabled!");
				
				Config.chatmodchat = false;
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">Room modchat was disabled!</div>").update();
					curRoom.modchat = false;
				});
				this.popupReply("Room Modchat was disabled.");
			} else if (target === 'autoconfirmed' || target === '+') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/roommodchat - Access denied.");
				}
				if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");
				
				Config.chatmodchat = target;
				this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
					curRoom.modchat = target;
				});
				Config.battlemodchat = target;
			} else if  (target === '%' || target === '@' || target === '*' || target === '#' || target === '&') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/roommodchat - Access denied.");
				}
				if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");
				
				Config.chatmodchat = target;
				if (target != "#") {
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
				} else {
					this.popupReply("Room modchat was set to " + target + ". Battle modchat could not be set to " + target + ".");
				}
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-red\">Room modchat was set to " + target + ".</div>").update();
					curRoom.modchat = target;
				});
				if (target != "#") {
					Config.battlemodchat = target;
				}
			} else if (target === '~') {
				if (!user.hasConsoleAccess(connection)) {
					return this.errorReply("/roommodchat - Access denied.");
				}
				if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");
				
				Config.chatmodchat = target;
				this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
				Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-red\">Room modchat was set to " + target + " because of a sysop thinking something is wrong. ONLY listen to any ~ online. All PMs will also be made to only allow ~ to use.</div>");
					curRoom.modchat = target;
				})
				this.parse("/pmmodchat ~");
				Config.battlemodchat = target;
			} else {
				return this.errorReply("You did not select an approate value. Correct values are : off, ac, +, %, @, *, #, &, ~");
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},
	
	gmcl: 'globalmodchatlock',
	globalmodchatlock: function (target, room, user, connection, cmd) {
		let allowed = ['joltsjolteon']
		if (allowed.includes(user.userid)) {
			if (!Config.gmodchatlock) {
				this.send("Enabling global modchat lock...");
				Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + " enabled global modchat lock.");
				Config.gmodchatlock = true;
				console.log(Chat.escapeHTML(user.name) + " has enabled the Global modchat lock.");
			} else {
				this.send("Disabling global mod lock...");
				Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + "  disabled global modchat lock.");
				Config.gmodchatlock = false;
				console.log(Chat.escapeHTML(user.name) + " has disabled the Global modchat lock.");
			}
		} else {
			return this.errorReply("The command \"/globalmodchatlock\" does not exist. To send a message starting with \"/globalmodchatlock\", type \"//globalmodchatlock\".")
		}
	},
	
	gmclc: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/gmclc - Access denied.");
		}
		this.sendReply(Config.gmodchatlock);
	},
	
	mclc: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/mclc - Access denied.");
		}
		this.sendReply(Config.modchatlock)
	},
	
	mcl: 'modchatlock',
	modchatlock: function (target, room, user, connection, cmd) {
		if (!this.can('forcewin')) {
			return this.errorReply("/modchatlock - Access denied.");
		}
		if (!Config.modchatlock) {
			this.send("Enabling modchat lock...");
			Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + " enabled modchat lock.");
			Config.modchatlock = true;
			console.log(Chat.escapeHTML(user.name) + " has enabled the modchat lock.");
		} else {
			this.send("Disabling modchat lock...");
			Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + "  disabled modchat lock.");
			Config.modchatlock = false;
			console.log(Chat.escapeHTML(user.name) + " has disabled the modchat lock.");
		}
	}
};